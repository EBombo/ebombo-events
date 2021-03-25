const logger = require("../../../utils/logger");
const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putDescription = async (req, res, next) => {
    logger.log("put tournamentTeam description->", req.params, req.body);

    try {
        const {tournamentTeamId} = req.params;
        const tournamentTeamDescription = req.body.description;

        await updateTournamentTeam(tournamentTeamId, {
            description: tournamentTeamDescription,
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
