const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {get} = require("lodash");
const {fetchUser, updateUser} = require("../../../collections/users")

const putUserReceiveEmail = async (req, res, next) => {
    try {
        logger.log("Put User Receive Email", req.params);

        const {userId} = req.params;

        const user = await fetchUser(userId);

        await updateUser(userId, {notifyInvitedToPlay: !user.notifyInvitedToPlay, updateAt: new Date()});

        return res.send(200);
    } catch (error) {
        logger.error("Error Update User Receive Email");
        next(error);
    }
};

module.exports = {putUserReceiveEmail};
