const {firestore} = require("../../../config");
const {fetchUser} = require("../../../collections/users");

exports.postMessage = async (req, res, next) => {
    try {
        console.log("Post message chat", req.body);

        const chatId = req.params.chatId;
        const message = req.body;

        const promiseFetchChat = fetchChat(chatId);
        const promiseFetchUser = fetchUser(message.userId);
        const promiseFetchMatch = fetchMatch(chatId);

        const promiseAll = await Promise.all([
            promiseFetchChat,
            promiseFetchUser,
            promiseFetchMatch,
        ]);

        const chat = promiseAll[0];
        const user = promiseAll[1];
        const match = promiseAll[2];

        const promiseAddChat = addChat(chatId, match);
        const promiseAddMessage = addMessage(chatId, message, user);

        let promisesAddAll = [promiseAddMessage];

        if (!chat) promisesAddAll = [...promisesAddAll, promiseAddChat];

        await Promise.all(promisesAddAll);

        return res.send(200);
    } catch (error) {
        console.error("Post message chat", error);
        next(error);
    }
};

const addMessage = async (chatId, message, user) => {
    const chatMessageRef = await firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc();

    const messageId = chatMessageRef.id;

    await firestore
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messageId)
        .set({
            id: messageId,
            content: message.content,
            createAt: new Date(),
            user: user,
        });
};

const addChat = async (chatId, match) => {
    await firestore.collection("chats").doc(chatId).set({
        id: chatId,
        createAt: new Date(),
        match: match,
    });
};

const fetchChat = async (chatId) => {
    const chatRef = await firestore.collection("chats").doc(chatId).get();

    if (!chatRef.exists) return null;

    return chatRef.data();
};

const fetchMatch = async (chatId) => {
    if (chatId === "public") return null;

    const matchRef = await firestore.collection("matches").doc(chatId).get();

    return matchRef.exists ? matchRef.data() : null;
};
