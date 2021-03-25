const {firestore, config} = require("../../../config");
const {FieldValue} = require("@google-cloud/firestore");
const {searchName} = require("../../../utils");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const faker = require("faker");
const path = require("path");
const {toUpper, defaultTo, get} = require("lodash");
const moment = require("moment");
const logger = require("../../../utils/logger");
const {updateSetting} = require("../../../collections/settings");

const templateVerificationCode = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/verifyCode.html")
    )
    .toString();
const templateWelcome = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/newAccount.html")
    )
    .toString();

exports.putUser = async (req, res, next) => {
    try {
        logger.log("user register->", req.body);

        const user = req.body;

        user.id = req.params.userId;

        if (!user.email)
            return res.status(412).send({
                statusText: "invalid-email",
                message: "Email es requerido",
            });

        const email = get(user, "email", "").trim();
        const phoneNumber = get(user, "phoneNumber", null);

        const emailAlreadyExists = await isEmailAlreadyExists(email);

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

        await setUser(user, verificationCode, isVerified);

        await updateSetting("default", {totalUsers: FieldValue.increment(1)});

        if (user.providerData.providerId === "password") {
            await sendVerificationCodeEmail(user, verificationCode);
        } else {
            await sendWelcomeEmail(user);
        }

        return res.send(200);
    } catch (error) {
        logger.error(error, req.params, req.body);
        next(error);
    }
};

const setUser = async (user, verificationCode, isVerified) => {
    const email = get(user, "email", "");
    const phoneNumber = get(user, "phoneNumber", null);
    const name = get(user, "name", nicknameRandom(email));
    const nickname = get(user, "nickname", await getNickName(name));

    await firestore
        .collection("users")
        .doc(user.id)
        .set({
            id: user.id,
            name: name,
            lastName: get(user, "lastName", null),
            birthDate: user.birthDate ? new Date(user.birthDate) : null,
            notifyInvitedToPlay: get(user, "notifyInvitedToPlay", false),
            searchName: searchName({...user, nickname, email}),
            email: defaultTo(email, "").toLowerCase().trim(),
            nickname: nickname.replace(" ", "").trim(),
            nicknameUppercase: toUpper(nickname),
            providers: [get(user, "providerData.providerId", "")],
            dialCode: get(user, "dialCode", null),
            favoriteGameIds: [],
            createAt: new Date(),
            updateAt: new Date(),
            phoneNumber: phoneNumber,
            countryCode: get(user, "countryCode", null),
            verificationCode,
            isVerified,
            level: 0,
            followersAmount: 0,
            followingsAmount: 0,
            money: 0,
            expiringMoney: [await registerMoney(user)],
        });
};

const registerMoney = async (user) => {
    const settingsDocumentSnapShot = await firestore
        .doc("settings/default")
        .get();

    const money = defaultTo(settingsDocumentSnapShot.data().registerMoney, 10);
    const expireDate = defaultTo(
        settingsDocumentSnapShot.data().defaultExpirationOfMoney,
        7
    );

    return {
        money,
        expireDate: moment().add(expireDate, "days").toDate(),
    };
};

const getNickName = async (nickName) => {
    if (await existNickName(nickName))
        return await getNickName(`${nickName}${random()}${random()}${random()}`);

    return nickName;
};

const random = () => Math.floor(Math.random() * 10) + 1;

const existNickName = async (nickName) => {
    const nickNameRef = await firestore
        .collection("users")
        .where("nickname", "==", nickName)
        .get();
    return !!nickNameRef.size;
};

const isEmailAlreadyExists = async (email) => {
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

const nicknameRandom = (email) => {
    if (email) return email.split("@")[0];

    const nicknameRandom = faker.fake("{{random.word}}");

    return nicknameRandom.split(" ")[0];
};

const sendWelcomeEmail = async (user) =>
    await sendEmail(user.email.trim(), "Bienvenido a EBombo", templateWelcome, {
        name: get(user, "name", ""),
        email: user.email.trim(),
        applicationRootUrl: config.applicationRootUrl,
    });

const sendVerificationCodeEmail = async (user, verificationCode) =>
    await sendEmail(
        user.email.trim(),
        "Bienvenido a EBombo, confirma tu correo electrónico",
        templateVerificationCode,
        {
            name: get(user, "name", ""),
            email: user.email.trim(),
            applicationRootUrl: `${config.serverUrl}/verify/${user.id}/verification-code/${verificationCode}`,
        }
    );
