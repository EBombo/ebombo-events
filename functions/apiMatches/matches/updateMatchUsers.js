const {get, defaultTo, concat, remove, orderBy, isEmpty} = require("lodash");
const logger = require("../../utils/logger");
const moment = require("moment");
const {fetchUser, updateUser} = require("../../collections/users");
const {transaction} = require("../../transactions");
const {config} = require("../../config");

const currency = config.currency;

const updateMatchUsers = async (winnerUsers, loseUsers, award, match) => {
    const promiseWinUsers = winnerUsers.map(async (currentUser) => {
        const winnerUserId = currentUser.id;
        const winnerUser = await fetchUser(winnerUserId);
        const winnerStatistics = statistics(match, winnerUser, "win", true);
        const winnerStatisticsByGame = statistics(match, winnerUser, "win");
        const winnerGamesStatistics = gamesStatistics(
            winnerUser,
            winnerStatisticsByGame
        );

        remove(get(winnerUser, "expiringMoney", []), (amount) =>
            moment(amount.expireDate.toDate()).isBefore(moment())
        );

        logger.log("winner - ", winnerUserId, winnerUser);

        const totalMoney = +get(winnerUser, "money", 0) + +award;

        const promiseUser = setUser(
            winnerUser,
            totalMoney,
            winnerStatistics,
            winnerGamesStatistics,
            match
        );

        const promiseTransaction = transaction(
            "user-win",
            winnerUser,
            +award,
            `el usuario ha ganado ${award} ${currency} en el match ${match.id} `,
            null,
            match
        );

        await Promise.all([promiseUser, promiseTransaction]);
    });

    await Promise.all(promiseWinUsers);

    const promiseLoseUsers = loseUsers.map(async (currentUser) => {
        const loseUserId = currentUser.id;
        const loseUser = await fetchUser(loseUserId);
        const loseStatistics = statistics(match, loseUser, "lose", true);
        const loseStatisticsByGame = statistics(match, loseUser, "lose");
        const loseGamesStatistics = gamesStatistics(loseUser, loseStatisticsByGame);

        remove(get(loseUser, "expiringMoney", []), (amount) =>
            moment(amount.expireDate.toDate()).isBefore(moment())
        );

        logger.log("loser - ", loseUser.id, loseUser);

        const promiseUser = setUser(
            loseUser,
            0,
            loseStatistics,
            loseGamesStatistics,
            match
        );

        const promiseTransaction = transaction(
            "user-lose",
            loseUser,
            +match.gameEntryCost,
            `el usuario ha perdido ${match.gameEntryCost} ${currency} en el match ${match.id} `,
            null,
            match
        );

        await Promise.all([promiseUser, promiseTransaction]);
    });

    await Promise.all(promiseLoseUsers);
};

const setUser = async (
    user,
    totalMoney,
    statistics,
    gamesStatistics,
    match
) => {
    const subscriptions = get(user, "subscriptions", []);

    try {
        remove(
            subscriptions,
            (subscription) =>
                subscription.matchId === match.id ||
                subscription.tournamentId === match.tournamentId
        );
    } catch (error) {
        logger.error("error remove ", subscriptions);
    }

    let newUser = {
        ...statistics,
        gamesStatistics,
        subscriptions,
    };

    if (totalMoney > 0) {
        newUser.money = +totalMoney.toFixed(2);
        newUser.totalMoneyWon = +get(user, "totalMoneyWon", 0) + totalMoney;
    }

    if (totalMoney <= 0) {
        newUser.totalMoneyLose =
            +get(user, "totalMoneyLose", 0) + match.gameEntryCost;
    }

    await updateUser(user.id, newUser);
};

const statistics = (match, user, result, isGeneral) => {
    const gameStatistics = get(user, "gamesStatistics", []).find(
        (gameStatistics) => gameStatistics.gameId === match.game.id
    );

    const statisticsBy = isGeneral ? user : defaultTo(gameStatistics, {});

    let latestMatches = get(statisticsBy, "latestMatches", []);

    latestMatches.push(result);

    latestMatches = latestMatches.slice(
        latestMatches.length - 10,
        latestMatches.length
    );

    const statistics_ = {};

    statistics_.latestMatches = latestMatches;
    statistics_.level = calculateLevel(latestMatches);
    statistics_.matchesTotal = defaultTo(statisticsBy.matchesTotal, 0) + 1;
    statistics_.wonMatches =
        result === "win"
            ? defaultTo(statisticsBy.wonMatches, 0) + 1
            : defaultTo(statisticsBy.wonMatches, 0);
    statistics_.lostMatches =
        result === "lose"
            ? defaultTo(statisticsBy.lostMatches, 0) + 1
            : defaultTo(statisticsBy.lostMatches, 0);

    if (!isGeneral) statistics_.gameId = match.game.id;

    return statistics_;
};

const gamesStatistics = (user, gameStatistics) => {
    const gamesStatisticsFilter = get(user, "gamesStatistics", []).filter(
        (gameStatistics_) => gameStatistics_.gameId !== gameStatistics.gameId
    );

    return concat(gamesStatisticsFilter, gameStatistics);
};

const calculateLevel = (latestMatches) => {
    const latestMatchesWin = latestMatches.filter(
        (latestWin) => latestWin === "win"
    );

    return latestMatchesWin.length <= 1
        ? 1
        : latestMatchesWin.length <= 3
            ? 2
            : 3; // por el momento solo hasta level 3
    //return latestMatchesWin.length <= 1 ? 1 : latestMatchesWin.length <= 3 ? 2 : latestMatchesWin.length <= 6 ? 3 : latestMatchesWin.length <= 8 ? 4 : 5;
};

module.exports = {updateMatchUsers};
