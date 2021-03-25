const {sendEmail} = require("../../../email/sendEmail");
const {get} = require("lodash");
const logger = require("../../../utils/logger");
const {fetchUser, updateUser} = require("../../../collections/users");
const fs = require("file-system");
const path = require("path");
const {config} = require("../../../config");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/verifyCode.html")
    )
    .toString();

const resendVerifyCode = async (req, res, next) => {
    logger.log("resendVerifyCode", req.params);

    try {
        const userId = req.params.userId;

        let user = await fetchUser(userId);

        user.verificationCode = Math.floor(1000 + Math.random() * 9000);

        await updateUser(user.id, {verificationCode: user.verificationCode});

        await sendEmail_(user);

        return res.status(200).send("success");
    } catch (Error) {
        next(Error);
    }
};

const sendEmail_ = async (user) => {
    await sendEmail(
        user.email,
        "Bienvenido a Bombo, confirma tu correo electrónico",
        template,
        {
            name: get(user, "name", ""),
            email: user.email,
            applicationRootUrl: `${config.serverUrl}/verify/${user.id}/verification-code/${user.verificationCode}`,
        }
    );
};

module.exports = {resendVerifyCode};
