const logger = require("../../../utils/logger");
const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putTeamEvidences = async (req, res, next) => {
    logger.log("put tournamentTeam putTeamEvidences->", req.params, req.body);

    try {
        const {tournamentTeamId} = req.params;
        const teamImageUrls = req.body.teamImageUrls;

        await updateTournamentTeam(tournamentTeamId, {...teamImageUrls});

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
