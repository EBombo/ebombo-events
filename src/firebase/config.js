import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import isEmpty from "lodash/isEmpty";

console.log("process.env.NODE_ENV", process.env.NODE_ENV);

const PORT = process.env.NEXT_PUBLIC_PORT ?? 5000;
console.log("process.env.NEXT_PUBLIC_PORT", PORT);

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? "localhost:3001";
console.log("process.env.NEXT_PUBLIC_DOMAIN", DOMAIN);

const CONFIG = process.env.NEXT_PUBLIC_CONFIG ?? "";
//console.log("process.env.NEXT_PUBLIC_CONFIG", CONFIG);

const version = "0.2";

const config = JSON.parse(CONFIG);

const hostName = typeof window === "undefined" ? DOMAIN : window.location.hostname;

if (DOMAIN?.includes("local") || DOMAIN?.includes("red") || DOMAIN?.includes("dev")) {
  console.log("dev", version);
} else {
  console.log("prod", version);
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
  // config.serverUrl = config.serverUrlLocal;
  //firestore.useEmulator("localhost", 8080);
  //auth.useEmulator("http://localhost:9099/");
}

const landingsStorageBucket = firebase.app().storage(`gs://${config.landingsStorageBucket}`);
const companiesStorageBucket = firebase.app().storage(`gs://${config.companiesStorageBucket}`);
const usersStorageBucket = firebase.app().storage(`gs://${config.usersStorageBucket}`);

const functions = firebase.functions();

export {
  auth,
  config,
  version,
  storage,
  firebase,
  hostName,
  analytics,
  firestore,
  functions,
  authBingo,
  storageBingo,
  firestoreBingo,
  analyticsBingo,
  landingsStorageBucket,
  usersStorageBucket,
  companiesStorageBucket,
};
