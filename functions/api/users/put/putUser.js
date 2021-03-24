const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {searchName} = require("../../../utils");
const {sendEmail} = require("../../../email/sendEmail");
const {config} = require("../../../config");
const {get, defaultTo} = require("lodash");
const fs = require("file-system");
const path = require("path");

const templateVerificationCode = fs.readFileSync(path.join(__dirname, "../../../email/templates/verifyCode.html")).toString();
const templateWellcome = fs.readFileSync(path.join(__dirname, "../../../email/templates/newAccount.html")).toString();

const putUser = async (req, res, next) => {
    try {
        logger.log("user register->", req.body);

        const user = req.body;
        const origin = get(req, "headers.origin", config.serverUrl);

        user.id = req.params.userId;

        if (!user.email) return res.status(412).send({
            statusText: "invalid-email",
            message: "Email es requerido",
        });

        const email = get(user, "email", "").trim();
        const emailAlreadyExists = await isEmailAlreadyExists(email);
        if (emailAlreadyExists)
            return res.status(412).send({
                statusText: "email-already-exists",
                message: "Email ya esta registrado",
            });

        const phoneNumber = get(user, "phoneNumber", null);
        const phoneNumberAlreadyExists =
            user.providerData.providerId === "password"
                ? await isPhoneNumberAlreadyExists(phoneNumber)
                : false;

        const userExists = await isUserExists(user.id);

        if (emailAlreadyExists && !userExists)
            return res.status(412).send({
                statusText: "email-already-exists",
                message: "Email ya esta registrado",
            });

        if (phoneNumberAlreadyExists && !userExists)
            return res.status(412).send({
                statusText: "phone-number-already-exists",
                message: "Número telefónico ya esta registrado",
            });

        let verificationCode = Math.floor(1000 + Math.random() * 9000);
        let isVerified = true;

        if (user.providerData.providerId === "password") isVerified = false;

        await setUser(user, verificationCode, isVerified, origin);

        await sendMessage(user, verificationCode, origin);

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const isEmailAlreadyExists = async email => {
    if (!email) return false;

    const userQuerySnapshot = await firestore
        .collection("users")
        .where("email", "==", email)
        .get();

    return !userQuerySnapshot.empty;
};

const isPhoneNumberAlreadyExists = async (phoneNumber) => {
    if (!phoneNumber) return false;

    const userQuerySnapshot = await firestore
        .collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();

    return !userQuerySnapshot.empty;
};

const isUserExists = async (userId) => {
    const userDocumentSnapshot = await firestore
        .collection("users")
        .doc(userId)
        .get();

    return userDocumentSnapshot.exists;
};

const setUser = async (user, verificationCode, isVerified, origin) => {
    const email = get(user, "email", "");
    const phoneNumber = get(user, "phoneNumber", null);

    await firestore
        .collection("users")
        .doc(user.id)
        .set({
            id: user.id,
            name: user.name,
            lastName: user.lastName,
            searchName: searchName({...user, phoneNumber, email}),
            email: defaultTo(email, "").toLowerCase(),
            providers: [get(user, "providerData.providerId", "")],
            dialCode: get(user, "dialCode", null),
            createAt: new Date(),
            updateAt: new Date(),
            phoneNumber: phoneNumber,
            countryCode: get(user, "countryCode", null),
            verificationCode,
            isVerified,
            origin,
            theme: get(user, "theme", "themeDark")
        }, {merge: true});
};

const sendMessage = async (user, verificationCode, origin) => {
    if (user.providerData.providerId === "password") {
        return await sendVerificationCodeEmail(user, verificationCode, origin);
    }
    await sendWelcomeEmail(user, origin);
};

const sendWelcomeEmail = async (user, origin) =>
    await sendEmail(user.email, "Bienvenido", templateWellcome, {
        "name": get(user, "name", ""),
        "email": user.email,
        "applicationRootUrl": origin,
        "phone": config.phone,
        "web": origin.replace("https://", "")
    });

const sendVerificationCodeEmail = async (user, verificationCode, origin) =>
    await sendEmail(user.email, "Bienvenido, confirma tu correo electrónico", templateVerificationCode, {
        "name": get(user, "name", ""),
        "email": user.email,
        "applicationRootUrl": `${origin}/api/verify/${user.id}/verification-code/${verificationCode}`,
        "phone": config.phone,
        "web": origin.replace("https://", "")
    });

module.exports = {putUser};
