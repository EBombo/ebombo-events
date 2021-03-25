const {config} = require("../../../config");
const {sendEmail} = require("../../../email/sendEmail");
const {get} = require("lodash");
const {fetchUser, updateUser} = require("../../../collections/users");
const fs = require("file-system");
const path = require("path");
const logger = require("../../../utils/logger");
const {fetchConsole} = require("../../../collections/consoles");
const {fetchGameWithLimit} = require("../../../collections/games");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/newAccount.html")
    )
    .toString();

const verifyCode = async (req, res, next) => {
    logger.log("verifyCode", req.params);

    try {
        const {userId, verificationCode} = req.params;

        const user = await fetchUser(userId);

        if (get(user, "verificationCode", 0).toString() !== verificationCode)
            return res.redirect(`${config.applicationRootUrl}/500`);

        await updateUser(userId, {isVerified: true});

        await sendEmail_(user);

        const urlRedirect = await urlToRedirect(config.applicationRootUrl);

        return res.redirect(`${urlRedirect}#guide`);
    } catch (error) {
        next(error);
        logger.error(error);
    }
};

const sendEmail_ = async (user) =>
    await sendEmail(user.email, "Bienvenido a EBombo", template, {
        name: get(user, "name", ""),
        email: user.email,
        applicationRootUrl: config.applicationRootUrl,
    });

const urlToRedirect = async (applicationRootUrl) => {
    const games = await fetchGameWithLimit(1);
    const console_ = await fetchConsole(games[0].consoleIds[0]);

    return `${applicationRootUrl}/vs/games/${games[0].id}/consoles/${console_.id}`;
};

module.exports = {verifyCode};
