const logger = require("../../../utils/logger");
const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putStreamUrl = async (req, res, next) => {
    logger.log("put tournamentTeam name->", req.params, req.body);

    try {
        const {tournamentTeamId} = req.params;
        const tournamentTeamStreamUrl = req.body.streamUrl;

        await updateTournamentTeam(tournamentTeamId, {
            streamUrl: tournamentTeamStreamUrl,
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
