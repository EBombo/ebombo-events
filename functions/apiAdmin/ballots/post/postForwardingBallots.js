const {sendBallots} = require("../../../ballots/sendBallots");
const {fetchTransaction} = require("../../../collections/transactions");
const {config} = require("../../../config");
const {get, isEmpty} = require("lodash");
const logger = require("../../../utils/logger");

const postForwardingBallots = async (req, res, next) => {
    try {
        logger.log("postForwardingBallots", req.body, req.params);

        const {transactionId} = req.params;

        const transaction = await fetchTransaction(transactionId);

        logger.log(
            transaction.user,
            transaction.amount,
            `de ${config.currency} ${transaction.amount} por visanet`,
            get(transaction, "extra2.payments[0].paymentTypeId"),
            true
        );

        const ballotInfo = await sendBallots(
            transaction.user,
            transaction.amount,
            `de ${config.currency} ${transaction.amount} por visanet`,
            get(transaction, "extra2.payments[0].paymentTypeId"),
            true
        );

        if (isEmpty(ballotInfo)) return res.status(400).send({success: false});

        return res.send({success: true});
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

module.exports = {postForwardingBallots};
