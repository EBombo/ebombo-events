const {sendBallots} = require("../../../ballots/sendBallots");
const {config} = require("../../../config");
const {transaction} = require("../../../transactions");
const logger = require("../../../utils/logger");
const {mapCoupon} = require("../../coupon");
const {fetchUser, updateUser} = require("../../../collections/users");
const {get, isEmpty, defaultTo, concat} = require("lodash");
const momentTz = require("moment-timezone");
const moment = require("moment");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");

const template = fs
    .readFileSync(path.join(__dirname, "../../../email/templates/charge.html"))
    .toString();

const chargePaypal = async (req, res, next) => {
    logger.log("payment paypal->", req.params, req.body);

    const momentLATAM = momentTz().tz("America/Lima");

    try {
        const {userId} = req.params;
        const {order, coupon} = req.body;

        const user = await fetchUser(userId);
        const amount = +get(order, "purchase_units[0].amount.value", 0);

        logger.log("paypal amount", amount);

        let couponResponse;
        let expiringMoney;

        if (coupon) {
            couponResponse = await mapCoupon(
                coupon.couponCode,
                amount,
                user,
                momentLATAM
            );
            expiringMoney = await mapExpiringMoney(couponResponse);
        }

        const totalMoneyCharged = totalMoneyCharged_(amount, expiringMoney);
        const expireDate = coupon ? get(expiringMoney, "expireDate", null) : null;
        const giftedMoney = get(couponResponse, "additionalMoney", 0);

        const transactionId = await successCharge(
            user,
            amount,
            couponResponse,
            giftedMoney,
            totalMoneyCharged,
            expiringMoney,
            expireDate,
            order
        );

        await sendBallots(
            user,
            amount,
            `de ${config.currency} ${amount} por paypal`,
            6
        );

        return res.status(200).send({transactionId});
    } catch (error) {
        logger.error("Paypal ERROR =>", error);
        next(error);
    }
};

const mapExpiringMoney = (couponResponse) => ({
    money: couponResponse.additionalMoney,
    expireDate: couponResponse.moneyExpireDate,
});

const totalMoneyCharged_ = (amount, expiringMoney) =>
    amount + get(expiringMoney, "money", 0);

const successCharge = async (
    user,
    amount,
    couponResponse,
    giftedMoney,
    totalMoneyCharged,
    expiringMoney,
    expireDate,
    order
) => {
    await transaction(
        "charge",
        user,
        +amount,
        transactionMessage(user, get(couponResponse, "coupon", []), amount),
        null,
        coupon_(get(couponResponse, "coupon", {})),
        order,
        totalMoneyCharged
    );

    await updateUser_(user, amount, expiringMoney, couponResponse);

    await sendEmail_(user, amount, giftedMoney, expireDate);
};

const transactionMessage = (user, coupon, money) => {
    let message = `Recargó ${money} money por PayPal`;

    if (!isEmpty(coupon))
        message = `${message} con el cupón ${coupon.couponCode} de tipo ${coupon.couponType}`;
    return message;
};

const coupon_ = (coupon) => {
    if (!isEmpty(coupon)) {
        delete coupon.createAt;
        delete coupon.updateAt;
    }
    return coupon;
};

const updateUser_ = async (user, amount, expiringMoney, couponResponse) => {
    const userExpiringMoney = defaultTo(user.expiringMoney, []);
    const userEbCoins = +defaultTo(user.ebCoins, 0);
    const expiringMoney_ = defaultTo(expiringMoney, []);

    let newUser = {
        money: +(+defaultTo(user.money, 0) + +amount).toFixed(2),
        totalMoneyCharge: +(+get(user, "totalMoneyCharge", 0) + amount).toFixed(2),
    };

    get(couponResponse, "coupon.discountType") === "ebCoins"
        ? (newUser.ebCoins = +(
            userEbCoins + +couponResponse.additionalMoney
        ).toFixed(2))
        : (newUser.expiringMoney = concat(userExpiringMoney, expiringMoney_));

    await updateUser(user.id, newUser);
};

const sendEmail_ = async (user, amount, moneyGifted, dateExpiry = null) => {
    const isDateExpiry = !!dateExpiry;
    const isMoneyGifted = !!moneyGifted;
    const isCharge = !!amount;
    const dateExpiry_ = dateExpiry && moment(dateExpiry).format("DD MMM YYYY");

    await sendEmail(user.email, `Recarga de ${config.currency}`, template, {
        name: user.name,
        amount: amount,
        email: user.email,
        isCharge: isCharge,
        moneyGifted: moneyGifted,
        isMoneyGifted: isMoneyGifted,
        isDateExpiry: isDateExpiry,
        dateExpiry: dateExpiry_,
        applicationRootUrl: config.applicationRootUrl,
        currency: config.currency,
    });
};

module.exports = {chargePaypal};
