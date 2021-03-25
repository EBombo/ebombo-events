const {fetchUser} = require("../../../collections/users");
const {fetchMatch, updateMatch} = require("../../../collections/matches");
const logger = require("../../../utils/logger");

const getInvitation = async (req, res, next) => {
    try {
        logger.log("match team invitaion->", req.params);

        const {matchId, userId, invitationId} = req.params;

        const match = await fetchMatch(matchId);

        const user = await fetchUser(userId);
        const userInvited = await fetchUser(invitationId);

        const userIs = match.challengerIds.includes(user.id)
            ? "challenger"
            : "challenged";

        const newMatch = mapMatch(match, userIs, userInvited);

        await updateMatch(match.id, newMatch);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const mapMatch = (match, userIs, userInvited) =>
    match[`${userIs}AcceptInvitation`].includes(userInvited.id)
        ? {
            id: match.id,
            [`${userIs}`]: [
                ...match[`${userIs}`].filter((user_) => user_.id !== userInvited.id),
            ],
            [`${userIs}Ids`]: [
                ...match[`${userIs}Ids`].filter(
                    (userId_) => userId_ !== userInvited.id
                ),
            ],
            playersIds: [
                ...match.playersIds.filter((userId_) => userId_ !== userInvited.id),
            ],
        }
        : {
            id: match.id,
            [`${userIs}`]: [...match[`${userIs}`], userInvited],
            [`${userIs}Ids`]: [...match[`${userIs}Ids`], userInvited.id],
            playersIds: [...match.playersIds, userInvited.id],
        };

module.exports = {getInvitation};
