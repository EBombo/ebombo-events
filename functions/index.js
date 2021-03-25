const functions = require("firebase-functions");
const api = require("./api");
const apiAdmin = require("./apiAdmin");
const apiMatches = require("./apiMatches");
const {scheduleMatches} = require("./schedules");

const runtimeOptions = {
    timeoutSeconds: 540,
    memory: "2GB",
};

exports.api = functions.runWith(runtimeOptions).https.onRequest(api.app);

exports.apiAdmin = functions
    .runWith(runtimeOptions)
    .https.onRequest(apiAdmin.api);

exports.apiMatches = functions
    .runWith(runtimeOptions)
    .https.onRequest(apiMatches.api);

exports.scheduleResolveMatches = functions
    .runWith(runtimeOptions)
    .pubsub.schedule("every 1 minutes")
    .onRun(scheduleMatches);
