const logger = require("../../../utils/logger");
const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putTeamImage = async (req, res, next) => {
    logger.log("put tournamentTeam image->", req.params, req.body);

    try {
        const {tournamentTeamId} = req.params;
        const {teamImageUrl, teamImageUrlThumb} = req.body.teamImageUrls;

        await updateTournamentTeam(tournamentTeamId, {
            teamImageUrl,
            teamImageUrlThumb,
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
