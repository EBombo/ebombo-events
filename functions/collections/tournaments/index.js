const {firestore} = require("../../config");

const updateTournament = async (tournamentId, newTournament) =>
    await firestore.doc(`tournaments/${tournamentId}`).update({
        ...newTournament,
        updateAt: new Date(),
    });

const fetchTournament = async (tournamentId) => {
    const tournamentDocumentSnapShot = await firestore
        .doc("tournaments/" + tournamentId)
        .get();
    return tournamentDocumentSnapShot.data();
};

module.exports = {updateTournament, fetchTournament};
