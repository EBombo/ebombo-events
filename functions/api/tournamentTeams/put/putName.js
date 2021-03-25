const logger = require("../../../utils/logger");
const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putName = async (req, res, next) => {
    logger.log("put tournamentTeam name->", req.params, req.body);

    try {
        const {tournamentTeamId} = req.params;
        const tournamentTeamName = req.body.name;

        await updateTournamentTeam(tournamentTeamId, {name: tournamentTeamName});

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
