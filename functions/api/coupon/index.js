const momentTz = require("moment-timezone");
const moment = require("moment");
const {fetchCouponByCode} = require("../../collections/coupons");
const {parseJSONTimeStamp, snapshotToArray} = require("../../utils");
const {firestore, auth} = require("../../config");
const {isEmpty, get} = require("lodash");
const {fetchUser} = require("../../collections/users");

const validateCoupon = async (req, res, next) => {
    console.log(
        "coupons->",
        req.params,
        momentTz().tz("America/Lima").format("DD/MM/YYYY hh:mm:ss")
    );

    const momentLATAM = momentTz().tz("America/Lima");

    try {
        const couponCode = req.params.couponCode;
        const amount = +req.params.amount;

        const authorization = req.headers.authorization;

        const user = await validateUser(authorization);

        const couponResponse = await mapCoupon(
            couponCode,
            amount,
            user,
            momentLATAM
        );

        res.status(200).send({coupon: couponResponse});
    } catch (error) {
        mapError(error, res, next);
    }
};

const validateUser = async (authorization) => {
    const tokenId = authorization.split("Bearer ")[1];

    const authUser = await auth.verifyIdToken(tokenId);

    const user = await fetchUser(authUser.uid);

    return user;
};

const mapCoupon = async (couponCode, amount, user, momentLATAM) => {
    const coupon = await fetchCouponByCode(couponCode);

    if (!coupon) throw "COUPON_DOES_NOT_EXIST";

    if (!get(coupon, "isVisible", false)) throw "USER_DOES_NOT_EXIST";

    console.log("cupon consultado->", get(coupon, "chargelessUser", false));

    if (get(coupon, "chargelessUser", false)) {
        const transactions = await fetchChargeTransactions(user);
        if (!isEmpty(transactions)) throw "USER_ALREADY_CHARGE";
    }

    validateCustomCouponExpiredDate(coupon, momentLATAM);
    validateMinAmount(coupon, amount);
    await validateCouponAlreadyUsed(coupon, user);
    validateCouponIsFree(coupon, amount);

    let additionalMoney;
    let description;
    let friend = null;

    switch (coupon.couponType) {
        case "custom":
            if (coupon.discountType === "multiplier") {
                additionalMoney = Math.floor(+amount * +coupon.amount - +amount);
                description = `(${coupon.couponCode}) Multiplica X${coupon.amount}`;
            } else if (coupon.discountType === "free") {
                additionalMoney = +coupon.amount;
                description = `${coupon.couponCode}`;
            } else if (coupon.discountType === "percentage") {
                additionalMoney = Math.floor((+amount * +coupon.amount) / 100);
                description = `+${coupon.amount}% ${coupon.couponCode}`;
            } else if (coupon.discountType === "ebCoins") {
                additionalMoney = +coupon.amount;
            }
            break;
    }
    return {
        couponCode: coupon.couponCode,
        additionalMoney,
        description,
        moneyExpireDate: moment(
            parseJSONTimeStamp(coupon.moneyExpireDate)
        ).toDate(),
        friend,
        coupon,
    };
};

const fetchChargeTransactions = async (user) => {
    const transactionsQuerySnapShot = await firestore
        .collection("transactions")
        .where("user.id", "==", user.id)
        .where("action", "==", "charge")
        .limit(1)
        .get();

    return snapshotToArray(transactionsQuerySnapShot);
};

const calculateMoneyExpirationDate = (
    defaultExpirationOfMoney,
    momentLATAM
) => {
    const expireDate = moment(momentLATAM).add(defaultExpirationOfMoney, "days");
    return moment(expireDate).toDate();
};

const validateMinAmount = (coupon, amount) => {
    if (coupon.minAmount > amount) throw "INSUFFICIENT_AMOUNT";
};

const validateCustomCouponExpiredDate = (coupon, momentLATAM) => {
    if (!coupon.expireDate) return;

    const expireDateMoment = moment(coupon.expireDate.toDate());

    if (momentLATAM.isAfter(expireDateMoment)) throw "COUPON_EXPIRED";
};

const validateCouponAlreadyUsed = async (coupon, user) => {
    const transactionQuerySnapshot = await firestore
        .collection("transactions")
        .where("extra.id", "==", coupon.id)
        .where("user.id", "==", user.id)
        .limit(1)
        .get();

    if (!isEmpty(snapshotToArray(transactionQuerySnapshot)))
        throw "COUPON_ALREADY_USED";
};

const validateCouponIsFree = (coupon, amount) => {
    if (amount === 0 && coupon.discountType !== "free")
        throw "COUPON_IS_NOT_FREE";
};

const mapError = (error, res, next) => {
    switch (error) {
        case "USER_DOES_NOT_EXIST":
            return res.status(400).send({statusText: "Acceso no valido"});
        case "COUPON_EXPIRED":
            return res.status(400).send({statusText: "El cupón ya expiro"});
        case "COUPON_ALREADY_USED":
            return res.status(400).send({statusText: "El cupón ya fue usado"});
        case "COUPON_IS_NOT_FREE":
            return res.status(400).send({statusText: "El cupón no es GRATIS"});
        case "COUPON_DOES_NOT_EXIST":
            return res.status(400).send({statusText: "El cupón no existe"});
        case "INSUFFICIENT_AMOUNT":
            return res
                .status(400)
                .send({statusText: "Monto de recarga insuficiente"});
        case "OWN_COUPON":
            return res
                .status(400)
                .send({statusText: "No puedes usar tu propio cupón"});
        case "COUPON_USER_DOES_NOT_EXIST":
            return res
                .status(400)
                .send({statusText: "El usuario del cupón no existe"});
        case "USER_ALREADY_CHARGE":
            return res.status(400).send({
                statusText: "Este cupón es solo para los que recargan por primera vez",
            });
        default:
            return next(error);
    }
};

module.exports = {
    mapError,
    validateCoupon,
    mapCoupon,
};
