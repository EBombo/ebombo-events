const {snapshotToArray} = require("../../utils");
const {firestore} = require("../../config");

const updateTournamentGroup = async (tournamentGroupId, tournamentGroup) =>
    await firestore
        .doc("tournamentGroups/" + tournamentGroupId)
        .update(tournamentGroup);

const fetchTournamentGroup = async (tournamentGroupId) => {
    const tournamentGroup = await firestore
        .doc("tournamentGroups/" + tournamentGroupId)
        .get();
    return tournamentGroup.data();
};

const fetchTournamentGroups = async (tournamentId) => {
    const tournamentGroupsQuerySnapshot = await firestore
        .collection("tournamentGroups")
        .where("tournamentId", "==", tournamentId)
        .where("deleted", "==", false)
        .get();

    if (tournamentGroupsQuerySnapshot.empty) return [];

    return snapshotToArray(tournamentGroupsQuerySnapshot);
};

const fetchTournamentGroupsByPhase = async (tournamentId, phase) => {
    const tournamentGroupsQuerySnapshot = await firestore
        .collection("tournamentGroups")
        .where("tournamentId", "==", tournamentId)
        .where("phase", "==", phase)
        .get();

    if (tournamentGroupsQuerySnapshot.empty) return [];

    return snapshotToArray(tournamentGroupsQuerySnapshot);
};

const fetchGroupsByTournament = async (tournamentId) => {
    const tournamentGroupsQuerySnapshot = await firestore
        .collection("tournamentGroups")
        .where("tournamentId", "==", tournamentId)
        .where("deleted", "==", false)
        .orderBy("createAt", "asc")
        .get();

    return snapshotToArray(tournamentGroupsQuerySnapshot);
};

module.exports = {
    updateTournamentGroup,
    fetchTournamentGroups,
    fetchTournamentGroup,
    fetchGroupsByTournament,
    fetchTournamentGroupsByPhase,
};
