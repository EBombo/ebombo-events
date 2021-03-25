const {
    updateTournament,
    fetchTournament,
} = require("../../../collections/tournaments");
const get = require("lodash/get");
const logger = require("../../../utils/logger");
const {transaction} = require("../../../transactions");
const {fetchUser} = require("../../../collections/users");
const {
    fetchTournamentTeam,
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putSendInvitation = async (req, res, next) => {
    logger.log("put tournamentTeam sent invitation->", req.params, req.body);

    try {
        const {tournamentTeamId, userId} = req.params;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);

        if (
            tournamentTeam.playerIds.length ===
            tournamentTeam.tournament.rule.totalPlayers
        )
            return res.status(400).send("Invitaciones completas");

        let user = await fetchUser(userId);

        if (!user) {
            user = get(req, "body.user", {id: userId});

            user.createAt = new Date();
            user.updateAt = new Date();

            await autoAcceptInvitation(tournamentTeam, user);
        }

        const promiseTransaction = transaction(
            "user-tournament-team-inscription",
            user,
            0,
            `usuario inscrito al torneo : ${tournamentTeam.tournament.name} por el equipo ${tournamentTeam.id}`,
            null,
            tournamentTeam.tournament,
            tournamentTeam
        );

        const promiseTeams = setTournamentTeams(tournamentTeam, user);

        await Promise.all([promiseTransaction, promiseTeams]);

        const tournament = await fetchTournament(tournamentTeam.tournamentId);

        await updateTournament(tournament.id, {
            playerIds: [...tournament.playerIds, userId],
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const setTournamentTeams = async (tournamentTeam, user) =>
    await updateTournamentTeam(tournamentTeam.id, {
        players: tournamentTeam.players.concat([user]),
        playerIds: tournamentTeam.playerIds.concat([user.id]),
        updateAt: new Date(),
    });

const autoAcceptInvitation = async (tournamentTeam, user) =>
    await updateTournamentTeam(tournamentTeam.id, {
        playerIdsAcceptInvitation: tournamentTeam.playerIdsAcceptInvitation.concat([
            user.id,
        ]),
        isClosed:
            tournamentTeam.playerIdsAcceptInvitation.concat([user.id]).length ===
            tournamentTeam.tournament.rule.totalPlayers,
    });
