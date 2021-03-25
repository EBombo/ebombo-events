const {isEmpty, get} = require("lodash");
const logger = require("../../../utils/logger");
const {userRecoveryMoney} = require("../payAward");
const {fetchMatch, updateMatch} = require("../../../collections/matches");

const getRejectUser = async (req, res, next) => {
    logger.log("match cancel->", req.params);

    try {
        const {matchId, userId} = req.params;

        if (isEmpty(userId) || isEmpty(matchId)) return res.send(400);

        const match = await fetchMatch(matchId);

        await updateMatchMultiPlayer(match, userId);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const updateMatchMultiPlayer = async (match, userId) => {
    if (
        get(match, "rule.totalPlayers", 1) < 2 ||
        get(match, isChallenger(match, userId), []).length === 1
    ) {
        const userIds_ = get(match, "challengerAcceptInvitation", []).concat(
            get(match, "challengedAcceptInvitation", [])
        );
        const promises = userIds_.map(
            async (userId_) => await userRecoveryMoney(userId_, match.id)
        );
        await Promise.all(promises);
        return updateMatch(match.id, {isCanceled: true});
    }

    logger.log(
        "match",
        isChallenger(match, userId),
        `${isChallenger(match, userId)}Ids`
    );

    if (
        get(match, "challengerAcceptInvitation", []).includes(userId) ||
        get(match, "challengedAcceptInvitation", []).includes(userId)
    ) {
        await userRecoveryMoney(userId, match.id);
    }

    return updateMatch(match.id, {
        [isChallenger(match, userId)]: [
            ...match[isChallenger(match, userId)].filter(
                (user) => user.id !== userId
            ),
        ],
        [`${isChallenger(match, userId)}Ids`]: [
            ...match[`${isChallenger(match, userId)}Ids`].filter(
                (id) => id !== userId
            ),
        ],
        [`${isChallenger(match, userId)}AcceptInvitation`]: [
            ...match[`${isChallenger(match, userId)}AcceptInvitation`].filter(
                (id) => id !== userId
            ),
        ],
        playersIds: [...match.playersIds.filter((id) => id !== userId)],
    });
};

const isChallenger = (match, userId) =>
    get(match, "challengerIds", []).includes(userId)
        ? "challenger"
        : "challenged";

module.exports = {getRejectUser, updateMatchMultiPlayer};
