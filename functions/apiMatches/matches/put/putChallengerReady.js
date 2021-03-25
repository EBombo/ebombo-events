const logger = require("../../../utils/logger");
const {updateMatch} = require("../../../collections/matches");

const putChallengerReady = async (req, res, next) => {
    try {
        logger.log("putChallengerReady->", req.params);
        const {matchId} = req.params;

        await updateMatch(matchId, {
            challengerReady: true,
            updateAt: new Date(),
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

module.exports = {putChallengerReady};
