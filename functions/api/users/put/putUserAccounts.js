const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");

const putUserAccounts = async (req, res, next) => {
    try {
        logger.log("putUserAccounts ->", req.body);

        const user = {};

        user.userAccounts = req.body;
        user.id = req.params.userId;

        logger.log("User accounts", user);

        await updateUserAccounts(user);

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const updateUserAccounts = async (user) =>
    await firestore.collection("users").doc(user.id).update({
        userAccounts: user.userAccounts,
    });

module.exports = {putUserAccounts};
