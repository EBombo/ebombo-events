import {auth, firebase} from "../config";
import {isMobileDevice} from "../../utils";

const currentProvider = (provider) => {
    const providerInstance = signInProviders[provider].instance;

    signInProviders[provider].scopes.forEach(scope => providerInstance.addScope(scope));

    return providerInstance;
};

const signInProviders = {
    "google": {
        "instance": new firebase.auth.GoogleAuthProvider(),
        "scopes": ["email", "profile"]
    },
    "facebook": {
        "instance": new firebase.auth.FacebookAuthProvider(),
        "scopes": ["email"]
    },
    "twitter": {
        "instance": new firebase.auth.TwitterAuthProvider(),
        "scopes": []
    },
    "github": {
        "instance": new firebase.auth.GithubAuthProvider(),
        "scopes": []
    },
};

export const doSignInWithProvider = async provider => {
    const currentProvider_ = currentProvider(provider);

    if (isMobileDevice) return await auth.signInWithRedirect(currentProvider_);

    return await auth.signInWithPopup(currentProvider_);
};

export const doSignOut = () => auth.signOut()
