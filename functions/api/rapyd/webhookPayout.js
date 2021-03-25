const {firestore, config} = require("../../config");
const {sendEmail} = require("../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const fetch = require("node-fetch");
const logger = require("../../utils/logger");
const {snapshotToArray} = require("../../utils");
const {updateTransaction} = require("../../collections/transactions");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../email/templates/withdrawRapyd.html")
    )
    .toString();

const currency = config.currency;

const webhookPayout = async (req, res, next) => {
    try {
        const data = req.body.data;

        logger.log(req.body)

        const operationId = data.id;

        const transaction = await fetchWithdrawTransaction(operationId);

        switch (data.status) {
            case "Completed":
                return await completeTransaction(transaction, req.body);
            case "Error":
                return await cancelTransaction(transaction);
            case "Return":
                return await cancelTransaction(transaction);
            case "Canceled":
                return await cancelTransaction(transaction);
            default:
                return await cancelTransaction(transaction);
        }
    } catch (error) {
        logger.log(error);
        next(error);
    }
};

const fetchWithdrawTransaction = async (operationId) => {
    const withdrawalRef = await firestore
        .collection("transactions")
        .where("operationId", "==", operationId)
        .get();

    const transaction = snapshotToArray(withdrawalRef)[0];

    return transaction;
};

const completeTransaction = async (transaction, extra2) => {
    await updateTransaction(transaction.id, {...transaction, isDeposited: true, extra2});

    await sendEmail_(transaction.user.email, transaction, template);
};

const sendEmail_ = async (email, withdrawal, template) =>
    await sendEmail(email, `Retiro de ${currency}`, template, {
        name: withdrawal.user.name,
        amount: withdrawal.amount,
        accountNumber: withdrawal.accountNumber,
        applicationRootUrl: config.applicationRootUrl,
        currency: currency,
    });

const cancelTransaction = async (transaction) => {
    const response = await fetch(
        `${config.serverUrl}/admin/withdrawals/${transaction.id}/cancel`,
        {
            method: "PUT",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        }
    );

    return response;
};

module.exports = {webhookPayout};
