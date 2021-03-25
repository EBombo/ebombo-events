const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {get} = require("lodash");
const {
    sendCellPhoneMessage,
} = require("../../../cellphone/sendCellPhoneMessage");
const {fetchSettings} = require("../../../collections/settings");

const putUserPhoneNumber = async (req, res, next) => {
    try {
        logger.log("Put User Phone Number", req.params);

        const {userId, phoneNumber, countryCode, dialCode} = req.params;

        const phoneNumberAlreadyExists = await isPhoneNumberAlreadyExists(
            phoneNumber
        );

        if (phoneNumberAlreadyExists)
            return res.status(412).send({message: "El número ya fue registrado"});

        await updateUserAccounts(userId, countryCode, phoneNumber);

        const user = await fetchUser(userId);

        const settings = await fetchSettings();

        await sendCodeSMS(
            {
                verificationCode: user.verificationCode,
                dialCode,
                phoneNumber,
            },
            settings
        );

        return res.send(200);
    } catch (error) {
        logger.error("Error Update User Phone Number");
        next(error);
    }
};

const fetchUser = async (userId) => {
    const user = await firestore.doc("users/" + userId).get();
    return user.data();
};

const isPhoneNumberAlreadyExists = async (phoneNumber) => {
    if (!phoneNumber) return false;

    const userQuerySnapshot = await firestore
        .collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();

    return !userQuerySnapshot.empty;
};

const updateUserAccounts = async (userId, countryCode, phoneNumber) =>
    await firestore.doc("users/" + userId).update({
        countryCode,
        phoneNumber,
        updateAt: new Date(),
    });

const sendCodeSMS = async (user, settings) =>
    await sendCellPhoneMessage(
        user.phoneNumber,
        user.dialCode,
        `${get(
            settings,
            "smsMessage",
            "Hola :) Gracias por unirte a la comunidad de ebombo.Tu código de verificación es"
        )}: ${user.verificationCode}`
    );

module.exports = {putUserPhoneNumber};
