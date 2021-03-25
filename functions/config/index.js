const admin = require("firebase-admin");
const url = require("url");
const configJson = require("./config");

admin.initializeApp();

const adminFirestore = admin.firestore;
const firestore = admin.firestore();
const auth = admin.auth();
const projectId = process.env.GCLOUD_PROJECT;
const currentEnvironment = projectId.includes("bombo-sport-dev")
    ? "dev"
    : "production";

const config = projectId.includes("bombo-sport-dev")
    ? configJson.devConfig
    : configJson.productionConfig;

const hostname = (req) => url.parse(req.headers.origin).hostname;

module.exports = {
  adminFirestore,
  currentEnvironment,
  firestore,
  hostname,
  auth,
  config,
};
