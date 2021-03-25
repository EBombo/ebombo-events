const {fetchSettings} = require("../../../collections/settings");
const {updateMatch} = require("../../../collections/matches");
const {fetchTournament} = require("../../../collections/tournaments");
const {
    fetchTournamentGroup,
} = require("../../../collections/tournamentGroups");
const {
    calculateScoreByGroup,
} = require("../../../api/tournamentGroup/put/putCalculatePointsByGroup");
const {payAward} = require("../payAward");
const {updateChallenge} = require("../../../collections/challenges");
const {fetchUser, updateUser} = require("../../../collections/users");
const {
    changeMatchPointsClosed,
    takeMoney,
} = require("../changeMatchPointsClosed");
const {calculateAward} = require("../../../utils/calculateAward");
const {
    fetchTransactionsByMatch,
    deletedTransactions,
} = require("../../../collections/transactions");
const logger = require("../../../utils/logger");
const {get} = require("lodash");

const stepFour = async (match, reqBody) => {
    const {userId, stepType, challengerPoints, challengedPoints} = reqBody;
    const settings = await fetchSettings();

    if (stepType === "accept result")
        await acceptMatchResults(match.id, match, userId);

    if (stepType === "grant victory") await grantVictory(match, userId);

    if (stepType === "resolve claim" && (!match.isClosed || match.tournamentId)) {
        await resolveClaimOfMatch(match, challengerPoints, challengedPoints);

        await updateMatch(match.id, {isClosed: true, resolvedAt: new Date()});
        match.challengeId &&
        (await updateChallenge(match.challengeId, {isClosed: true}));

        if (match.tournamentId) {
            const tournament = await fetchTournament(match.tournamentId);
            const tournamentGroup = await fetchTournamentGroup(
                match.tournamentGroupId
            );

            if (
                tournament.tournamentType.includes("group") &&
                tournamentGroup.phase === 0
            )
                return calculateScoreByGroup(tournament, tournamentGroup);
        }
    }

    if (stepType === "cancel match" && !match.isClosed) await cancelMatch(match);

    if (stepType === "resolve claim" && match.isClosed && !match.tournamentId)
        return changeMatchPointsClosed(match, reqBody, settings);

    if (stepType === "cancel match" && match.isClosed && !match.tournamentId)
        return cancelMatchClosed(match, settings);

    logger.log("go to payAward", match.id);
    await payAward(match.id);
};

const acceptMatchResults = async (matchId, match, userId) => {
    logger.log("Step 4 => accept result");

    await updateMatch(matchId, {
        [`${isChallenger(userId, match)}AcceptResult`]: userId,
    });
};

const grantVictory = async (match, userId) => {
    logger.log("Step 4 => grant victory");

    const match_ = {
        challengerAcceptResult: match.challenger[0].id,
        challengerAddOpponent: match.challenger[0].id,
        challengerEntered: match.challenger[0].id,
        challengedAcceptResult: match.challenged[0].id,
        challengedAddOpponent: match.challenged[0].id,
        challengedEntered: match.challenged[0].id,
    };

    if (isChallenger(userId, match)) {
        match_.challengerPoints = [0];
        match_.challengedPoints = [1];
    } else {
        match_.challengerPoints = [1];
        match_.challengedPoints = [0];
    }

    await updateMatch(match.id, match_);
};

const resolveClaimOfMatch = async (
    match,
    challengerPoints,
    challengedPoints
) => {
    logger.log("Step 4 => resolve claim");

    await updateMatch(match.id, {
        challengerAcceptResult: match.challenger[0].id,
        challengerPoints: challengerPoints,
        challengedAcceptResult: match.challenged[0].id,
        challengedPoints: challengedPoints,
    });
};

const cancelMatch = async (match) => {
    logger.log("Step 4 => cancel match");

    await updateMatch(match.id, {
        challengerAcceptResult: match.challenger[0].id,
        challengerPoints: [0],
        challengedAcceptResult: match.challenged[0].id,
        challengedPoints: [0],
    });
};

const isChallenger = (userId, match) => {
    const challengerIds = match.challenger.map((user) => user.id);
    return challengerIds.includes(userId) ? "challenger" : "challenged";
};

const cancelMatchClosed = async (match, settings) => {
    const oldChallengerPoints = +get(match, "challengerPoints", []).reduce(
        (a, b) => a + b,
        0
    );
    const oldChallengedPoints = +get(match, "challengedPoints", []).reduce(
        (a, b) => a + b,
        0
    );

    logger.log("old points->", oldChallengerPoints, oldChallengedPoints);

    await updateMatch(match.id, {
        isCanceled: true,
        isClosed: true,
        challengerAcceptResult: match.challenger[0].id,
        challengedAcceptResult: match.challenged[0].id,
        updateAt: new Date(),
        resolvedAt: new Date(),
    });

    let transactions = await fetchTransactionsByMatch(match.id);

    logger.log("1 transactions->", transactions);

    transactions = transactions.filter((transaction) =>
        ["user-tie", "user-win", "user-lose"].includes(transaction.action)
    );

    logger.log("2 transactions->", transactions);

    const award = calculateAward(match.entryCost, settings);

    if (oldChallengerPoints !== oldChallengedPoints) {
        await takeMoney(match, award, oldChallengerPoints, oldChallengedPoints);

        const userIds_ = get(match, "challengerAcceptInvitation", []).concat(
            get(match, "challengedAcceptInvitation", [])
        );

        logger.log("id usuarios a devolver el dinero->", userIds_);

        const promises = userIds_.map(async (userId_) => {
            const subscriptionsHistoric = await transactions.find(
                (transaction) => transaction.user.id === userId_
            );
            logger.log(
                "subscriptionsHistoric->",
                get(subscriptionsHistoric, "user.subscriptions", [])
            );

            await userRecoveryMoneyHistoric(
                userId_,
                match.id,
                get(subscriptionsHistoric, "user.subscriptions", [])
            );
        });

        await Promise.all(promises);
    }

    await deletedTransactions(transactions);
};

const userRecoveryMoneyHistoric = async (userId, matchId, subscriptions) => {
    const user_ = await fetchUser(userId);

    let money = +get(user_, "money", 0);

    let expiringMoney = orderBy(
        get(user_, "expiringMoney", []),
        ["expireDate"],
        ["asc"]
    );

    if (subscriptions.matchId === matchId) {
        expiringMoney = expiringMoney.concat(subscriptions.expiringMoney);
        money += +subscriptions.money;
    }

    await updateUser(userId, {money, expiringMoney});
};

module.exports = {stepFour, userRecoveryMoneyHistoric};
