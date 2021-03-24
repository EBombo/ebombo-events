import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import configJson from "./config.json";

const hostName = window.location.hostname.replace("subdomain.", "");

let config;

if ((hostName.includes("-dev") || hostName.includes("localhost"))) {
    config = configJson.development;
    console.log("dev", config);
} else {
    config = configJson.production;
    config.serverUrl = hostName;
    console.log("prod", config);
}

firebase.initializeApp(config.firebase);

const analytics = firebase.analytics();
const firestore = firebase.firestore();
const storage = firebase.storage();
const auth = firebase.auth();

if (hostName === "localhost") {
    //config.serverUrl = config.serverUrlLocal;
    //firestore.useEmulator("localhost", 8080);
    //auth.useEmulator("http://localhost:9099/");
}

export {
    firebase,
    firestore,
    storage,
    auth,
    config,
    analytics
};
