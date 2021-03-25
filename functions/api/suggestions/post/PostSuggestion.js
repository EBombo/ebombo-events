const {firestore} = require("../../../config");
const logger = require("../../../utils/logger");
const {fetchUser} = require("../../../collections/users");

exports.postSuggestion = async (req, res, next) => {
    try {
        logger.log("Post suggestion", req.body, req.params);

        const {suggestion} = req.body;
        const {userId} = req.params;

        const user = await fetchUser(userId);

        const suggestionId = firestore.collection("suggestions").doc().id;
        await sendSuggestion(suggestion, user, suggestionId);

        return res.send(200);
    } catch (error) {
        console.error("Post message chat", error);
        next(error);
    }
};

const sendSuggestion = async (suggestion, user, suggestionId) =>
    await firestore.collection("suggestions").doc(suggestionId).set({
        id: suggestionId,
        content: suggestion,
        createAt: new Date(),
        updateAt: new Date(),
        deleted: false,
        user: user,
    });
