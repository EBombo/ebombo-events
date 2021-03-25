const {fetchSettings} = require("../collections/settings");
const fetch = require("node-fetch");
const {config} = require("../config");
const logger = require("../utils/logger");
const {transaction} = require("../transactions");
const {calculateRechargeCommission} = require("../utils/calculateAward");
const {get} = require("lodash");
const moment = require("moment");

const TOKEN = config.bsale.token;
const URL = config.bsale.uri;
const codeVariant = config.bsale.codeVariant;
const currency = config.currency;

exports.sendBallots = async (
    user,
    amount,
    description,
    paymentTypeId,
    forwarding = false
) => {
    try {
        const settings = await fetchSettings();

        logger.log("Enviar Boletas electronicas al provedor de servicio");

        const {netBallot, netRecharge} = calculateRechargeCommission(
            +amount,
            settings
        );

        logger.log("currency ==>", currency);

        const priceList =
            currency === "PEN"
                ? config.bsale.priceListPEN
                : config.bsale.priceListUSD;

        const netUnitValue = netBallot / 1.18;
        logger.log("netUnitValue ---->", netUnitValue);

        const date = moment(Number(new Date())).unix();

        const expiringDate = moment(
            Number(moment().add(7, "days").toDate())
        ).unix();

        logger.log("date, expiringDate", date, expiringDate);

        const ballotData = {
            documentTypeId: 1,
            emissionDate: date,
            expirationDate: expiringDate,
            declare: 1,
            priceListId: priceList,
            exchangeRate: "1",
            client: {
                firstName: user.name,
                lastName: get(user, "lastName", "-"),
                email: user.email,
            },
            sendEmail: 1,
            details: [
                {
                    code: codeVariant,
                    comment: description,
                    netUnitValue: netUnitValue,
                    quantity: 1,
                },
            ],
            payments: [
                {
                    paymentTypeId: +paymentTypeId,
                    amount: +amount,
                    recordDate: date,
                },
            ],
        };

        logger.log("ballotData->", ballotData);

        const providerBallotResponse = await fetchProviderBallot(
            URL,
            ballotData,
            TOKEN
        );

        logger.log(
            "providerBallotResponse->",
            get(providerBallotResponse, "status"),
            providerBallotResponse
        );

        if (
            !get(providerBallotResponse, "ok", false) ||
            get(providerBallotResponse, "status") === 401
        ) {
            logger.log("reject-ballots");

            if (forwarding) return;

            await transaction(
                "reject-ballots",
                user,
                +amount,
                `Emisión de boletas rechazada ${user.id} ${amount}`,
                description,
                {...providerBallotResponse},
                ballotData
            );

            return;
        }

        logger.log("ballots");

        const ballotInfo = await providerBallotResponse.json();

        await transaction(
            "ballots",
            user,
            +amount,
            `Boleta emitida usuario id ${user.id} por ${currency} ${amount}`,
            description,
            ballotInfo,
            ballotData
        );

        logger.log("ballotInfo->", ballotInfo);

        return ballotInfo;
    } catch (error) {
        logger.error(error);
    }
};

const fetchProviderBallot = async (url, ballotData, token) =>
    await fetch(url, {
        method: "POST",
        headers: {
            access_token: token,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(ballotData),
    });
