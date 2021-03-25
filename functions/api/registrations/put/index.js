const {firestore} = require("../../../config");
const {searchName, snapshotToArray} = require("../../../utils");
const {updateUser, fetchUser} = require("../../../collections/users");
const {toUpper, isEmpty, get} = require("lodash");
const logger = require("../../../utils/logger");
const {
    sendCellPhoneMessage,
} = require("../../../cellphone/sendCellPhoneMessage");
const {fetchSettings} = require("../../../collections/settings");
const moment = require("moment");

const update = async (req, res, next) => {
    logger.log("update user->", req.params.userId, req.body);

    try {
        const userId = req.params.userId;
        const nickname = req.body.nickname;
        const name = req.body.name;
        const lastName = req.body.lastName;
        const phoneNumber = req.body.phoneNumber;
        const birthDate = new Date(req.body.birthDate);

        const nickname_ = nickname.replace(/ /g, "").toLowerCase();

        await validateNickNameExists(nickname_, userId);

        let newUser = {
            name,
            lastName,
            nickname: nickname_,
            nicknameUppercase: toUpper(nickname_),
            searchName: searchName(req.body),
            updateAt: new Date(),
            phoneNumber,
            birthDate,
        };

        await updateUser(userId, newUser);

        return res.send(200);
    } catch (error) {
        mapError(error, res, next);
    }
};

const validateNickNameExists = async (nickName, userId) => {
    const userExists = await firestore
        .collection("users")
        .where("nickname", "==", nickName)
        .get();

    const users = snapshotToArray(userExists).filter(
        (user_) => user_.id !== userId
    );

    if (!isEmpty(users)) throw "NICKNAME_ALREADY_EXIST";
};

const validatePhoneNumberExists = async (phoneNumber, userId) => {
    const userExists = await firestore
        .collection("users")
        .where("phoneNumber", "==", phoneNumber)
        .get();

    const users = snapshotToArray(userExists).filter(
        (user_) => user_.id !== userId
    );

    if (!isEmpty(users)) throw "PHONE_NUMBER_ALREADY_EXIST";
};

const mapError = (error, res, next) => {
    switch (error) {
        case "NICKNAME_ALREADY_EXIST":
            return res.status(412).send({statusText: "El nickName ya existe"});
        case "PHONE_NUMBER_ALREADY_EXIST":
            return res
                .status(412)
                .send({statusText: "El numero de celular ya existe"});
        case "BIRTHDATE_BAD_FORMAT":
            return res
                .status(412)
                .send({statusText: "Fecha de nacimiento no valida"});
        default:
            return next(error);
    }
};

module.exports = {update};
