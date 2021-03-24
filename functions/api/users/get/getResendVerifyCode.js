const {config} = require("../../../config");
const {sendEmail} = require("../../../email/sendEmail");
const {get} = require("lodash");
const fs = require("file-system");
const path = require("path");
const logger = require("../../../utils/logger");
const {fetchUser} = require("../../../collections/users");

const template = fs.readFileSync(path.join(__dirname, "../../../email/templates/verifyCode.html")).toString();

const getResendVerifyCode = async (req, res, next) => {
    logger.log("resendVerifyCode", req.params);

    try {

        const userId = req.params.userId;

        const user = await fetchUser(userId);
        const origin = get(user, "origin", config.serverUrl);

        await sendEmail_(user, origin);

        return res.status(200).send("success");
    } catch (error) {
        next(error)
    }
};

const sendEmail_ = async (user, origin) =>
    await sendEmail(user.email, "Bienvenido, confirma tu correo electrónico", template, {
        "name": get(user, "name", ""),
        "email": user.email,
        "applicationRootUrl": `${origin}/api/verify/${user.id}/verification-code/${user.verificationCode}`,
        "phone": config.phone,
        "web": origin.replace("https://", "")
    });

module.exports = {getResendVerifyCode};
