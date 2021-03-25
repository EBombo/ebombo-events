const {firestore, auth} = require("../config");
const logger = require("../utils/logger");

const validateAdmin = async (req, res, next) => {
    try {
        logger.log("req.headers.authorization", req.headers);

        const tokenId = req.headers.authorization.split("Bearer ")[1];

        const authUser = await auth.verifyIdToken(tokenId);

        const user = await user_(authUser.uid);

        if (!user.isAdmin) {
            res.status(400).send("access denied");
            return;
        }

        next();
    } catch (error) {
        next(error);
    }
};

const user_ = async (userId) => {
    const user = await firestore.doc("users/" + userId).get();
    return user.data();
};

module.exports = {validateAdmin};
