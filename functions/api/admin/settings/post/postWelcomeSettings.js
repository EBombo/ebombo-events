const {firestore} = require("../../../../config");
const logger = require("../../../../utils/logger");

const postWelcomeSettings = async (req, res, next) => {
    logger.log("welcome settings->", req.body);

    try {
        const {
            commission,
            registerMoney,
            defaultExpirationOfMoney,
            entryCosts,
            minimumChargeAmount,
            smsMessage,
            playMoneyEntryCosts,
            minWithdrawAmount,
            videoUrl,
        } = req.body;

        await updateWelcomeSettings(
            +commission,
            +registerMoney,
            +defaultExpirationOfMoney,
            entryCosts,
            playMoneyEntryCosts,
            +minimumChargeAmount,
            smsMessage,
            +minWithdrawAmount,
            videoUrl
        );

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const updateWelcomeSettings = async (
    commission,
    registerMoney,
    defaultExpirationOfMoney,
    entryCosts,
    playMoneyEntryCosts,
    minimumChargeAmount,
    smsMessage,
    minWithdrawAmount,
    videoUrl
) => {
    await firestore.doc("settings/default").update({
        commission,
        registerMoney,
        defaultExpirationOfMoney,
        entryCosts,
        playMoneyEntryCosts,
        minimumChargeAmount,
        smsMessage,
        minWithdrawAmount,
        videoUrl,
    });
};

module.exports = {postWelcomeSettings};
