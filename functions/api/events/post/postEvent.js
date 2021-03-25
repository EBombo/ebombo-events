const logger = require("../../../utils/logger");
const {saveEvent} = require("../../../collections/events");
const {fetchTournament} = require("../../../collections/tournaments");
const {fetchUser} = require("../../../collections/users");

exports.postEvent = async (req, res, next) => {
    try {
        logger.log("post event open->", req.params, req.body);

        const {tournamentId, userId, action} = req.params;

        const tournament = await fetchTournament(tournamentId);
        const user = await fetchUser(userId);

        let event = {action, user, createAt: new Date()};

        if (tournamentId) event.tournament = tournament;

        await saveEvent(event);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
