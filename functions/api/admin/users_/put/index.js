const {adminChargeMoney} = require("./AdminChargeMoney");
const {adminWithdrawal} = require("./AdminWithdrawal");
const {takeMoney} = require("./TakeMoney");
const {adminCancelWithdrawal} = require("./AdminCancelWithdrawal");
const {adminIsVerified} = require("./AdminIsVerified");

exports.adminChargeMoney = adminChargeMoney;
exports.adminWithdrawal = adminWithdrawal;
exports.takeMoney = takeMoney;
exports.adminCancelWithdrawal = adminCancelWithdrawal;
exports.adminIsVerified = adminIsVerified;
