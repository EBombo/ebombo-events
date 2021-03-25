const {firestore} = require("../../config");

const updateEvent = async (eventId, event) => {
    await firestore.doc(`events/${eventId}`).update(event);
};

const saveEvent = async (event) => {
    const eventId = firestore.collection("events").doc().id;
    await firestore.doc(`events/${eventId}`).set(event);
    return eventId;
};

module.exports = {updateEvent, saveEvent};
