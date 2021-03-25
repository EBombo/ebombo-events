const {querySnapshotToArray} = require("../../../utils");
const {firestore} = require("../../../config");

const userAwards = async (req, res, next) => {
    try {
        console.log("gameWeekUserAwards", req.params.userId);

        const querySnapshot = await firestore
            .collection("gameWeekUserAwards")
            .where("userId", "==", req.params.userId)
            .where("isNotificationRead", "==", false)
            .get();

        const userAwards = querySnapshotToArray(querySnapshot);

        await updateGameWeekUserAwards(userAwards);

        res.send([...userAwards]);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

const updateGameWeekUserAwards = async (userAwards) => {
    const batchRef = firestore.batch();

    userAwards.forEach((userAward) => {
        batchRef.update(
            firestore.collection("gameWeekUserAwards").doc(userAward.id),
            {
                isNotificationRead: true,
            }
        );
    });

    await batchRef.commit();
};

module.exports = {userAwards};
