const {sendBallots} = require("../../../ballots/sendBallots");
const {firestore, config} = require("../../../config");
const {transaction} = require("../../../transactions");
const {defaultTo, get, concat} = require("lodash");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const fetch = require("node-fetch");
const path = require("path");
const logger = require("../../../utils/logger");
const {mapCoupon} = require("../../coupon");
const moment = require("moment");
const momentTz = require("moment-timezone");
const {updateUser, fetchUser} = require("../../../collections/users");
const {fetchConsole} = require("../../../collections/consoles");
const {fetchGameWithLimit} = require("../../../collections/games");

const template = fs
    .readFileSync(path.join(__dirname, "../../../email/templates/charge.html"))
    .toString();

const currency = config.currency;

const chargeVisanet = async (req, res, next) => {
    logger.log("payment visanet->", req.params, req.body);

    const momentLATAM = momentTz().tz("America/Lima");

    const {userId, amount, currency, purchaseNumber, token} = req.params;
    const {customerEmail, channel, transactionToken} = req.body;

    const user = await fetchUser(userId);

    const couponId = get(req, "params.couponId", null);

    let coupon, couponResponse, expiringMoney;

    if (couponId) coupon = await fetchCoupon(couponId);

    const urlRedirect = await urlToRedirect(req);

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

    let transactionId;

    if (get(coupon, "discountType", false) === "free") {
        transactionId = await successCharge(
            user,
            +amount,
            couponResponse,
            giftedMoney,
            totalMoneyCharged,
            expiringMoney,
            expireDate,
            res
        );
        return res.send({transactionId});
    }

    try {
        const paymentData = {
            antifraud: null,
            captureType: "manual",
            channel: channel,
            countable: true,
            order: {
                amount: (+amount).toFixed(2),
                currency: currency,
                purchaseNumber: purchaseNumber,
                tokenId: transactionToken,
            },
            recurrence: null,
            sponsored: null,
        };

        logger.log("token", token);
        logger.log("paymentData", paymentData);

        const visaPaymentResponse = await fetchTransaction(paymentData, token);

        logger.log("visa response", visaPaymentResponse);
        logger.log(visaPaymentResponse.ok);
        logger.log(visaPaymentResponse.status);
        couponResponse && logger.log(couponResponse);

        if (visaPaymentResponse.ok) {
            const transactionInfo = await visaPaymentResponse.json();
            logger.log("transactionInfo->", transactionInfo);

            transactionId = await successCharge(
                user,
                +amount,
                couponResponse,
                giftedMoney,
                totalMoneyCharged,
                expiringMoney,
                expireDate,
                null,
                transactionInfo
            );

            await sendBallots(
                user,
                amount,
                `de ${config.currency} ${amount} por visanet`,
                6
            );

            return res.redirect(
                `${urlRedirect}?transactionId=${transactionId}&tab=top-up-money#right-menu`
            );
        }

        const responseText = await visaPaymentResponse.text();
        logger.error("ERROR", responseText);

        transactionId = await transaction(
            "reject-card",
            user,
            +amount,
            "Su tarjeta ha sido rechazada",
            null,
            responseText
        );

        return res.redirect(
            `${urlRedirect}?transactionId=${transactionId}&tab=top-up-money#right-menu`
        );
    } catch (error) {
        logger.error("VISA ERROR =>", error);
        return res.redirect(`${urlRedirect}?tab=top-up-money#right-menu`);
    }
};

const fetchTransaction = async (paymentData, token) =>
    await fetch(config.visanet.urlPayment + config.visanet.merchantId, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
        },
        body: JSON.stringify(paymentData),
    });

const successCharge = async (
    user,
    amount,
    couponResponse,
    giftedMoney,
    totalMoneyCharged,
    expiringMoney,
    expireDate,
    res,
    visaResponse = null
) => {
    await updateUser_(user, amount, expiringMoney, couponResponse);

    await sendEmail_(user, amount, giftedMoney, expireDate);

    return transaction(
        "charge",
        user,
        +amount,
        transactionMessage(user, get(couponResponse, "coupon", null), amount),
        null,
        coupon_(get(couponResponse, "coupon", null)),
        visaResponse,
        totalMoneyCharged
    );
};

const mapExpiringMoney = (couponResponse) => ({
    money: couponResponse.additionalMoney,
    expireDate: couponResponse.moneyExpireDate,
});

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

const totalMoneyCharged_ = (amount, expiringMoney) =>
    amount + get(expiringMoney, "money", 0);

const sendEmail_ = async (user, amount, moneyGifted, dateExpiry = null) => {
    const isDateExpiry = !!dateExpiry;
    const isMoneyGifted = !!moneyGifted;
    const isCharge = !!amount;
    const dateExpiry_ = dateExpiry && moment(dateExpiry).format("DD MMM YYYY");

    await sendEmail(user.email, `Recarga de ${currency} `, template, {
        name: user.name,
        amount: amount,
        email: user.email,
        isCharge: isCharge,
        moneyGifted: moneyGifted,
        isMoneyGifted: isMoneyGifted,
        isDateExpiry: isDateExpiry,
        dateExpiry: dateExpiry_,
        applicationRootUrl: config.applicationRootUrl,
        currency: currency,
    });
};

const fetchCoupon = async (couponId) => {
    const coupon = await firestore.doc("coupons/" + couponId).get();
    return coupon.data();
};

const coupon_ = (coupon) => {
    if (coupon) {
        delete coupon.createAt;
        delete coupon.updateAt;
    }
    return coupon;
};

const transactionMessage = (user, coupon, money) => {
    let message = `Recargó ${currency} ${money} por visanet`;

    if (coupon)
        message = `${message} y se aplico el cupón ${coupon.couponCode} de tipo ${coupon.couponType}`;

    if (get(coupon, "discountType", null) === "free")
        message = `Recargo ${currency} ${money} con el cupón ${coupon.couponCode} de tipo ${coupon.couponType}`;

    return message;
};

const urlToRedirect = async (req) => {
    const games = await fetchGameWithLimit(1);
    const console_ = await fetchConsole(games[0].consoleIds[0]);

    return `${req.headers.origin}/vs/games/${games[0].id}/consoles/${console_.id}`;
};

module.exports = {chargeVisanet};
