const {get} = require("lodash");

const calculateAward = (entryCost, settings) => {
    let totalAward = entryCost * 2;
    let commission = get(settings, "commission", 0) / 100;
    totalAward = +(totalAward * (1 - commission)).toFixed(2);
    return totalAward;
};

const calculateRechargeCommission = (amount, settings) => {
    const commission = +get(settings, "commission", 0) / 100;
    const netBallot = +(amount * commission).toFixed(2);
    const netRecharge = +amount - +netBallot;
    return {netBallot, netRecharge};
};

module.exports = {calculateAward, calculateRechargeCommission};
