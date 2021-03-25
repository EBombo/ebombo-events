const {transaction} = require("../../../../transactions");
const {firestore, config} = require("../../../../config");
const {defaultTo, get} = require("lodash");
const {sendEmail} = require("../../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const moment = require("moment");
const {updateUser, fetchUser} = require("../../../../collections/users");
const {sendBallots} = require("../../../../ballots/sendBallots");
const logger = require("../../../../utils/logger");

const templateWithoutCoupon = fs
    .readFileSync(
        path.join(__dirname, "../../../../email/templates/adminAddMoney.html")
    )
    .toString();
const templateWithCoupon = fs
    .readFileSync(path.join(__dirname, "../../../../email/templates/charge.html"))
    .toString();

const currency = config.currency;

exports.adminChargeMoney = async (req, res, next) => {
    logger.log("add money ", req.params, req.body);

    try {
        const userId = get(req, "params.userId");
        const amount = +(+get(req, "body.amount")).toFixed(2);
        const paymentType = get(req, "body.paymentType");
        const noteTransaction = get(req, "body.noteTransaction");
        const realMoney = get(req, "body.realMoney");

        const user = await fetchUser(userId);

        let transactionMessage = transactionMessage_(amount, paymentType);

        const action = paymentType === "payment" ? "charge" : "free";

        let newUser = {};

        if (action === "charge") {
            const money = +defaultTo(user.money, 0) + +amount;

            const totalMoneyCharge = +get(user, "totalMoneyCharge", 0) + +amount;

            newUser.money = money;
            newUser.totalMoneyCharge = totalMoneyCharge;
            await sendBallots(user, amount, `de ${config.currency} ${amount} `, 8);
        } else {
            if (realMoney) {
                let expiringMoney = get(user, "expiringMoney", []);
                expiringMoney.push({
                    money: +amount,
                    expireDate: await expireDate(),
                });
                logger.log("->", expiringMoney);
                newUser.expiringMoney = expiringMoney;
            } else {
                let ebCoins = get(user, "ebCoins", 0) + +amount;
                logger.log("->", ebCoins);
                newUser.ebCoins = ebCoins;
            }
        }

        await updateUser(userId, newUser);

        await transaction(
            action,
            user,
            +amount,
            transactionMessage,
            noteTransaction
        );

        await sendEmail_(user, amount, paymentType, realMoney);

        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

const expireDate = async () => {
    const settingsDocumentSnapShot = await firestore
        .doc("settings/default")
        .get();
    const expireDate = defaultTo(
        settingsDocumentSnapShot.data().defaultExpirationOfMoney,
        7
    );

    return moment().add(expireDate, "days").toDate();
};

const transactionMessage_ = (amount, paymentType) => {
    let message = paymentType === "payment" ? "Pago de " : "Regalo de ";

    message = message.concat(`${amount} por el admin`);

    return message;
};

const sendEmail_ = async (user, amount, paymentType, realMoney) => {
    let mailSubject = "Dinero";

    mailSubject = mailSubject.concat(
        paymentType === "payment" ? " recargados" : " gratis"
    );

    await sendEmail(user.email, mailSubject, templateWithoutCoupon, {
        name: user.name,
        coins: paymentType !== "payment" && !realMoney ? `${amount} K` : amount,
        email: user.email,
        applicationRootUrl: config.applicationRootUrl,
        coinsPaymentType: paymentType === "payment",
        currency: paymentType !== "payment" && !realMoney ? "" : currency,
    });
};
