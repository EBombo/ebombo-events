const logger = require("../utils/logger");
const {clickSend} = require("./providersSMS");

exports.sendCellPhoneMessage = async (phoneNumber, dialCode, message) => {
    if (!phoneNumber || !dialCode) return;

    logger.log(`send message cell phone: ${dialCode}${phoneNumber}`);

    const infoSMS = await clickSend(phoneNumber, dialCode, message);

    logger.log("infoSMS ->", infoSMS);

    return infoSMS;
};
