const {config} = require("../../../config");
const {sendEmail} = require("../../../email/sendEmail");
const {get} = require("lodash");
const fs = require("file-system");
const path = require("path");
const logger = require("../../../utils/logger");
const {updateUser, fetchUser} = require("../../../collections/users");

const template = fs.readFileSync(path.join(__dirname, "../../../email/templates/newAccount.html")).toString();

const getVerifyCode = async (req, res, next) => {
    logger.log("getVerifyCode", req.params);

    try {

        const {userId, verificationCode} = req.params;

        const user = await fetchUser(userId);
        const origin = get(user, "origin", config.serverUrl);

        if (String(get(user, "verificationCode")) !== String(verificationCode))
            return res.redirect(`${origin}/500`);

        await updateUser(userId, {isVerified: true});
        await sendEmail_(user, origin);
        return res.redirect(origin);

    } catch (error) {
        next(error)
    }
};

const sendEmail_ = async (user, origin) =>
    await sendEmail(user.email, "Bienvenido", template, {
        "name": get(user, "name", ""),
        "email": user.email,
        "applicationRootUrl": origin,
        "phone": config.phone,
        "web": origin.replace("https://", "")
    });

module.exports = {getVerifyCode};
