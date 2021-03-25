const {firestore} = require("../../../config");
const {transaction} = require("../../../transactions");
const {defaultTo, get} = require("lodash");
const fetch = require("node-fetch");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const {config} = require("../../../config/index");
const {mapError} = require("../../coupon");

const template = fs
    .readFileSync(path.join(__dirname, "../../../email/templates/charge.html"))
    .toString();

const currency = config.currency;

const charge = async (req, res, next) => {
    const userId = req.params.userId;
    const {source_id, currency_code, email} = req.body;
    const amount = +get(req, "params.amount", 0) / 100;

    console.log("charge ", req.params, req.body);

    try {
        const user = await user_(userId);

        const culqiCharges = await fetchCulqiCharges(
            source_id,
            currency_code,
            email,
            amount
        );

        await updateUser(user, amount);

        const description = `Recargo de ${amount} por culqi`;

        await transaction("charge", user, +amount, description);

        await sendEmail_(user, amount);

        return res.status(200).send({
            message: get(culqiCharges, "outcome.user_message", "Recarga exitosa"),
        });
    } catch (error) {
        next(error);
        mapError(error, res, next);
    }
};

const mapExpiringCoins = (couponResponse) => ({
    coins: couponResponse.additionalCoins,
    expireDate: couponResponse.coinsExpireDate,
});

const totalCoinsCharged_ = (amount, expiringCoins) =>
    amount + get(expiringCoins, "coins", 0);

const updateUser = async (user, amount) =>
    await userReference(user.id).update({
        money: defaultTo(user.money, 0) + amount,
    });

const userReference = (userId) => firestore.doc("users/" + userId);

const sendEmail_ = async (user, amount) => {
    await sendEmail(user.email, `Recarga de ${currency} `, template, {
        name: user.name,
        amount: amount,
        email: user.email,
        applicationRootUrl: config.applicationRootUrl,
        currency: currency,
    });
};

const coupon_ = (coupon) => {
    if (coupon) {
        delete coupon.createAt;
        delete coupon.updateAt;
    }
    return coupon;
};

const fetchCulqiCharges = async (source_id, currency_code, email, amount) => {
    const amount_ = amount * 100;

    const response = await fetch("https://api.culqi.com/v2/charges", {
        method: "POST",
        body: JSON.stringify({
            source_id: source_id,
            amount: +amount_,
            currency_code: currency_code,
            email: email,
        }),
        headers: {
            "content-Type": "application/json",
            Accept: "application/json",
            authorization: "Bearer " + config.culqi.secretKey,
        },
    });

    if (!response.ok) {
        console.error(
            ("---->",
                response,
                {
                    source_id: source_id,
                    amount: +amount_,
                    currency_code: currency_code,
                    email: email,
                })
        );
        throw Error(response.statusText);
    }

    return response.json();
};

const user_ = async (userId) => {
    const user = await firestore.doc("users/" + userId).get();
    return user.data();
};

const transactionMessage = (user, coupon, coins) => {
    let message = `Recargo de ${coins} coins por culqi`;

    if (get(coupon))
        message = `${message} con el cupón ${coupon.couponCode} de tipo ${coupon.couponType}`;
    return message;
};

module.exports = {charge};
