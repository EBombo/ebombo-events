const {fetchTournament} = require("../../../collections/tournaments");
const {fetchTournamentTeam} = require("../../../collections/tournamentTeams");
const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {get, reduce} = require("lodash");

exports.putReadyToPay = async (req, res, next) => {
    logger.log("put tournamentTeam ready to pay->", req.params);

    try {
        const {tournamentTeamId} = req.params;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);

        const tournament = await fetchTournament(tournamentTeam.tournamentId);

        await updateTournamentTeam(tournamentTeamId, {
            readyToPay: true,
            isPayed: get(tournament, "entryCost", 0) === totalPayment(tournamentTeam),
        });

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const totalPayment = (tournamentTeam) =>
    reduce(
        get(tournamentTeam, "playersPayments", {}),
        (result, value, key) => +value + +result,
        0
    );

const updateTournamentTeam = async (tournamentTeamId, newTournament) =>
    firestore.doc(`tournamentTeams/${tournamentTeamId}`).update(newTournament);
