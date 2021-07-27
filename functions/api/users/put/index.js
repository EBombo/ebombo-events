const {putUser} = require("./putUser");
const {putUserAccounts} = require("./putUserAccounts");
const {uploadDocument} = require("./uploadDocument");
const {validateAccount} = require("./validateAccount");
const {requestNewDocument} = require("./requestNewDocument");
const {uploadProfilePicture} = require("./uploadProfilePicture");
const {putUserFavoriteGames} = require("./putUserFavoriteGames");

exports.putUser = putUser;
exports.putUserAccounts = putUserAccounts;
exports.uploadDocument = uploadDocument;
exports.validateAccount = validateAccount;
exports.requestNewDocument = requestNewDocument;
exports.uploadProfilePicture = uploadProfilePicture;
exports.putUserFavoriteGames = putUserFavoriteGames;
