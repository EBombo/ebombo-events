const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");
const {fetchTournamentTeam} = require("../../../collections/tournamentTeams");

exports.putAcceptInvitation = async (req, res, next) => {
    logger.log("put tournamentTeam accept invitation->", req.params);

    try {
        const {tournamentTeamId, userId} = req.params;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);

        if (
            tournamentTeam.playerIdsAcceptInvitation.length ===
            tournamentTeam.tournament.rule.totalPlayers
        )
            return res.status(400).send("Equipo completo");

        await setTournamentTeams(tournamentTeam, userId);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const setTournamentTeams = async (tournamentTeam, userId) =>
    await updateTournamentTeam(tournamentTeam.id, {
        playerIdsAcceptInvitation: tournamentTeam.playerIdsAcceptInvitation.concat([
            userId,
        ]),
        updateAt: new Date(),
        isClosed:
            tournamentTeam.playerIdsAcceptInvitation.concat([userId]).length ===
            tournamentTeam.tournament.rule.totalPlayers,
    });
