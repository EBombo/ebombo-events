const {config} = require("../../../config");
const {transaction} = require("../../../transactions");
const {defaultTo, get} = require("lodash");
const {fetchUser, updateUser} = require("../../../collections/users");
const fs = require("file-system");
const path = require("path");

const currency = config.currency;

const paypalWithdraw = async (req, res, next) => {
    console.log("withdraw paypalWithdraw", req.params, req.body);

    try {
        const userId = req.params.userId;
        const amount = +req.body.amount;
        const paypalLink = req.body.paypalLink;

        const user = await fetchUser(userId);

        if (!checkWithdraw(user, amount))
            return res.status(400).send(`${currency} insuficiente`);

        const transactionMessage = `Retiro de ${amount} ${currency} por el usuario ${user.id}. Paypal: ${paypalLink}`;

        await transaction("withdraw", user, +amount, transactionMessage, "Paypal", {
            paypalLink,
        });

        user.money = get(user, "money", 0) - amount;

        await updateUser(userId, user);

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const checkWithdraw = (user, amount) => defaultTo(user.money, 0) >= amount;

module.exports = {paypalWithdraw};
