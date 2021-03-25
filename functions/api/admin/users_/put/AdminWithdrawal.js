const {config} = require("../../../../config");
const {sendEmail} = require("../../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const {
    fetchTransaction,
    updateTransaction,
} = require("../../../../collections/transactions");
const fetch = require("node-fetch");
const logger = require("../../../../utils/logger");
const UrlAssembler = require("url-assembler");
const {RapydSignature} = require("./RapydSignature");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../../email/templates/withdraw.html")
    )
    .toString();

const currency = config.currency;

const adminWithdrawal = async (req, res, next) => {
    try {
        const {withdrawalId} = req.params;

        const withdrawal = await fetchTransaction(withdrawalId);

        withdrawal.payoutCurrency = getPayoutCurrency(withdrawal.countryCode);

        if (withdrawal.note === "Rapyd") {
            const sender = await fetchSender();

            const payoutMethodType = await fetchPayoutMethod(withdrawal);

            await fetchFieldsRequired(withdrawal, payoutMethodType);

            const response = await rapydCreatePayout(
                withdrawal,
                sender,
                payoutMethodType
            );

            await updateTransaction(withdrawal.id, {
                ...withdrawal,
                operationId: response.data.id,
            });
        } else {
            await updateTransaction(withdrawal.id, {
                ...withdrawal,
                isDeposited: true,
            });

            await sendEmail_(withdrawal.user.email, withdrawal, template);
        }

        return res.sendStatus(200);
    } catch (error) {
        next(error);
    }
};

const getPayoutCurrency = (countryCode) =>
    countryCode === "BR"
        ? "BRL"
        : countryCode === "PE"
        ? "PEN"
        : countryCode === "MX"
            ? "MXN"
            : countryCode === "CO"
                ? "COP"
                : countryCode === "EC"
                    ? "USD"
                    : "USD";

const fetchSender = async () => {
    const headerInfo = RapydSignature(
        {},
        `/v1/payouts/sender/${config.rapyd.senderId}`
    );

    const response = await fetch(config.rapyd.getSenderUrl, {
        method: "GET",
        headers: {
            signature: headerInfo.signature,
            salt: headerInfo.salt,
            timestamp: headerInfo.timestamp,
            access_key: config.rapyd.accessKey,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    const sender_ = await response.json();

    return sender_.data;
};

const urlPayoutMethod = (withdrawal, url) =>
    new UrlAssembler(url)
        .query({
            beneficiary_country: withdrawal.countryCode,
            category: "bank",
            sender_entity: "individual",
            beneficiary_entity: "individual",
            payout_currency: withdrawal.payoutCurrency,
        })
        .toString();

const fetchPayoutMethod = async (withdrawal) => {
    const assembledUrl = urlPayoutMethod(
        withdrawal,
        "/v1/payouts/supported_types"
    );

    const headerInfo = RapydSignature({}, assembledUrl, "get");

    const response = await fetch(`https://sandboxapi.rapyd.net${assembledUrl}`, {
        method: "GET",
        headers: {
            signature: headerInfo.signature,
            salt: headerInfo.salt,
            timestamp: headerInfo.timestamp,
            access_key: config.rapyd.accessKey,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    });

    const response_ = await response.json();

    logger.log(response_);
    return response_.data[0].payout_method_type;
};

const urlFieldsRequired = (withdrawal, url) =>
    new UrlAssembler(url)
        .query({
            beneficiary_country: withdrawal.countryCode,
            beneficiary_entity_type: "individual",
            payout_amount: withdrawal.amount,
            sender_currency: "USD",
            payout_currency: withdrawal.payoutCurrency,
            sender_country: "PE",
            sender_entity_type: "individual",
        })
        .toString();

const fetchFieldsRequired = async (withdrawal, payoutMethod) => {
    const assembledUrl = urlFieldsRequired(
        withdrawal,
        `/v1/payouts/${payoutMethod}/details`
    );

    const headerInfo = RapydSignature("", assembledUrl, "get");

    const response = await fetch(
        `https://sandboxapi.rapyd.net${assembledUrl}`,
        {
            method: "GET",
            headers: {
                signature: headerInfo.signature,
                salt: headerInfo.salt,
                timestamp: headerInfo.timestamp,
                access_key: config.rapyd.accessKey,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
    );

    const response_ = await response.json();

    logger.log(response_);
};

const rapydCreatePayout = async (withdrawal, sender, payout_method_type) => {
    try {
        const body = {
            beneficiary: {
                first_name: withdrawal.user.firstName,
                last_name: withdrawal.user.lastName,
                tax_id: withdrawal.documentId,
                bic_swift: withdrawal.bicSwift,
                bank_account_type: withdrawal.bankAccountType,
                account_number: withdrawal.accountNumber,
                address: withdrawal.address,
                email: withdrawal.user.email,
                city: withdrawal.city,
                postcode: `${withdrawal.postcode}`,
                country: withdrawal.countryCode,
            },
            beneficiary_country: withdrawal.countryCode,
            beneficiary_entity_type: "individual",
            description: "Payout - Bank Transfer: Beneficiary/Sender objects",
            ewallet: config.rapyd.ewallet,
            payout_amount: withdrawal.amount,
            payout_currency: withdrawal.payoutCurrency,
            payout_method_type,
            sender,
            sender_country: "PE",
            sender_currency: currency,
            sender_entity_type: "individual",
            confirm_automatically: true,
        };

        if (withdrawal.countryCode === "MX") {
            body.beneficiary.payment_type = "priority";
        }

        const encodeInformation = RapydSignature(body, "/v1/payouts", "post");

        const response = await fetch(config.rapyd.disburseUrl, {
            method: "POST",
            headers: {
                signature: encodeInformation.signature,
                salt: encodeInformation.salt,
                timestamp: encodeInformation.timestamp,
                access_key: config.rapyd.accessKey,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const result = await response.json();

        logger.log("resultado de envio de dinero a cuenta ---->", result);

        return result;
    } catch (error) {
        logger.log(error);
    }
};

const sendEmail_ = async (email, withdrawal, template) =>
    await sendEmail(email, `Retiro de ${currency}`, template, {
        name: withdrawal.user.name,
        isCCI: withdrawal.accountType === "CCI",
        amount: withdrawal.amount,
        accountNumber: withdrawal.accountNumber,
        documentType: withdrawal.documentType,
        documentNumber: withdrawal.document,
        email: withdrawal.user.email,
        applicationRootUrl: config.applicationRootUrl,
        currency: currency,
    });

module.exports = {adminWithdrawal};
