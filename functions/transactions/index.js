const {firestore} = require("../config");
const {merge} = require("lodash");
const logger = require("../utils/logger");

exports.transaction = async (
    action,
    user = null,
    amount,
    description,
    note = null,
    extra = null, //matches || tournaments || response charge
    extra2 = null, //user admin || tournamentTeam
    extra3 = null //additional
) => {
    const transactionRef = firestore.collection("transactions");
    const transactionId = transactionRef.doc().id;
    let transaction = documentTransaction(
        transactionId,
        action,
        user,
        amount,
        description,
        note
    );

    if (extra) transaction.extra = extra;
    if (extra2) transaction.extra2 = extra2;
    if (extra3) transaction.extra3 = extra3;

    logger.log("transaction", transaction);

    await transactionRef.doc(transactionId).set(transaction);

    return transactionId;
};

const documentTransaction = (
    transactionId,
    action,
    user,
    amount,
    description,
    note
) => ({
    id: transactionId,
    action: action,
    user: user,
    amount: +amount,
    description: description,
    note: note,
    createAt: new Date(),
    updateAt: new Date(),
    deleted: false,
});
