const {fetchMatch, updateMatch} = require("../../../collections/matches");
const {fetchUser, updateUser} = require("../../../collections/users");
const {calculateFinishTime} = require("../calculateFinishTime");
const logger = require("../../../utils/logger");
const {config} = require("../../../config");
const moment = require("moment");
const {transaction} = require("../../../transactions");
const {stepFour} = require("./stepFour");
const {userDiscountMoney} = require("../userDiscountMoney");
const {get} = require("lodash");

const currency = config.currency;

const postSteps = async (req, res, next) => {
    try {
        logger.log("match steps->", req.body, req.params);

        const {step, userId, challengerPoints, challengedPoints} = req.body;
        const {matchId} = req.params;

        const match = await fetchMatch(matchId);

        if (step === 0) await updateMatchToAcceptInvitation(matchId, match, userId);
        if (step === 1) await updateMatchToStepOne(matchId, match, userId);
        if (step === 2) await updateMatchToStepTwo(matchId, match, userId);
        if (step === 3)
            await updateMatchToStepThree(
                userId,
                matchId,
                match,
                challengerPoints,
                challengedPoints
            );
        if (step === 4) await stepFour(match, req.body);

        return res.sendStatus(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const updateMatchToAcceptInvitation = async (matchId, match, userId) => {
    const user = await fetchUser(userId);

    const newUser = userDiscountMoney(user, match.gameEntryCost, match.id, null);

    await transaction(
        "user-start-match",
        {
            ...user,
            subscription: newUser.subscription,
        },
        +match.gameEntryCost,
        `El usuario ha empezado [aceptó invitación] a jugar un match ${matchId} de ${currency} ${match.gameEntryCost}`,
        null,
        match
    );

    await updateUser(user.id, {
        money: +newUser.money,
        expiringMoney: newUser.expiringMoney,
    });

    const finishAt = calculateFinishTime(match.rule);

    await updateMatch(matchId, {
        [`${isChallenger(userId, match)}AcceptInvitation`]: [
            ...get(match, `${isChallenger(userId, match)}AcceptInvitation`, []),
            userId,
        ],
        finishAt,
    });
};

const updateMatchToStepOne = async (matchId, match, userId) =>
    await updateMatch(matchId, {
        [`${isChallenger(userId, match)}AddOpponent`]: userId,
    });

const updateMatchToStepTwo = async (matchId, match, userId) =>
    await updateMatch(matchId, {
        [`${isChallenger(userId, match)}Entered`]: userId,
    });

const updateMatchToStepThree = async (
    userId,
    matchId,
    match,
    challengerPoints,
    challengedPoints
) => {
    let newMatch = {
        challengerPoints,
        challengedPoints,
        finishAt: moment().add(5, "minutes").toDate(),
    };

    if (match.challengerPoints || match.challengedPoints)
        return logger.log("Points already exist");

    newMatch[`${isChallenger(userId, match)}AcceptResult`] = userId;

    await updateMatch(matchId, newMatch);
};

const isChallenger = (userId, match) =>
    match.challengerIds.includes(userId) ? "challenger" : "challenged";

module.exports = {postSteps};
