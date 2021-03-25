const {
    updateTournament,
    fetchTournament,
} = require("../../../collections/tournaments");
const {FieldValue} = require("@google-cloud/firestore");
const {firestore} = require("../../../config");
const {get} = require("lodash");
const logger = require("../../../utils/logger");
const {fetchUser, updateUser} = require("../../../collections/users");
const {transaction} = require("../../../transactions");

exports.putTournamentInscriptionTeamBrief = async (req, res, next) => {
    try {
        logger.log(
            "put tournamentTeam inscription user brief->",
            req.params,
            req.body
        );

        const {tournamentId, userId} = req.params;

        const promiseTournament = fetchTournament(tournamentId);

        const promiseUser = fetchUser(userId);

        const responsePromise = await Promise.all([promiseTournament, promiseUser]);

        const tournament = responsePromise[0];
        const user = responsePromise[1];

        const entryCost = +get(tournament, "entryCost", 0);

        if (get(tournament, "playerIds", []).includes(userId))
            return res
                .status(400)
                .send({statusText: "Usted ya se encuentra inscrito en el torneo"});

        if (tournament.countTournamentTeams >= tournament.playersLimit)
            return res
                .status(400)
                .send({statusText: "Equipos inscritos completos"});

        if (tournament.linkType !== "payment")
            if (get(user, "money", 0) < entryCost)
                return res
                    .status(400)
                    .send({statusText: "Dinero Insuficiente, debe recargar."});

        if (tournament.linkType === "direct") {
            await directInscription(req.body, user, tournament, entryCost);
        } else if (tournament.linkType === "payment") {
            await paymentInscription(req.body, user, tournament, entryCost);
        } else if (tournament.linkType === "university") {
            await universityInscription(req.body, user, tournament, entryCost);
        } else {
            await businessInscription(req.body, user, tournament, entryCost);
        }

        await countTournamentTeams(tournament.id);

        await updateTournament(tournamentId, {
            playerIds: [...tournament.playerIds, userId],
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const directInscription = async (body, user, tournament, entryCost) => {
    const userAccountId = get(body, "idGame", "");
    const accountId = get(body, "accountId", "");

    const newUser = {
        ...user,
        userAccounts: {...user.userAccounts, [accountId]: userAccountId},
    };

    const promiseTournamentTeams = saveTournamentTeams(
        tournament,
        newUser,
        entryCost
    );

    const promiseTransaction = transaction(
        "user-tournament-inscription",
        newUser,
        +entryCost,
        `El usuario se unio al torneo: ${tournament.name}`,
        `pago la inscripción del torneo ${tournament.id}`,
        tournament
    );

    const promiseUser = discountUsers(tournament, user, +entryCost);

    await Promise.all([promiseTournamentTeams, promiseTransaction, promiseUser]);
};

const paymentInscription = async (body, user, tournament, entryCost) => {
    const inscriptionUrl = get(body, "inscriptionUrl", "");
    const userAccountId = get(body, "idGame", "");
    const accountId = get(body, "accountId", "");

    const newUser = {
        ...user,
        userAccounts: {...user.userAccounts, [accountId]: userAccountId},
    };

    const promiseTournament = saveTournamentTeams(
        tournament,
        newUser,
        entryCost,
        inscriptionUrl
    );

    const promiseTransaction = transaction(
        "user-tournament-inscription",
        newUser,
        +entryCost,
        `usuario SOLICITÓ inscripción al torneo: ${tournament.name}`,
        `pago la inscripción del torneo ${tournament.id}`,
        tournament
    );
    await Promise.all([promiseTournament, promiseTransaction]);
};

const universityInscription = async (body, user, tournament, entryCost) => {
    const {career, studentId} = body;
    const nickname = get(user, "name", "")
        .charAt(0)
        .concat(`. `)
        .concat(get(user, "lastName", "").split(" ")[0])
        .concat(` - ${career}`);

    const promiseTournament = saveTournamentTeams(
        tournament,
        {...user, nickname, studentId, career},
        entryCost
    );

    const promiseTransaction = transaction(
        "user-tournament-inscription",
        {...user, nickname, studentId, career},
        +entryCost,
        `El usuario se unio al torneo de: ${tournament.name}`,
        `pago la inscripción del torneo ${tournament.id}`,
        tournament
    );

    const promiseUser = discountUsers(tournament, user, +entryCost);

    await Promise.all([promiseTournament, promiseTransaction, promiseUser]);
};

const businessInscription = async (body, user, tournament, entryCost) => {
    const {department} = body;

    const nickname = get(user, "name", "")
        .charAt(0)
        .concat(`. `)
        .concat(get(user, "lastName", "").split(" ")[0])
        .concat(` - ${department}`);

    const promiseTournament = saveTournamentTeams(
        tournament,
        {...user, nickname, department},
        entryCost
    );

    const promiseTransaction = transaction(
        "user-tournament-inscription",
        {...user, nickname, department},
        +entryCost,
        `El usuario se unio al torneo de: ${tournament.name}`,
        `pago la inscripción del torneo ${tournament.id}`,
        tournament
    );

    const promiseUser = discountUsers(tournament, user, +entryCost);

    await Promise.all([promiseTournament, promiseTransaction, promiseUser]);
};

const saveTournamentTeams = async (
    tournament,
    user,
    entryCost,
    inscriptionUrl = null
) => {
    const tournamentTeamsRef = firestore.collection("tournamentTeams");
    const tournamentTeamId = tournamentTeamsRef.doc().id;

    const tournamentTeam = {
        id: tournamentTeamId,
        tournamentId: tournament.id,
        tournament,
        inscriptionByBrief: true,
        players: [user],
        playerIds: [user.id],
        playerIdsAcceptInvitation: [user.id],
        playersPayments: {[user.id]: entryCost},
        deleted: false,
        updateAt: new Date(),
        createAt: new Date(),
        isClosed: tournament.rule.totalPlayers === 1,
        isPayed: false,
    };

    if (inscriptionUrl) tournamentTeam["inscriptionUrl"] = inscriptionUrl;

    await tournamentTeamsRef.doc(tournamentTeamId).set(tournamentTeam);
};

const countTournamentTeams = async (tournamentId) =>
    await firestore.doc(`tournaments/${tournamentId}`).update({
        countTournamentTeams: FieldValue.increment(1),
    });

const discountUsers = async (tournament, user, entryCost) =>
    await updateUser(user.id, {
        money: +(+get(user, "money", 0) - entryCost).toFixed(2),
        totalTournaments: FieldValue.increment(1),
    });
