const {firestore, config} = require("../../../config");
const {get, reduce, map} = require("lodash");
const logger = require("../../../utils/logger");
const {fetchUser} = require("../../../collections/users");
const {transaction} = require("../../../transactions");

exports.putPay = async (req, res, next) => {
    logger.log("put tournamentTeam pay->", req.params);

    try {
        const {tournamentTeamId, userId, amount} = req.params;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);

        const tournament = await fetchTournament(tournamentTeam.tournamentId);

        logger.log("total + amount->", amount + totalPayment(tournamentTeam));

        let realAmount = amount;
        if (amount + totalPayment(tournamentTeam) > tournament.entryCost)
            realAmount = tournament.entryCost - totalPayment(tournamentTeam);

        const newTournamentTeam = addPayer(
            tournament,
            tournamentTeam,
            userId,
            realAmount
        );

        const currency = config.currency;

        const user = await fetchUser(userId);

        if (
            get(tournament, "realMoney", true) &&
            +get(user, "money", 0) < realAmount
        )
            return res.status(400).send("Dinero insuficiente");

        if (
            !get(tournament, "realMoney", true) &&
            +get(user, "ebCoins", 0) < realAmount
        )
            return res.status(400).send("Dinero jugable insuficiente");

        await transaction(
            "user-tournament-pay",
            user,
            +realAmount,
            `usuario aportó para el torneo: ${tournament.name} el monto de ${
                tournament.realMoney ? `${realAmount} ${currency}` : `${realAmount}K`
            }`,
            `aportó para la inscripción del torneo ${tournament.id}`,
            tournament,
            tournamentTeam
        );

        get(tournament, "realMoney", true)
            ? await updateUser(userId, {money: +get(user, "money", 0) - realAmount})
            : await updateUser(userId, {
                ebCoins: +get(user, "ebCoins", 0) - realAmount,
            });

        await updateTournamentTeam(tournamentTeamId, newTournamentTeam);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const fetchTournamentTeam = async (tournamentTeamId) => {
    const tournamentDocumentSnapShot = await firestore
        .doc("tournamentTeams/" + tournamentTeamId)
        .get();
    return tournamentDocumentSnapShot.data();
};

const fetchTournament = async (tournamentId) => {
    const tournamentDocumentSnapShot = await firestore
        .doc("tournaments/" + tournamentId)
        .get();
    return tournamentDocumentSnapShot.data();
};

const addPayer = (tournament, tournamentTeam, userId, amount) => {
    let newTournamentTeam = {
        playersPayments: {
            ...get(tournamentTeam, "playersPayments", {}),
            [userId]: +get(tournamentTeam, `playersPayments[${userId}]`, 0) + +amount,
        },
    };

    newTournamentTeam.isPayed =
        totalPayment(newTournamentTeam) >= +tournament.entryCost;

    return newTournamentTeam;
};

const totalPayment = (tournamentTeam) =>
    reduce(
        get(tournamentTeam, "playersPayments", {}),
        (result, value, key) => +value + +result,
        0
    );

const updateUser = async (userId, user) =>
    await firestore.doc(`users/${userId}`).update(user);

const updateTournamentTeam = async (tournamentTeamId, newTournamentTeam) =>
    firestore
        .doc(`tournamentTeams/${tournamentTeamId}`)
        .update(newTournamentTeam);
