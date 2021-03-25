const logger = require("../../../utils/logger");
const {get} = require("lodash");
const {
    updateTournamentTeam,
    fetchTournamentTeam,
} = require("../../../collections/tournamentTeams");

exports.putScore = async (req, res, next) => {
    logger.log("put score tournamentTeam->", req.params, req.body);

    try {
        const {tournamentTeamId} = req.params;
        const {score, indexMatch} = req.body;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);

        let newScore = get(tournamentTeam, "score", []);

        newScore[indexMatch] = score;

        await updateTournamentTeam(tournamentTeamId, {
            score: newScore,
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
