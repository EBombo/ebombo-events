const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");

exports.uploadProfilePicture = async (req, res, next) => {
    try {
        logger.log("update document user->", req.params.userId, req.body);

        const {userId} = req.params;
        const profileImages = req.body;

        await updateProfilePicture(userId, profileImages);

        return res.status(200).send("success");
    } catch (error) {
        logger.error("upload document ", error);
        next(error);
    }
};

const updateProfilePicture = async (userId, profileImages) =>
    await firestore.doc("users/" + userId).update({
        profileImageUrl: profileImages.profileImageUrl,
        profileImageUrlThumb: profileImages.profileImageUrlThumb,
    });
