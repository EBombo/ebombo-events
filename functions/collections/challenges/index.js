const {firestore} = require("../../config");

const fetchChallenge = async (challengeId) => {
    const challengeRef = await firestore.doc(`challenges/${challengeId}`).get();
    return challengeRef.data();
};

const updateChallenge = async (challengeId, newChallenge) =>
    await firestore.doc(`challenges/${challengeId}`).update({...newChallenge});

module.exports = {fetchChallenge, updateChallenge};
