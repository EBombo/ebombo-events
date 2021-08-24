const { getVerifyCode } = require("./getVerifyCode");
const { getResendVerifyCode } = require("./getResendVerifyCode");
const { getCustomToken } = require("./getCustomToken");
const { getUserByToken } = require("./getUserByToken");

exports.getVerifyCode = getVerifyCode;
exports.getUserByToken = getUserByToken;
exports.getCustomToken = getCustomToken;
exports.getResendVerifyCode = getResendVerifyCode;
