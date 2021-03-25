const CryptoAES = require("crypto-js/aes");
const admin = require("firebase-admin");
const moment = require("moment");
const {get} = require("lodash");
const logger = require("./logger");

exports.decryptAES = (cryptomessage, key) => {
    return this.hex2string(
        CryptoAES.decrypt(cryptomessage, key).toString()
    ).toString();
};

exports.hex2string = (hexx) => {
    let hex = hexx.toString();
    let str = "";
    for (var i = 0; i < hex.length && hex.substr(i, 2) !== "00"; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
};

exports.snapshotToArray = (snapshot) => {
    const returnArray = [];
    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.data();
        item.id = childSnapshot.id;
        returnArray.push(item);
    });
    return returnArray;
};

exports.documentSnapshotToArray = (snapshot) => {
    const returnArray = [];
    snapshot.forEach((childSnapshot) => {
        if (childSnapshot.get("id")) {
            const item = childSnapshot.data();
            item.id = childSnapshot.id;
            returnArray.push(item);
        }
    });
    return returnArray;
};

exports.querySnapshotToArray = (snapshot) => {
    const returnArray = [];
    snapshot.docs.forEach((childSnapshot) => {
        const item = childSnapshot.data();
        item.id = childSnapshot.id;
        returnArray.push(item);
    });
    return returnArray;
};

exports.normalize = (field) => {
    let regex = /[.,\s]+/g;
    const normalizer = require("normalize-text");
    return normalizer
        .normalizeDiacritics(field.toUpperCase())
        .replace(regex, " ");
};

exports.namesToArray = (firstName, lastName) => {
    let namesArray = [];
    namesArray = firstName.split(" ").concat(lastName.split(" "));
    return namesArray;
};

exports.executeIfNotAlreadyTriggered = (eventId, f) => {
    const eventIdRef = admin
        .firestore()
        .collection("functionsEventIds")
        .doc(eventId);

    return admin.firestore().runTransaction((transaction) => {
        return transaction.get(eventIdRef).then((doc) => {
            if (doc.exists) {
                throw Error(
                    "Trying to sent double event! Error from Google Firestore (still in Beta release)"
                );
            } else {
                transaction.set(eventIdRef, {});
                f();
            }
        });
    });
};

exports.parseJSONTimeStamp = (timestamp) =>
    moment(timestamp.seconds * 1000).toDate();

exports.searchName = (user) => {
    logger.log("user->", user);
    const email = get(user, "email") ? get(user, "email") : "";

    return [
        ...get(user, "name", "").toUpperCase().split(" "),
        ...get(user, "lastName", "").toUpperCase().split(" "),
        get(user, "nickname", "").toUpperCase(),
        email.toUpperCase(),
    ];
};
