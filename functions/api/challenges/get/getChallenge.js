const {get} = require("lodash");
const {fetchUser, updateUser} = require("../../../collections/users");
const logger = require("../../../utils/logger");
const {
    updateChallenge,
    fetchChallenge,
} = require("../../../collections/challenges");
const {newMatch} = require("../../../collections/matches");
const {
    calculateFinishTime,
} = require("../../../apiMatches/matches/calculateFinishTime");
const {firestore} = require("../../../config");
const {snapshotToArray} = require("../../../utils");
const {transaction} = require("../../../transactions");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const {updateSetting} = require("../../../collections/settings");
const {fetchMatch} = require("../../../collections/matches");
const {
    userDiscountMoney,
} = require("../../../apiMatches/matches/userDiscountMoney");
const {config} = require("../../../config");
const {FieldValue} = require("@google-cloud/firestore");

const template = fs
    .readFileSync(path.join(__dirname, "../../../email/templates/challenge.html"))
    .toString();

const currency = config.currency;

const getChallenge = async (req, res, next) => {
    logger.log("getChallenge->", req.params);

    try {
        const {challengeId, userId, action} = req.params;

        const challenge = await fetchChallenge(challengeId);

        if (action === "cancel") {
            const user = await fetchUser(userId);

            await transaction(
                "user-cancel-challenge",
                user,
                0,
                "Se ha cancelado el desafio",
                null,
                challenge
            );

            await updateChallenge(challengeId, {deleted: true});

            return res.send(200);
        }

        if (action === "challengedReady") {
            let challenged = await fetchUser(userId);

            if (challenge.challenged && challenge.challenged.id !== challenged.id)
                return res
                    .status(400)
                    .send({message: "Esta partida ya tiene un retador"});

            logger.log("challenge.deleted->", challenge.id, challenge.deleted);

            if (challenge.deleted)
                return res.status(400).send({message: "Este challenge fue cerrado"});

            await updateChallenge(challengeId, {
                challengedReady: true,
                playersIds: [...challenge.playersIds, challenged.id],
            });

            const users = [challenge.challenger, challenged];

            const promiseMatch = newMatch(challenge.matchId, {
                id: challenge.matchId,
                challengeId: challenge.id,
                challengerReady: get(challenge, "challengerReady", false),
                challenger: [challenge.challenger],
                challengerIds: [challenge.challenger.id],
                challengerAcceptInvitation: [challenge.challenger.id],
                challengedReady: true,
                challenged: [{...challenged, acls: null}],
                challengedIds: [challenged.id],
                challengedAcceptInvitation: [challenged.id],
                playersIds: [challenge.challenger.id, challenged.id],
                rule: challenge.rule,
                game: challenge.game,
                console: challenge.console,
                gameEntryCost: challenge.gameEntryCost,
                additionalRule: get(challenge, "additionalRule", null),
                realMoney: get(challenge, "realMoney", true),
                isClosed: false,
                isCanceled: false,
                createAt: new Date(),
                updateAt: new Date(),
                acceptedAt: new Date(),
                finishAt: calculateFinishTime(challenge.rule),
                tournamentId: null,
            });

            await updateSetting("default", {totalMatches: FieldValue.increment(1)});

            const promiseChallenges = deleteUsersChallenges(users, challenge);

            await Promise.all([promiseMatch, promiseChallenges]);

            const promiseEmail = sendEmail_(
                challenge.challenger,
                challenged,
                challenge
            );

            const promiseDiscount = discountUsers(
                users,
                challenge.gameEntryCost,
                challenge.matchId,
                null
            );

            await Promise.all([promiseEmail, promiseDiscount]);
        }

        return res.send({matchId: challenge.matchId});
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const deleteUsersChallenges = async (users, challenge) => {
    try {
        const promises = users.map(async (user) => {
            let challenges = await fetchChallenges(user.id);

            challenges = challenges.filter((match) => match.id !== challenge.id);

            const batchRef = firestore.batch();

            challenges.forEach((challenge_) =>
                batchRef.update(firestore.doc(`challenges/${challenge_.id}`), {
                    isClosed: true,
                })
            );

            await batchRef.commit();
        });
        await Promise.all(promises);
    } catch (error) {
        logger.error(error);
    }
};

const fetchChallenges = async (userId) => {
    const challengesSnapshot = await firestore
        .collection("challenges")
        .where("deleted", "==", false)
        .where("challengedReady", "==", false)
        .where("challenger.id", "==", userId)
        .get();

    return snapshotToArray(challengesSnapshot);
};

const discountUsers = async (users, gameEntryCost, matchId, tournamentId) => {
    const promises = users.map(async (user) => {
        const newUser = userDiscountMoney(
            user,
            gameEntryCost,
            matchId,
            tournamentId
        );

        const match = await fetchMatch(matchId);

        await transaction(
            "user-start-match",
            {
                ...user,
                subscription: newUser.subscription,
            },
            +gameEntryCost,
            `El usuario ha empezado a jugar un match ${matchId} de ${currency} ${gameEntryCost}`,
            null,
            match
        );

        await updateUser(user.id, {
            money: +newUser.money.toFixed(2),
            expiringMoney: newUser.expiringMoney,
        });
    });

    await Promise.all(promises);
};

const sendEmail_ = async (challenger, challenged, challenge) => {
    let mailSubject = "Han Aceptado Tu Desafio";

    await sendEmail(challenger.email, mailSubject, template, {
        user: challenger.name,
        message: `${challenged.name} ha aceptado tu desafío de ${challenge.game.name}`,
        description:
            "Tienes 10 minutos para confirmar el encuentro, antes que se cancele.",
        applicationRootUrl: config.applicationRootUrl,
    });
};

module.exports = {getChallenge};
