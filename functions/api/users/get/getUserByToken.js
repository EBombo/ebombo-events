const logger = require("../../../utils/logger");
const {auth} = require("../../../config");

exports.getUserByToken = async (req, res, next) => {
    try {
        logger.log("getUserByToken", req.params);

        const {tokenId} = req.params;

        const authUser = await auth.verifyIdToken(tokenId);

        return res.send({user: authUser});
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
