const logger = require("../../../utils/logger");
const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putMembers = async (req, res, next) => {
    logger.log("put tournamentTeam members->", req.params, req.body);

    try {
        const {tournamentTeamId} = req.params;
        const tournamentTeamMembers = req.body.members;

        await updateTournamentTeam(tournamentTeamId, {
            members: tournamentTeamMembers,
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
