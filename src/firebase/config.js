import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import configJson from "./config.json";

const hostName = window.location.hostname;

let config;

if (true) {
    config = configJson.productionConfig;
    console.log("prod");
} else {
    config = configJson.devConfig;
    console.log("dev");

    if (["localhost"].includes(hostName)) {
        config.serverUrl = config.serverUrlLocal;
        config.serverUrlMatches = config.serverUrlMatchesLocal;
        config.serverUrlAdmin = config.serverUrlAdminLocal;
    }
}

firebase.initializeApp(config.firebase);

const analytics = firebase.analytics();
const firestore = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

if (hostName === "localhost") {
    //firestore.useEmulator("localhost", 8080);
    //auth.useEmulator("http://localhost:9099/");
}

const documentsStorageBucket = firebase
    .app()
    .storage(`gs://${config.documentsStorageBucket}`);
const claimsStorageBucket = firebase
    .app()
    .storage(`gs://${config.claimsStorageBucket}`);
const advertisementsStorageBucket = firebase
    .app()
    .storage(`gs://${config.advertisementsStorageBucket}`);
const gamesStorageBucket = firebase
    .app()
    .storage(`gs://${config.gamesStorageBucket}`);
const usersStorageBucket = firebase
    .app()
    .storage(`gs://${config.usersStorageBucket}`);
const landingStorageBucket = firebase
    .app()
    .storage(`gs://${config.landingStorageBucket}`);
const landingsStorageBucket = firebase
    .app()
    .storage(`gs://${config.landingsStorageBucket}`);
const tournamentsStorageBucket = firebase
    .app()
    .storage(`gs://${config.tournamentsStorageBucket}`);
const tournamentTeamsStorageBucket = firebase
    .app()
    .storage(`gs://${config.tournamentTeamsStorageBucket}`);
const settingsStorageBucket = firebase
    .app()
    .storage(`gs://${config.settingsStorageBucket}`);

export {
    claimsStorageBucket,
    documentsStorageBucket,
    advertisementsStorageBucket,
    gamesStorageBucket,
    usersStorageBucket,
    landingStorageBucket,
    landingsStorageBucket,
    tournamentsStorageBucket,
    tournamentTeamsStorageBucket,
    settingsStorageBucket,
    storage,
    firestore,
    auth,
    config,
    firebase,
    analytics,
};
