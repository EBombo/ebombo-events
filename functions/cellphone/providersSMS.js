const Enc = require("enc");
const {config} = require("../config");
const http = require("http");
const fetch = require("node-fetch");
const querystring = require("querystring");
const logger = require("../utils/logger");
const {get} = require("lodash");

const infobipApi = async (phoneNumber, dialCode, message) => {
    // credentials infobipApi
    const API_KEY = config.smsService.infobip.apiKey;
    const URL_API = config.smsService.infobip.url;

    const cellPhone = `${dialCode} ${phoneNumber}`;

    const MSMData = {
        messages: [
            {
                from: "InfoSMS",
                destinations: [
                    {
                        to: cellPhone,
                    },
                ],
                text: message,
                flash: true,
            },
        ],
    };

    const providerSMSResponse = await fetch(URL_API, {
        method: "POST",
        timeout: 0,
        headers: {
            Authorization: API_KEY, // {authorization}
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        data: JSON.stringify(MSMData),
    });

    logger.log("providerSMSResponse->", providerSMSResponse);

    if (!get(providerSMSResponse, "ok", false)) {
        logger.error("error sms->", providerSMSResponse);
        throw Error(providerSMSResponse.statusText);
    }

    const SMSInfo = await providerSMSResponse.json();

    logger.log("SMSInfo->", SMSInfo);

    return SMSInfo;
};

const altiriaApi = async (phoneNumber, dialCode, message) => {
    // credentials altiriaApi
    const DOMAIN_ID = config.smsService.altiria.domainId;
    const LOGIN = config.smsService.altiria.login;
    const PASSWORD = config.smsService.altiria.password;

    const cellPhone = `${dialCode} ${phoneNumber}`;

    const post_data = querystring.stringify({
        cmd: "sendsms",
        domainId: DOMAIN_ID,
        login: LOGIN,
        passwd: PASSWORD,
        dest: cellPhone,
        senderId: "", // No es posible utilizar el remitente en América pero sí en España y Europa
        msg: message,
    });

    const post_options = {
        // Un objeto de opciones sobre donde se envia el post
        host: "www.altiria.net",
        port: "80",
        path: "/api/http",
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(post_data),
        },
    };

    const post_req = await http.request(post_options, (res) => {
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
            logger.log("Response: " + chunk);
        });
    });

    post_req.write(post_data);
    post_req.end();

    return post_req;
};

const clickSend = async (phoneNumber, dialCode, message) => {
    try {
        // credentials clickSend
        const USER = config.smsService.clickSend.user;
        const PASS = config.smsService.clickSend.password;
        const URL = config.smsService.clickSend.url;

        const cellPhone = `${dialCode}${phoneNumber}`;
        const credentials = Enc.base64.encode(`${USER}:${PASS}`);

        logger.log("credentials->", USER, PASS, URL, cellPhone, credentials);

        const MSMData = {
            messages: [
                {
                    to: cellPhone,
                    body: message,
                },
            ],
        };

        logger.log("MSMData->", MSMData);

        const providerSMSResponse = await fetch(URL, {
            method: "POST",
            body: JSON.stringify(MSMData),
            headers: {
                Authorization: `Basic ${credentials}`,
                "Content-Type": "application/json",
            },
        });

        logger.log("providerSMSResponse->", providerSMSResponse);

        if (!get(providerSMSResponse, "ok", false))
            throw Error(providerSMSResponse.statusText);

        const SMSInfo = await providerSMSResponse.json();

        logger.log("SMSInfo->", SMSInfo);

        return SMSInfo;
    } catch (error) {
        logger.error(error);
    }
};

module.exports = {altiriaApi, infobipApi, clickSend};
