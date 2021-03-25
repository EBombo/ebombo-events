const logger = require("../../../../utils/logger");
const {updateUser, fetchUser} = require("../../../../collections/users");

exports.adminIsVerified = async (req, res, next) => {
    try {
        logger.log("adminIsVerifiedUser");
        const {userId} = req.params;

        const user = await fetchUser(userId);

        await updateUser(userId, {
            isVerified: !user.isVerified,
            updateAt: new Date(),
        });

        return res.send(200);
    } catch (error) {
        next(error);
    }
};
