const {defaultTo, get} = require("lodash");
const moment = require("moment");
const {transaction} = require("../../../../transactions");
const {firestore, config} = require("../../../../config");
const {
    updateTournament,
    fetchTournament,
} = require("../../../../collections/tournaments");
const {fetchSettings} = require("../../../../collections/settings");
const {fetchUser} = require("../../../../collections/users");
const logger = require("../../../../utils/logger");
const {
    fetchTournamentTeam,
} = require("../../../../collections/tournamentTeams");
const {updateUser} = require("../../../../collections/users");

exports.payWinners = async (req, res, next) => {
    try {
        logger.log("payWinners->", req.body, req.params);

        const tournamentId = get(req, "params.tournamentId");
        const teamsWinnerIds = get(req, "body.teamsWinnerIds");

        const tournament = await fetchTournament(tournamentId);

        await updateTournament(tournament.id, {
            isClosed: true,
            resolvedAt: new Date(),
        });

        const settings = await fetchSettings();

        if (tournament.fixedAwards)
            await payFixedAwards(tournament, teamsWinnerIds, settings);

        if (tournament.variableAwards)
            await payVariableAwards(tournament, teamsWinnerIds, settings);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const payFixedAwards = async (tournament, winners, settings) => {
    const promisesTeams = winners.map(async (teamId, idx) => {
        const team = await fetchTournamentTeam(teamId);
        const playerId = get(team, "playerIds[0]");

        const user = await fetchUser(playerId);

        let expiringMoney = get(user, "expiringMoney", []);
        let money = +get(user, "money", 0);

        const expireDate = defaultTo(settings.defaultExpirationOfMoney, 7);
        const award = +tournament.fixedAwards[idx].amount.toFixed(2);

        const transactionId = await transaction(
            "user-win-tournament",
            user,
            +award,
            tournament.fixedAwards[idx].awardType === "money"
                ? `Se le pago al usuario ${config.currency} ${award} del torneo ${tournament.id} de nombre :${tournament.name}`
                : `Se le pago en credito al usuario ${award} del torneo ${tournament.id} de nombre ${tournament.name}`,
            null,
            tournament
        );

        if (tournament.fixedAwards[idx].awardType === "money") money += award;

        if (tournament.fixedAwards[idx].awardType !== "money")
            expiringMoney.push({
                expireDate: moment().add(expireDate, "days").toDate(),
                money: +award,
            });

        await updateUser(playerId, {expiringMoney, money});

        logger.log("pay award transaction id", transactionId);
        return transactionId;
    });

    await Promise.all(promisesTeams);
};

const payVariableAwards = async (tournament, winners, settings) => {
    const totalTournamentAmount = +(
        tournament.entryCost * tournament.countTournamentTeams
    ).toFixed(2);

    let commission = settings.commission;

    const totalAward = +(totalTournamentAmount * (1 - commission / 100)).toFixed(
        2
    );

    const promiseTeams = winners.map(async (teamId, idx) => {
        const team = await fetchTournamentTeam(teamId);
        const playerId = get(team, "playerIds[0]");

        const award = +(
            ((tournament.variableAwards[idx] / 100) * totalAward) /
            team.length
        ).toFixed(2);

        const user = await fetchUser(playerId);

        const transactionId = await transaction(
            "user-win-tournament",
            user,
            +award,
            `Se le pago al usuario ${config.currency} ${award} del torneo ${tournament.id} de nombre ${tournament.name}`,
            null,
            tournament
        );

        const money = +get(user, "money", 0) + award;

        await updateUser(playerId, {money});

        logger.log("pay award transaction id", transactionId);
        return transactionId;
    });

    return await Promise.all(promiseTeams);
};
