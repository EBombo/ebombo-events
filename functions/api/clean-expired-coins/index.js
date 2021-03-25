const {firestore} = require("../../config");
const {remove, get} = require("lodash");
const momentTz = require("moment-timezone");
const moment = require("moment");

exports.cleanExpiredMoney = async (req, res, next) => {
    console.log(
        "cleanExpiredMoney PERU-> ",
        req.params.userId,
        momentTz().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss")
    );

    try {
        const user = await user_(req.params.userId);

        if (!user) return res.send(200);

        remove(get(user, "expiringMoney", []), (amount) =>
            moment(amount.expireDate.toDate()).isBefore(momentTz().tz("America/Lima"))
        );

        const userRef = await firestore.collection("users").doc(user.id);

        await userRef.update({
            expiringMoney: get(user, "expiringMoney", []),
        });

        res.send(200);
    } catch (error) {
        next(error);
    }
};

const user_ = async (userId) => {
    const user = await firestore.collection("users").doc(userId).get();

    if (!user.exists) return null;

    return user.data();
};
