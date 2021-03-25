const CryptoJS = require("crypto-js");
const {config} = require("../../../../config");
const logger = require("../../../../utils/logger");

const RapydSignature = (data, urlPath, method) => {
    let http_method = method;
    let url_path = urlPath;
    let salt = CryptoJS.lib.WordArray.random(12);
    let timestamp = (Math.floor(new Date().getTime() / 1000) - 10).toString();
    let body = "";

    if (JSON.stringify(data) !== "{}" && data !== "") {
        body = JSON.stringify(data);
    }

    let to_sign =
        http_method +
        url_path +
        salt +
        timestamp +
        config.rapyd.accessKey +
        config.rapyd.secretKey +
        body;

    let signature = CryptoJS.enc.Hex.stringify(
        CryptoJS.HmacSHA256(to_sign, config.rapyd.secretKey)
    );

    signature = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(signature));

    return {signature, timestamp, salt};
};

module.exports = {RapydSignature};
