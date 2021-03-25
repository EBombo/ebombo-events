const {firestore} = require("../../config");
const {snapshotToArray} = require("../../utils");

const fetchCoupons = async () => {
    return null;
};

const fetchCouponByCode = async (couponCode) => {
    const couponQuerySnapShot = await firestore
        .collection("coupons")
        .where("couponCode", "==", couponCode)
        .orderBy("createAt", "desc")
        .limit(1)
        .get();

    return snapshotToArray(couponQuerySnapShot)[0];
};

module.exports = {fetchCoupons, fetchCouponByCode};
