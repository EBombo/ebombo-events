const {firestore} = require("../../../config");
const moment = require("moment");
const {get, defaultTo} = require("lodash");
const {fetchMatch, updateMatch} = require("../../../collections/matches");
const logger = require("../../../utils/logger");

const putClaim = async (req, res, next) => {
    try {
        const {matchId} = req.params;
        const match = await fetchMatch(matchId);
        match.claimCreateAt = defaultTo(match.claimCreateAt, new Date());

        const promiseSetClaim = setClaim(match);

        await Promise.all([promiseSetClaim]);
        return res.send(200);
    } catch (error) {
        logger.log("Setting claim error", error);
        next(error);
    }
};

const setClaim = async (match) => {
    const newMatch = {
        hasClaim: true,
        finishAt: finishAt(match),
        claimCreateAt: match.claimCreateAt,
        claimFinishAt: claimFinishAt(match),
    };

    await updateMatch(match.id, newMatch)
};

const finishAt = (match) =>
    moment(get(match, "claimCreateAt", new Date())).add(1, "day").toDate();

const claimFinishAt = (match) =>
    moment(match.claimCreateAt).add(30, "minutes").toDate();

module.exports = {putClaim};
