import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import configJson from "./config.json";
import isEmpty from "lodash/isEmpty";

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "localhost:3001";
console.log("process.env.NEXT_PUBLIC_DOMAIN", DOMAIN);

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENV ?? "development";
console.log("process.env.NEXT_PUBLIC_ENV", ENVIRONMENT);

console.log("process.env.NEXT_PUBLIC_CONFIG", process.env.NEXT_PUBLIC_CONFIG);

const version = "0.2";

const hostName = typeof window === "undefined" ? DOMAIN : window.location.hostname.replace("subdomain.", "");

let config;

if (ENVIRONMENT?.includes("production")) {
  config = configJson.production;
  console.log("prod", version);
} else {
  config = configJson.development;
  console.log("dev", version);
}

let analyticsBingo;
let firestoreBingo;
let storageBingo;
let authBingo;

let analytics;
let firestore;
let storage;
let auth;

if (isEmpty(firebase.apps)) {
  // Default connection.
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

  // Bingo connection.
  try {
    firebase.initializeApp(config.firebaseBingo, "bingo");
    firestoreBingo = firebase.app("bingo").firestore();
    storageBingo = firebase.app("bingo").storage();
    authBingo = firebase.app("bingo").auth();

    if (typeof window !== "undefined") {
      analyticsBingo = firebase.app("bingo").analytics();
    }

    firestoreBingo.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }
}

if (DOMAIN?.includes("localhost")) {
  //config.serverUrl = config.serverUrlLocal;
  //firestore.useEmulator("localhost", 8080);
  //auth.useEmulator("http://localhost:9099/");
}

const landingsStorageBucket = firebase.app().storage(`gs://${config.landingsStorageBucket}`);

export {
  auth,
  config,
  version,
  storage,
  firebase,
  hostName,
  analytics,
  firestore,
  authBingo,
  storageBingo,
  firestoreBingo,
  analyticsBingo,
  landingsStorageBucket,
};