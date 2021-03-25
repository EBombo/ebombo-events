const {get, orderBy, isEmpty, defaultTo} = require("lodash");
const {updateMatch, fetchMatch} = require("../../collections/matches");
const {
    fetchTournamentTeam,
    updateTournamentTeam,
} = require("../../collections/tournamentTeams");
const {fetchTournament} = require("../../collections/tournaments");
const {fetchSettings} = require("../../collections/settings");
const {
    fetchTournamentGroup,
    updateTournamentGroup,
} = require("../../collections/tournamentGroups");
const {fetchUser, updateUser} = require("../../collections/users");
const {updateMatchUsers} = require("./updateMatchUsers");
const {transaction} = require("../../transactions");
const {calculateAward} = require("../../utils/calculateAward");
const {calculateFinishTime} = require("./calculateFinishTime");
const logger = require("../../utils/logger");
const {updateChallenge} = require("../../collections/challenges");
const {calculateScore} = require("../../business");
const moment = require("moment");
const momentTz = require("moment-timezone");
const {toNextPhase} = require("./toNextPhase");
const {
    fetchTransactionsByUserIdAndExtraIdAndAction,
} = require("../../collections/transactions");
const {FieldValue} = require("@google-cloud/firestore");

const payAward = async (matchId) => {
    const match = await fetchMatch(matchId);

    if (!match.challengerAcceptResult || !match.challengedAcceptResult) return;

    if (get(match, "tournamentId")) {
        const tournament = await fetchTournament(match.tournamentId);
        const tournamentGroup = await fetchTournamentGroup(match.tournamentGroupId);

        const challengerTeam = await fetchTournamentTeam(match.challengerTeamId);
        const challengedTeam = await fetchTournamentTeam(match.challengedTeamId);

        return saveScoreTournamentGroup(
            match,
            tournament,
            tournamentGroup,
            challengerTeam,
            challengedTeam
        );
    }

    await updateMatch(matchId, {isClosed: true, resolvedAt: new Date()});
    await updateChallenge(match.challengeId, {isClosed: true});

    const challengerPoints = +match.challengerPoints.reduce((a, b) => a + b, 0);
    const challengedPoints = +match.challengedPoints.reduce((a, b) => a + b, 0);

    if (challengerPoints === challengedPoints) {
        const userIds = get(match, "challengerAcceptInvitation", []).concat(
            get(match, "challengedAcceptInvitation", [])
        );

        const promisesTransactionUsers = userIds.map(
            async (userId) => await transactionTies(userId, match)
        );

        const promisesUserRecoveryMoney = userIds.map(
            async (userId) => await userRecoveryMoney(userId, match.id)
        );

        return Promise.all([promisesUserRecoveryMoney, promisesTransactionUsers]);
    }

    const settings = await fetchSettings();
    let newTotalAward = calculateAward(match.gameEntryCost, settings);

    logger.log("total award->", newTotalAward);

    if (challengerPoints > challengedPoints) {
        await updateMatchUsers(
            match.challenger,
            match.challenged,
            newTotalAward,
            match
        );
        return;
    }

    await updateMatchUsers(
        match.challenged,
        match.challenger,
        newTotalAward,
        match
    );
};

const reducePoints = (match, key) =>
    +get(match, key, []).reduce((a, b) => a + b, 0);

