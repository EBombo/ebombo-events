const {firestore} = require("../../../config");
const {get} = require("lodash");
const {fetchUser} = require("../../../collections/users");
const {fetchConsole} = require("../../../collections/consoles");
const {fetchRule} = require("../../../collections/rules");
const {fetchGame} = require("../../../collections/games");
const logger = require("../../../utils/logger");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const {config} = require("../../../config");

const template = fs
    .readFileSync(path.join(__dirname, "../../../email/templates/challenge.html"))
    .toString();

const postChallenge = async (req, res, next) => {
    logger.log("post challenge->", req.body);

    try {
        const {
            userId,
            gameRuleId,
            gameId,
            consoleId,
            gameEntryCost,
            realMoney,
        } = req.body;

        const challengedId = get(req, "body.challengedId", null);

        let challenged = null;

        if (challengedId) {
            challenged = await fetchUser(challengedId);
            challenged = {...challenged, acls: null};
        }

        const promiseUser = fetchUser(userId);
        const promiseRule = fetchRule(gameRuleId);
        const promiseGame = fetchGame(gameId);
        const promiseConsole_ = fetchConsole(consoleId);

        const promiseAll = await Promise.all([
            promiseUser,
            promiseRule,
            promiseGame,
            promiseConsole_,
        ]);

        let user = promiseAll[0];
        const rule = promiseAll[1];
        const game = promiseAll[2];
        const console_ = promiseAll[3];

        user = {...user, acls: null};

        const matchId = firestore.collection("matches").doc().id;

        const gameStatistics = get(user, "gamesStatistics", []).find(
            (game_) => game_.gameId === game.id
        );

        const challengeId = await createChallenge(
            user,
            rule,
            game,
            console_,
            gameEntryCost,
            matchId,
            realMoney,
            get(gameStatistics, "level", 0),
            challenged
        );

        if (challenged) await sendEmail_(user, challenged, game, gameEntryCost);

        return res.status(200).send({challengeId});
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const createChallenge = async (
    user,
    rule,
    game,
    console_,
    gameEntryCost,
    matchId,
    realMoney,
    level,
    challenged
) => {
    const challengeRef = firestore.collection("challenges");
    const challengeId = challengeRef.doc().id;

    let playersIds = [user.id];
    if (challenged) playersIds.push(challenged.id);

    await challengeRef.doc(challengeId).set({
        id: challengeId,
        challenger: {...user, level},
        challengerReady: !!challenged,
        challenged,
        challengedReady: false,
        matchId,
        rule,
        game,
        console: console_,
        gameEntryCost,
        createAt: new Date(),
        updateAt: new Date(),
        deleted: false,
        isClosed: false,
        realMoney,
        playersIds,
    });

    return challengeId;
};

const sendEmail_ = async (challenger, challenged, game) => {
    let mailSubject = "Invitación Desafío";

    await sendEmail(challenged.email, mailSubject, template, {
        user: challenged.name,
        message: `${challenger.name} te ha enviado un desafio de ${game.name}`,
        description: "Tienes 30 minutos para aceptar el desafio",
        applicationRootUrl: config.applicationRootUrl,
    });
};

module.exports = {postChallenge};
