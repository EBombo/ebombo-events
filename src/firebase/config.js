import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import configJson from "./config.json";

const hostName = window.location.hostname;

let config;

config = configJson.productionConfig;
console.log("prod");

firebase.initializeApp(config.firebase);

const analytics = firebase.analytics();
const firestore = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

const documentsStorageBucket = null;// firebas.app().storage(`gs://${config.documentsStorageBucket}`);
const claimsStorageBucket = null;// firebase.app().storage(`gs://${config.claimsStorageBucket}`);
const advertisementsStorageBucket = null;// firebase.app().storage(`gs://${config.advertisementsStorageBucket}`);
const gamesStorageBucket = null;// firebase.app().storage(`gs://${config.gamesStorageBucket}`);
const usersStorageBucket = null;// firebase.app().storage(`gs://${config.usersStorageBucket}`);
const landingStorageBucket = null;// firebase.app().storage(`gs://${config.landingStorageBucket}`);
const landingsStorageBucket = firebase.app().storage(`gs://${config.landingsStorageBucket}`);
const tournamentsStorageBucket = null;// firebase.app().storage(`gs://${config.tournamentsStorageBucket}`);
const tournamentTeamsStorageBucket = null;// firebase.app().storage(`gs://${config.tournamentTeamsStorageBucket}`);
const settingsStorageBucket = null;// firebase.app().storage(`gs://${config.settingsStorageBucket}`);

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
