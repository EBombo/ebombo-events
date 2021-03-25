const {firestore, adminFirestore} = require("../../../config");
const {querySnapshotToArray} = require("../../../utils");
const logger = require("../../../utils/logger");

exports.deleteFollower = async (req, res, next) => {
    try {
        logger.log("Deleting follower");

        const userId = req.query.userId;
        const followerUserId = req.query.followerUserId;

        logger.log("Trying to delete follower", userId, followerUserId);

        const followerCollection = await fetchFollowerCollection(
            userId,
            followerUserId
        );

        logger.log("Follower collection", followerCollection);

        await deleteFollower("followers", followerCollection[0].id);

        const promiseUpdateUser = updateUser(userId);
        const promiseUpdateFollowerUser = updateFollowerUser(followerUserId);

        await Promise.all([promiseUpdateUser, promiseUpdateFollowerUser]);

        return res.send(200);
    } catch (error) {
        logger.log("Add follower error", error);
        next(error);
    }
};

const fetchFollowerCollection = async (userId, followerUserId) => {
    const followerCollection = await firestore
        .collection("followers")
        .where("user.id", "==", userId)
        .where("followerUser.id", "==", followerUserId)
        .get();

    return querySnapshotToArray(followerCollection);
};

const deleteFollower = async (collection, id) => {
    firestore.collection(collection).doc(id).delete();
};

const updateUser = async (userId) => {
    await firestore
        .collection("users")
        .doc(userId)
        .update("followersAmount", adminFirestore.FieldValue.increment(-1));
};

const updateFollowerUser = async (followerUserId) => {
    await firestore
        .collection("users")
        .doc(followerUserId)
        .update("followingsAmount", adminFirestore.FieldValue.increment(-1));
};
