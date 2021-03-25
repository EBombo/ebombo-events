const {
    updateTournament,
    fetchTournament,
} = require("../../../collections/tournaments");
const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {get} = require("lodash");
const {transaction} = require("../../../transactions");
const {fetchUser} = require("../../../collections/users");
const {fetchTournamentTeam} = require("../../../collections/tournamentTeams");

exports.putRejectInvitation = async (req, res, next) => {
    logger.log("put tournamentTeam reject invitation->", req.params);

    try {
        const {tournamentTeamId, userId} = req.params;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);

        const players = tournamentTeam.players.filter(
            (player) => player.id !== userId
        );

        const playerIds = tournamentTeam.playerIds.filter(
            (playerId) => playerId !== userId
        );

        const playerIdsAcceptInvitation = tournamentTeam.playerIdsAcceptInvitation.filter(
            (playerId) => playerId !== userId
        );

        const user_ = await fetchUser(userId);

        if (user_) {
            const recoveryMoney = +get(
                tournamentTeam,
                `playersPayments[${userId}]`,
                0
            );

            await transaction(
                "user-tournament-team-reject",
                user_,
                +recoveryMoney,
                `usuario retirado del torneo : ${
                    tournamentTeam.tournament.name
                } del equipo ${tournamentTeam.id} ${
                    recoveryMoney > 0 ? `monto retribuido ${recoveryMoney}` : ""
                }`,
                `se retiro del torneo ${tournamentTeam.tournament.id} del equipo ${tournamentTeam.id}`,
                tournamentTeam.tournament,
                tournamentTeam
            );

            await updateUser(
                userId,
                +(+get(user_, "money", 0) + +recoveryMoney).toFixed(2)
            );
        }

        let playersPayments = {...tournamentTeam.playersPayments};

        delete playersPayments[userId];

        const tournament = await fetchTournament(tournamentTeam.tournamentId);

        await updateTournament(tournament.id, {
            playerIds: tournament.playerIds.filter((playerId) => playerId !== userId),
        });

        await setTournamentTeams(
            tournamentTeam,
            players,
            playerIds,
            playerIdsAcceptInvitation,
            playersPayments
        );

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const updateUser = async (userId, money) =>
    await firestore.doc(`users/${userId}`).update({
        money,
    });

const setTournamentTeams = async (
    tournamentTeam,
    players,
    playerIds,
    playerIdsAcceptInvitation,
    playersPayments
) =>
    await firestore.doc(`tournamentTeams/${tournamentTeam.id}`).update({
        players,
        playerIds,
        playerIdsAcceptInvitation,
        playersPayments,
        //isPayed: false,
        readyToPay: false,
        updateAt: new Date(),
    });
