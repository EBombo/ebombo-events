const {querySnapshotToArray} = require("../utils");
const {firestore} = require("../config");
const {get} = require("lodash");
const moment = require("moment");
const {transaction} = require("../transactions");
const logger = require("../utils/logger");
const {updateChallenge} = require("../collections/challenges");
const {
    payAward,
    userRecoveryMoney,
} = require("../apiMatches/matches/payAward");
const {updateMatch} = require("../collections/matches");
const {fetchUser} = require("../collections/users");

exports.scheduleMatches = async () => {
    try {
        const matches = await fetchMatches();

        await solveMatches(matches);
    } catch (error) {
        logger.error(error);
    }
};

const fetchMatches = async () => {
    let matchesQuerySnapShot = await firestore
        .collection("matches")
        .where("isCanceled", "==", false)
        .where("isClosed", "==", false)
        .where("createAt", ">", moment().subtract(2, "days").toDate())
        .get();

    logger.log(
        "schedule fetch matches->",
        querySnapshotToArray(matchesQuerySnapShot).length
    );

    return querySnapshotToArray(matchesQuerySnapShot);
};

const solveMatches = async (matches) => {
    const promises = matches.map(async (match) => {
        logger.log(
            "schedule match->",
            match.id,
            "challengerReady->",
            match.challengerReady,
            "cancelAt->",
            match.cancelAt ? moment().isAfter(match.cancelAt.toDate()) : null,
            "acceptedAt->",
            match.acceptedAt
                ? moment(match.acceptedAt.toDate())
                    .add(10, "minutes")
                    .isAfter(new Date())
                : null,
            "results->",
            match.challengedAcceptResult,
            match.challengerAcceptResult,
            "playing->",
            moment().isBefore(match.finishAt.toDate())
        );

        //no resolver si tiene RECLAMO
        if (match.hasClaim) return;

        //cancelar si el tiempo para aceptar la cancelacion es mayor a 5min
        if (match.cancelAt && moment().isAfter(match.cancelAt.toDate()))
            return cancelMatch(match);

        //no cancelar si es un match de torneo
        //cancelar si el tiempo para dar en "ESTOY LISTO" ha concluido
        if (
            !match.tournamentId &&
            !match.challengerReady &&
            moment(match.acceptedAt.toDate()).add(10, "minutes").isBefore(new Date())
        )
            return cancelMatch(match);

        //no resolver si aun no termina la partida
        if (moment().isBefore(match.finishAt.toDate())) return;

        //no revolver si es un match de torneo
        //si ninguno a aceptar el resultado se cancelar (nadie subio el resultado)
        if (
            !match.tournamentId &&
            !match.challengedAcceptResult &&
            !match.challengerAcceptResult
        )
            return cancelMatch(match);

        //auto aceptar si uno de los dos no acepto el resultado (se entiende que llega aqui si alguno subio resultado)
        if (!match.challengedAcceptResult || !match.challengerAcceptResult)
            return acceptResults(match);
    });

    await Promise.all(promises);
};

const cancelMatch = async (match) => {
    logger.log("Schedule => Canceling match", match.id, match);

    const userIds_ = get(match, "challengerAcceptInvitation", []).concat(
        get(match, "challengedAcceptInvitation", [])
    );

    const promises = userIds_.map(async (userId) => {
        try {
            const user = await fetchUser(userId);
            await transaction(
                "user-cancel-match",
                user,
                +match.gameEntryCost,
                `El schedule cancelo una partida ${match.id} con costo de entrada de ${match.gameEntryCost}`,
                null,
                match
            );

            await userRecoveryMoney(userId, match.id);
        } catch (error) {
            logger.error(error);
        }
    });

    await Promise.all(promises);

    await updateMatch(match.id, {
        isCanceled: true,
        isClosed: true,
        resolvedBySchedule: new Date(),
    });

    match.challengeId &&
    (await updateChallenge(match.challengeId, {
        isClosed: true,
        resolvedBySchedule: new Date(),
    }));
};

const acceptResults = async (match) => {
    logger.log("Schedule => accepting result", match.id, match);

    await updateMatch(match.id, {
        challengerAcceptResult: match.challenger[0].id,
        challengedAcceptResult: match.challenged[0].id,
        challengerPoints: get(match, "challengerPoints", [0]),
        challengedPoints: get(match, "challengedPoints", [0]),
        resolvedBySchedule: new Date(),
    });

    await payAward(match.id);
};
