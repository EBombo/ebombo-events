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

let hostNameBomboGames;

if (DOMAIN?.includes("local") || DOMAIN?.includes("red") || DOMAIN?.includes("dev") || DOMAIN?.includes("shell")) {
  console.log("dev", version);
  hostNameBomboGames = "red.ebombo.io";
} else {
  console.log("prod", version);
  hostNameBomboGames = "ebombo.io";
}

let analyticsGames;
let firestoreGames;
let storageGames;
let authGames;

let analyticsBingo;
let firestoreBingo;
let storageBingo;
let authBingo;

let firestoreRoulette;
let storageRoulette;
let authRoulette;
let analyticsRoulette;

let firestoreTrivia;
let storageTrivia;
let authTrivia;
let analyticsTrivia;

let firestoreHanged;
let storageHanged;
let authHanged;
let analyticsHanged;

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

  // Roulette connection.
  try {
    firebase.initializeApp(config.firebaseRoulette, "roulette");
    firestoreRoulette = firebase.app("roulette").firestore();
    storageRoulette = firebase.app("roulette").storage();
    authRoulette = firebase.app("roulette").auth();

    if (typeof window !== "undefined") {
      analyticsRoulette = firebase.app("roulette").analytics();
    }

    firestoreRoulette.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }

  // Trivia connection.
  try {
    firebase.initializeApp(config.firebaseTrivia, "trivia");
    firestoreTrivia = firebase.app("trivia").firestore();
    storageTrivia = firebase.app("trivia").storage();
    authTrivia = firebase.app("trivia").auth();

    if (typeof window !== "undefined") {
      analyticsTrivia = firebase.app("trivia").analytics();
    }

    firestoreTrivia.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }

  // Hanged connection.
  try {
    firebase.initializeApp(config.firebaseHanged, "hanged");
    firestoreHanged = firebase.app("hanged").firestore();
    storageHanged = firebase.app("hanged").storage();
    authHanged = firebase.app("hanged").auth();

    if (typeof window !== "undefined") {
      analyticsHanged = firebase.app("hanged").analytics();
    }

    firestoreHanged.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }

  // Bombo games connection.
  try {
    firebase.initializeApp(config.firebaseGames, "games");
    firestoreGames = firebase.app("games").firestore();
    storageGames = firebase.app("games").storage();
    authGames = firebase.app("games").auth();

    if (typeof window !== "undefined") {
      analyticsGames = firebase.app("games").analytics();
    }

    firestoreHanged.settings({ ignoreUndefinedProperties: true });
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
  hostNameBomboGames,
  analytics,
  firestore,
  functions,
  authBingo,
  storageBingo,
  firestoreBingo,
  analyticsBingo,
  firestoreRoulette,
  storageRoulette,
  authRoulette,
  analyticsRoulette,
  landingsStorageBucket,
  usersStorageBucket,
  companiesStorageBucket,
  firestoreTrivia,
  storageTrivia,
  authTrivia,
  analyticsTrivia,
  firestoreHanged,
  storageHanged,
  authHanged,
  analyticsHanged,
  analyticsGames,
  firestoreGames,
  storageGames,
  authGames,
};
