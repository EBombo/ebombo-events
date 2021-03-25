const {snapshotToArray} = require("../../utils");
const {firestore} = require("../../config");

const fetchTransactionsByMatch = async (matchId) => {
    const transactions = await firestore
        .collection("transactions")
        .where("extra.id", "==", matchId)
        .get();

    return snapshotToArray(transactions);
};

const fetchTransactionsByUserAndAction = async (userId, action) => {
    const transactions = await firestore
        .collection("transactions")
        .where("user.id", "==", userId)
        .where("action", "==", action)
        .get();

    return snapshotToArray(transactions);
};

const fetchTransactionsByExtraId = async (extraId) => {
    const transactions = await firestore
        .collection("transactions")
        .where("extra.id", "==", extraId)
        .get();

    return snapshotToArray(transactions);
};

const fetchTransactionsByUserIdAndExtraId = async (userId, extraId) => {
    const transactions = await firestore
        .collection("transactions")
        .where("user.id", "==", userId)
        .where("extra.id", "==", extraId)
        .get();

    return snapshotToArray(transactions);
};

const fetchTransactionsByUserIdAndExtraIdAndAction = async (
    userId,
    extraId,
    action
) => {
    const transactions = await firestore
        .collection("transactions")
        .where("action", "==", action)
        .where("user.id", "==", userId)
        .where("extra.id", "==", extraId)
        .get();

    return snapshotToArray(transactions);
};

const fetchTransactionsByUserIdAndExtra2IdAndAction = async (
    userId,
    extra2Id,
    action
) => {
    const transactions = await firestore
        .collection("transactions")
        .where("action", "==", action)
        .where("user.id", "==", userId)
        .where("extra2.id", "==", extra2Id)
        .get();

    return snapshotToArray(transactions);
};

const deletedTransactions = async (transactions) => {
    const promises = transactions.map(
        async (transaction) =>
            await firestore.doc(`transactions/${transaction.id}`).delete()
    );

    await Promise.all(promises);
};

const fetchTransaction = async (transactionId) => {
    const withdrawalDoc = await firestore
        .collection("transactions")
        .doc(transactionId)
        .get();

    return withdrawalDoc.data();
};

const updateTransaction = async (transactionId, transaction) =>
    await firestore.doc(`transactions/${transactionId}`).update(transaction);

module.exports = {
    updateTransaction,
    deletedTransactions,
    fetchTransaction,
    fetchTransactionsByExtraId,
    fetchTransactionsByUserIdAndExtraId,
    fetchTransactionsByUserIdAndExtraIdAndAction,
    fetchTransactionsByUserIdAndExtra2IdAndAction,
    fetchTransactionsByUserAndAction,
    fetchTransactionsByMatch,
};
