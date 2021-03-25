const {querySnapshotToArray} = require("../../../utils");
const {firestore} = require("../../../config");
const moment = require("moment");
const {orderBy} = require("lodash");

exports.userPlayers = async (req, res, next) => {
    try {
        const querySnapshot = await firestore
            .collection("gameWeekUserPlayers")
            .where("userId", "==", req.params.userId)
            .orderBy("createAt")
            .startAfter(moment().subtract("1", "month").toDate())
            .limit(100)
            .get();

        const userPlayers = orderBy(
            querySnapshotToArray(querySnapshot),
            ["points", "createAt"],
            ["desc", "desc"]
        );

        res.send({
            userPlayers: userPlayers.slice(0, 5),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
