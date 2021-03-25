const {updateMatch} = require("../../collections/matches");
const {fetchUser, updateUser} = require("../../collections/users");
const {fetchTransactionsByMatch} = require("../../collections/transactions");
const {calculateAward} = require("../../utils/calculateAward");
const {userDiscountMoney} = require("./userDiscountMoney");
const logger = require("../../utils/logger");
const {transaction} = require("../../transactions");
const {
    updateTransaction,
    fetchTransactionsByUserIdAndExtraIdAndAction,
} = require("../../collections/transactions");
const {payAward} = require("./payAward");
const {get} = require("lodash");

const changeMatchPointsClosed = async (match, reqBody, settings) => {
    const userIds = get(match, "challengerAcceptInvitation", []).concat(
        get(match, "challengedAcceptInvitation", [])
    );
    const {oldChallengerPoints, oldChallengedPoints} = reducePoints(match);
    let {challengerPoints, challengedPoints} = reqBody;

    logger.log("new points->", challengerPoints, challengedPoints);
    logger.log("old points->", oldChallengerPoints, oldChallengedPoints);

    const award = calculateAward(+match.gameEntryCost, settings);

    logger.log("match award->", award);

    let transactions = await fetchTransactionsByMatch(match.id);

    logger.log("fetch all transactions->", transactions);

    transactions = transactions.filter((transaction) =>
        ["user-tie", "user-win", "user-lose"].includes(transaction.action)
    );

    logger.log("filter transactions->", transactions);

    if (oldChallengerPoints !== oldChallengedPoints) {
        logger.log("DESCONTAR al que ganó");
        await takeMoney(match, award, oldChallengerPoints, oldChallengedPoints);
    }

    if (oldChallengerPoints === oldChallengedPoints) {
        logger.log("EMPATE, descontar usuarios relacionados ->", userIds);
        await discountMoneyByTie(userIds, match);
    }

    await updateMatch(match.id, {
        challengedPoints,
        challengerPoints,
        updateAt: new Date(),
    });

    await payAward(match.id);
};
const reducePoints = (match) => {
    const oldChallengerPoints = +get(match, "challengerPoints", []).reduce(
        (a, b) => a + b,
        0
    );
    const oldChallengedPoints = +get(match, "challengedPoints", []).reduce(
        (a, b) => a + b,
        0
    );

    return {
        oldChallengerPoints,
        newChallengerPoints: oldChallengerPoints,
        oldChallengedPoints,
        newChallengedPoints: oldChallengedPoints,
    };
};
const takeMoney = async (match, award, challengerPoints, challengedPoints) =>
    challengerPoints > challengedPoints
        ? await updateMoney(match.challenger, match.challenged, award, match)
        : await updateMoney(match.challenged, match.challenger, award, match);

const updateMoney = async (usersWin, usersLose, award, match) => {
    const promisesUserWin = usersWin.map(async (currentUser) => {
        const user = await fetchUser(currentUser.id);

        let totalMoney = +get(user, "money", 0) - +award;

        logger.log(
            "quitando plata de",
            currentUser.nickname,
            " monto quitado->",
            award,
            "dinero que le queda ",
            totalMoney
        );

        await transaction(
            "user-update-match",
            user,
            +award,
            `Se descontó dinero al usuario ${award} del matchId ${match.id}`,
            "Cambio de resultado de un desafio",
            match
        );

        await updateUser(currentUser.id, {money: +totalMoney.toFixed(2)});
    });
    await Promise.all(promisesUserWin);

    const promisesUserLose = usersLose.map(async (currentUser) => {
        await transaction(
            "user-update-match",
            currentUser,
            0,
            `Cambio de resultado del matchId ${match.id}`,
            "Cambio de resultado de un desafio",
            match
        );
    });
    await Promise.all(promisesUserLose);
};

const discountMoneyByTie = async (userIds, match) => {
    const promises = userIds.map(async (userId) => {
        const user_ = await fetchUser(userId);

        const transactionsStartMatch = await fetchTransactionsByUserIdAndExtraIdAndAction(
            userId,
            match.id,
            "user-start-match"
        );

        const newUser = await userDiscountMoney(
            user_,
            +match.gameEntryCost,
            match.id,
            null
        );

        logger.log(
            "user-start-match and new user->",
            get(transactionsStartMatch, "[0].id"),
            get(transactionsStartMatch, "[0].action"),
            get(transactionsStartMatch, "[0].extra3"),
            userId,
            newUser
        );

        await transaction(
            "user-update-match",
            user_,
            0,
            `Cambio de resultado del matchId ${match.id}`,
            "Cambio de resultado de un desafio",
            match
        );

        await updateUser(user_.id, {
            money: +newUser.money,
            expiringMoney: newUser.expiringMoney,
        });

        get(transactionsStartMatch, "[0].id") &&
        (await updateTransaction(get(transactionsStartMatch, "[0].id"), {
            user: {
                ...get(transactionsStartMatch, "[0].user", {}),
                subscription: newUser.subscription,
            },
        }));
    });
    await Promise.all(promises);
};

module.exports = {changeMatchPointsClosed, takeMoney};
