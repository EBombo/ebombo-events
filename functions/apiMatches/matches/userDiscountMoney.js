const moment = require("moment");
const momentTz = require("moment-timezone");
const {get, defaultTo, remove, orderBy} = require("lodash");

const userDiscountMoney = (user, entryCost_, matchId, tournamentId) => {
    let entryCost = +entryCost_;

    //Remover dinero que ya expiro a la fecha
    remove(get(user, "expiringMoney", []), (amount) =>
        moment(amount.expireDate.toDate()).isBefore(momentTz().tz("America/Lima"))
    );

    let money = +get(user, "money", 0);

    let expiringMoney = orderBy(
        get(user, "expiringMoney", []),
        ["expireDate"],
        ["asc"]
    );

    let expiringMoneySubscription = [];

    if (!tournamentId)
        expiringMoney.forEach((amount) => {
            if (entryCost > 0) {
                if (amount.money >= entryCost) {
                    expiringMoneySubscription = expiringMoneySubscription.concat({
                        money: entryCost,
                        expireDate: amount.expireDate,
                    });
                    amount.money -= entryCost;
                    entryCost = 0;
                } else {
                    expiringMoneySubscription = expiringMoneySubscription.concat({
                        money: amount.money,
                        expireDate: amount.expireDate,
                    });
                    entryCost -= amount.money;
                    amount.money = 0;
                }
            }
        });

    remove(expiringMoney, (amount) => amount.money <= 0);

    let moneySubscription = 0;

    if (money > entryCost) {
        moneySubscription += entryCost;
        money -= entryCost;
        entryCost = 0;
    } else {
        moneySubscription += money;
        entryCost -= money;
        money = 0;
    }

    const subscription = {
        matchId: defaultTo(matchId, null),
        tournamentId: defaultTo(tournamentId, null),
        money: moneySubscription,
        expiringMoney: expiringMoneySubscription,
    };

    return {money, expiringMoney, subscription};
};

module.exports = {userDiscountMoney};