const saveScoreTournamentGroup = async (
    match,
    tournament,
    tournamentGroup,
    challengerTeam,
    challengedTeam
) => {
    const challengerPoints = reducePoints(match, "challengerPoints");
    const challengedPoints = reducePoints(match, "challengedPoints");

    logger.log(`puntos ${match.id} ->`, challengerPoints, challengedPoints);
    logger.log(`torneo ${tournament.id}->`, tournament);
    logger.log(`grupo ${tournamentGroup.id}->`, tournamentGroup);

    if (
        challengerPoints === challengedPoints &&
        (tournament.tournamentType.includes("knock-out") ||
            (tournament.tournamentType.includes("ko") && tournamentGroup.phase > 0))
    )
        return playAgain(match);

    await updateMatch(match.id, {isClosed: true, resolvedAt: new Date()});

    let score = get(tournamentGroup, "score", {});
    logger.log(`score ${tournamentGroup.id}->`, score);

    if (
        tournament.tournamentType.includes("group") &&
        tournamentGroup.phase === 0
    ) {
        score = calculateScore(
            tournament,
            match,
            challengerTeam,
            challengedTeam,
            score
        );
        logger.log(`new score group 1 ${tournamentGroup.id}->`, score);

        await updateTournamentTeam(match.challengerTeamId, {
            score: {
                ...score[match.challengerTeamId],
            },
        });

        await updateTournamentTeam(match.challengedTeamId, {
            score: {
                ...score[match.challengedTeamId],
            },
        });

        return updateTournamentGroup(match.tournamentGroupId, {
            score: {
                ...tournamentGroup.score,
                [match.challengerTeamId]: +score[match.challengerTeamId].points,
                [match.challengedTeamId]: +score[match.challengedTeamId].points,
            },
        });
    }

    score[match.challengerTeamId] = challengerPoints;
    score[match.challengedTeamId] = challengedPoints;

    const result =
        challengerPoints > challengedPoints
            ? {
                winnerId: match.challengerTeamId,
                loserId: match.challengedTeamId,
            }
            : {
                winnerId: match.challengedTeamId,
                loserId: match.challengerTeamId,
            };

    logger.log(`new score group 2 ${tournamentGroup.id}->`, score, result);

    const endDate = moment(momentTz().tz("America/Lima")).toDate();

    await updateTournamentTeam(match.challengerTeamId, {
        score: {
            ...get(challengerTeam, "score", {}),
            points: challengerPoints,
        },
    });

    await updateTournamentTeam(match.challengedTeamId, {
        score: {
            ...get(challengedTeam, "score", {}),
            points: challengedPoints,
        },
    });

    await updateTournamentGroup(match.tournamentGroupId, {
        score,
        endDate,
        ...result,
    });

    await toNextPhase(
        tournament,
        tournamentGroup,
        challengerTeam,
        challengedTeam,
        challengerPoints,
        challengedPoints
    );
};

const transactionTies = async (userId, match) => {
    const userTie = await fetchUser(userId);

    await transaction(
        "user-tie",
        userTie,
        +match.gameEntryCost,
        `el usuario ha empatado se devolvio: ${match.gameEntryCost} ${match.id}`,
        null,
        match
    );
};

const userRecoveryMoney = async (userId, matchId, tournamentId = "") => {
    const user_ = await fetchUser(userId);

    const transactionsStartMatch = await fetchTransactionsByUserIdAndExtraIdAndAction(
        userId,
        matchId,
        "user-start-match"
    );

    const currentTransaction = get(transactionsStartMatch, "[0]", {});

    let money = +get(user_, "money", 0);

    let expiringMoney = orderBy(
        get(user_, "expiringMoney", []),
        ["expireDate"],
        ["asc"]
    );

    let subscription = get(currentTransaction, "user.subscription", {});

    logger.log("subscription->", subscription);

    if (
        subscription.matchId === matchId ||
        subscription.tournamentId === tournamentId
    ) {
        expiringMoney = expiringMoney.concat(subscription.expiringMoney);
        money += +subscription.money;
    }

    await updateUser(userId, {money, expiringMoney});
};

const playAgain = async (match) =>
    await updateMatch(match.id, {
        challengerAddOpponent: FieldValue.delete(),
        challengedAddOpponent: FieldValue.delete(),
        challengerEntered: FieldValue.delete(),
        challengedEntered: FieldValue.delete(),
        challengerPoints: FieldValue.delete(),
        challengedPoints: FieldValue.delete(),
        challengerAcceptResult: FieldValue.delete(),
        challengedAcceptResult: FieldValue.delete(),
        createAt: new Date(),
        finishAt: calculateFinishTime(match.rule),
    });

module.exports = {payAward, userRecoveryMoney};
