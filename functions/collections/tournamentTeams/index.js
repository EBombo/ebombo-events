const {firestore} = require("../../config");
const {snapshotToArray} = require("../../utils");

const updateTournamentTeam = async (tournamentTeamId, tournamentTeam) =>
    await firestore
        .doc("tournamentTeams/" + tournamentTeamId)
        .update(tournamentTeam);

const fetchTournamentTeam = async (tournamentTeamId) => {
    const tournamentDocumentSnapShot = await firestore
        .doc("tournamentTeams/" + tournamentTeamId)
        .get();

    return tournamentDocumentSnapShot.data();
};

const fetchTournamentTeamByTournamentAndUser = async (
    tournamentTeamId,
    userId
) => {
    const tournamentDocumentSnapShot = await firestore
        .collection("tournamentTeams")
        .where("tournamentId", "==", tournamentTeamId)
        .where("deleted", "==", false)
        .where("playerIds", "array-contains", userId)
        .get();

    return snapshotToArray(tournamentDocumentSnapShot);
};

const fetchTournamentTeamsByTournament = async (tournamentId) => {
    const tournamentDocumentSnapShot = await firestore
        .collection("tournamentTeams")
        .where("tournamentId", "==", tournamentId)
        .where("deleted", "==", false)
        .get();

    return snapshotToArray(tournamentDocumentSnapShot);
};

module.exports = {
    updateTournamentTeam,
    fetchTournamentTeam,
    fetchTournamentTeamByTournamentAndUser,
    fetchTournamentTeamsByTournament,
};
