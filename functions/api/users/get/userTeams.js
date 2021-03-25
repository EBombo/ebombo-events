const {querySnapshotToArray} = require("../../../utils");
const {firestore} = require("../../../config");

exports.userTeams = async (req, res, next) => {
    try {
        const querySnapshot = await firestore
            .collection("gameWeekUserTeams")
            .where("user.id", "==", req.params.userId)
            .orderBy("points", "desc")
            .get();

        const userTeamsQty = querySnapshot.size;
        const userTeams = querySnapshotToArray(querySnapshot);

        res.send({
            userTeamsQty: userTeamsQty,
            userTeams: userTeams.slice(0, 5),
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
