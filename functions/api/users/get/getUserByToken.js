const logger = require("../../../utils/logger");
const { auth } = require("../../../config");

exports.getUserByToken = async (req, res, next) => {
  try {
    logger.log("getUserByToken", req.body);

    const { tokenId } = req.body;

    const authUser = await auth.verifyIdToken(tokenId);

    return res.send({ user: authUser });
  } catch (error) {
    logger.error(error);
    next(error);
  }
};
