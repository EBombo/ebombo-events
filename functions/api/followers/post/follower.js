const {firestore, adminFirestore} = require("../../../config");
const {fetchUser} = require("../../../collections/users");

exports.addFollower = async (req, res, next) => {
    try {
        console.log("Add follower");

        const userId = req.query.userId;
        const followerUserId = req.query.followerUserId;

        const promiseFetchUser = fetchUser(userId);
        const promiseFetchFollowerUser = fetchUser(followerUserId);

        const promiseFetchAll = await Promise.all([
            promiseFetchUser,
            promiseFetchFollowerUser,
        ]);

        const user = promiseFetchAll[0];
        const followerUser = promiseFetchAll[1];

        await addFollower(user, followerUser);

        const promiseUpdateUser = updateUser(userId);
        const promiseUpdateFollowerUser = updateFollowerUser(followerUserId);

        await Promise.all([promiseUpdateUser, promiseUpdateFollowerUser]);

        return res.send(200);
    } catch (error) {
        console.error("Add follower", error);
        next(error);
    }
};

const addFollower = async (user, followerUser) => {
    const followerRef = await firestore.collection("followers").doc();

    const followerId = followerRef.id;

    await firestore
        .collection("followers")
        .doc(followerId)
        .set(mapFollower(user, followerUser, followerId));
};

const mapFollower = (user, followerUser, followerId) => ({
    id: followerId,
    createAt: new Date(),
    followerUser: followerUser,
    user: user,
});

const updateUser = async (userId) => {
    await firestore
        .collection("users")
        .doc(userId)
        .update("followersAmount", adminFirestore.FieldValue.increment(1));
};

const updateFollowerUser = async (followerUserId) => {
    await firestore
        .collection("users")
        .doc(followerUserId)
        .update("followingsAmount", adminFirestore.FieldValue.increment(1));
};
