const {userRecoveryMoney} = require("../payAward");
const {get} = require("lodash");
const moment = require("moment");
const {updateChallenge} = require("../../../collections/challenges");
const {transaction} = require("../../../transactions");
const {fetchUser} = require("../../../collections/users");
const {fetchMatch, updateMatch} = require("../../../collections/matches");
const logger = require("../../../utils/logger");

const getUserCancel = async (req, res, next) => {
    try {
        logger.log("getUserCancel->", req.params);

        const {userId, matchId, action} = req.params;

        const match = await fetchMatch(matchId);

        const isUser = get(match, "challengerIds", []).includes(userId)
            ? "challenger"
            : "challenged";

        if (action === "cancel") {
            match[`${isUser}Cancel`] = true;

            if (!match.cancelAt) match.cancelAt = moment().add(5, "minutes").toDate();
        }

        if (action === "nocancel") {
            match[`${isUser}Cancel`] = false;
            match.cancelAt = null;
        }

        if (action === "resume") {
            match.challengerCancel = null;
            match.challengedCancel = null;
            match.cancelAt = null;
        }

        if (
            action === "directCancel" &&
            !match.challengedPoints &&
            !match.challengerPoints &&
            !match.hasClaim
        ) {
            match.challengerCancel = true;
            match.challengedCancel = true;
            match.cancelAt = new Date();
        }

        if (match.isCanceled) {
            logger.log(`match ${match.id} ya fue cancelado`);
            return res.send(200);
        }

        match.isCanceled = !!(match.challengerCancel && match.challengedCancel);

        if (match.isCanceled) {
            await updateMatch(matchId, {isCanceled: true, resolvedAt: new Date()});
            await updateChallenge(match.challengeId, {isClosed: true});

            const userIds = get(match, "challengerAcceptInvitation", []).concat(
                get(match, "challengedAcceptInvitation", [])
            );

            const transactionPromises = userIds.map(async (userId_) => {
                const user = await fetchUser(userId_);
                await transaction(
                    "user-cancel-match",
                    user,
                    +match.gameEntryCost,
                    `El usuario cancelo una partida ${match.id} con costo de entrada de ${match.gameEntryCost}`,
                    null,
                    match
                );
                await userRecoveryMoney(userId_, match.id);
            });
            await Promise.all(transactionPromises);
        }

        await updateMatch(matchId, match);

        return res.send(200);
    } catch (Error) {
        next(Error);
    }
};

module.exports = {getUserCancel};
