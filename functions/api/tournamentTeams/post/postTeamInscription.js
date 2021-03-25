const {
    updateTournament,
    fetchTournament,
} = require("../../../collections/tournaments");
const {FieldValue} = require("@google-cloud/firestore");
const {firestore, config} = require("../../../config");
const {get, isEmpty} = require("lodash");
const logger = require("../../../utils/logger");
const {
    fetchTournamentTeamByTournamentAndUser,
} = require("../../../collections/tournamentTeams");
const {updateUser} = require("../../../collections/users");
const {fetchUser} = require("../../../collections/users");
const {transaction} = require("../../../transactions");

const postTeamInscription = async (req, res, next) => {
    logger.log("post tournamentTeam inscription ->", req.body, req.params);

    try {
        const {tournamentId, userId} = req.params;
        const team = get(req, "body");

        const tournament = await fetchTournament(tournamentId);

        const user = await fetchUser(userId);

        const currency = config.currency;

        const entryCost = +get(tournament, "entryCost", 0);

        if (get(tournament, "playerIds", []).includes(userId)) {
            const existTeam = await fetchTournamentTeamByTournamentAndUser(
                tournamentId,
                userId
            );

            logger.log("existe team->", existTeam);

            if (!isEmpty(existTeam))
                return res
                    .status(400)
                    .send({statusText: "Usted ya se encuentra inscrito en el torneo"});
        }

        if (+get(user, "money", 0) < entryCost)
            return res
                .status(400)
                .send({statusText: "Dinero insuficiente para inscribirse"});

        if (+get(tournament, "countTournamentTeams", 0) >= tournament.playersLimit)
            return res
                .status(400)
                .send({statusText: "Equipos inscritos completos"});

        await saveTournamentTeam(tournament, user, entryCost, team);

        await countTournamentTeams(tournament.id);

        await transaction(
            "user-tournament-inscription",
            user,
            +entryCost,
            `usuario pago inscripcion al torneo: ${tournament.name} el monto de ${entryCost} ${currency}`,
            `pago la inscripción del torneo ${tournament.id}`,
            tournament
        );

        await discountUsers(tournament, user, +entryCost);

        await updateTournament(tournamentId, {
            playerIds: [...tournament.playerIds, userId],
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const discountUsers = async (tournament, user, entryCost) => {
    if (get(tournament, "realMoney", true)) {
        return await updateUser(user.id, {
            money: +(+get(user, "money", 0) - entryCost).toFixed(2),
            totalTournaments: FieldValue.increment(1),
        });
    }
    return await updateUser(user.id, {
        ebCoins: +(+get(user, "ebCoins", 0) - entryCost).toFixed(2),
        totalTournaments: FieldValue.increment(1),
    });
};

const saveTournamentTeam = async (tournament, user, entryCost, team = null) => {
    const tournamentTeamsRef = firestore.collection("tournamentTeams");

    if (!isEmpty(team)) {
        return tournamentTeamsRef.doc(team.id).set({
            id: team.id,
            name: team.name,
            teamImageUrlThumb: team.teamImageUrlThumb,
            tournamentId: tournament.id,
            tournament,
            players: [user],
            playerIds: [user.id],
            playerIdsAcceptInvitation: [user.id],
            playersPayments: {[user.id]: entryCost},
            deleted: false,
            updateAt: new Date(),
            createAt: new Date(),
            isClosed: tournament.rule.totalPlayers === 1,
            isPayed: true,
        });
    }

    const tournamentTeamId = tournamentTeamsRef.doc().id;

    await tournamentTeamsRef.doc(tournamentTeamId).set({
        id: tournamentTeamId,
        tournamentId: tournament.id,
        tournament,
        players: [user],
        playerIds: [user.id],
        playerIdsAcceptInvitation: [user.id],
        playersPayments: {[user.id]: entryCost},
        deleted: false,
        updateAt: new Date(),
        createAt: new Date(),
        isClosed: tournament.rule.totalPlayers === 1,
        isPayed: true,
    });
};

const countTournamentTeams = async (tournamentId) =>
    await firestore.doc(`tournaments/${tournamentId}`).update({
        countTournamentTeams: FieldValue.increment(1),
    });

module.exports = {postTeamInscription};
