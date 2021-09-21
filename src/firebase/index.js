import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import configJson from "./config.json";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

const version = "0.2";

let hostName =
  process.env.NODE_ENV === "development"
    ? "localhost"
    : get(process, "env.GCLOUD_PROJECT", "");

if (typeof window !== "undefined")
  hostName = get(window, "location.hostname", "").replace("subdomain.", "");

console.log("projectId", hostName);

let config;

if (
  hostName.includes("beta.") ||
  hostName.includes("-dev") ||
  hostName.includes("localhost")
) {
  config = configJson.development;
  console.log("dev", version);
} else {
  config = configJson.production;
  console.log("prod", version);
}

let analytics;
let firestore;
let storage;
let auth;

if (isEmpty(firebase.apps)) {
  try {
    console.log("initializeApp", firebase.apps);
    firebase.initializeApp(config.firebase);
    firestore = firebase.firestore();
    storage = firebase.storage();
    auth = firebase.auth();

    if (typeof window !== "undefined") {
      analytics = firebase.analytics();
    }

    firestore.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }
}

if (hostName === "localhost") {
  config.serverUrl = config.serverUrlLocal;
  //firestore.useEmulator("localhost", 8080);
  //auth.useEmulator("http://localhost:9099/");
}

const landingsStorageBucket = firebase
  .app()
  .storage(`gs://${config.landingsStorageBucket}`);

export {
  auth,
  config,
  version,
  storage,
  firebase,
  hostName,
  analytics,
  firestore,
  landingsStorageBucket,
};
