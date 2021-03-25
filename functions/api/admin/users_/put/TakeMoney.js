const {transaction} = require("../../../../transactions");
const {firestore, config} = require("../../../../config");
const {defaultTo, get} = require("lodash");
const moment = require("moment");

exports.takeMoney = async (req, res, next) => {
    try {
        const userId = get(req, "params.userId");
        const amount = +get(req, "body.user.amount");
        const reason = get(req, "body.user.reason");
        const admin = get(req, "body.admin");

        const user = await user_(userId);
        const action = "take-money";

        let transactionMessage = transactionMessage_(amount, reason);

        let money = defaultTo(user.money, 0) - amount;

        if (money < 0) money = 0;

        await transaction(action, user, +amount, transactionMessage, null, admin);

        await updateUser_(userId, {money});

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const transactionMessage_ = (amount, reason) => {
    message = `Se le ha quitado ${config.currency} ${amount} por el admin. Motivo: ${reason}`;

    return message;
};

const user_ = async (userId) => {
    const user = await firestore.collection("users").doc(userId).get();
    return user.data();
};

const updateUser_ = async (userId, user) => {
    const userRef = firestore.collection("users").doc(userId);
    await userRef.update(user);
};
