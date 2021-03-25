const {snapshotToArray} = require("../../utils");
const {firestore} = require("../../config");

const fetchGame = async (gameId) => {
    const game = await firestore.doc("games/" + gameId).get();
    return game.data();
};

const fetchGames = async () => {
    const gameQuerySnapShot = await firestore.collection("games").get();
    return snapshotToArray(gameQuerySnapShot);
};

const fetchGameWithLimit = async (limit) => {
    const gameQuerySnapShot = await firestore
        .collection("games")
        .limit(limit)
        .get();
    return snapshotToArray(gameQuerySnapShot);
};

module.exports = {fetchGame, fetchGames, fetchGameWithLimit};
