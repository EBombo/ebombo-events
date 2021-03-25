import {firebase} from "../config";

const currentProvider = (provider) => {
  const providerInstance = signInProviders[provider].instance;

  // signInProviders[provider].scopes.forEach(scope => providerInstance.addScope(scope));

  return providerInstance;
};

const signInProviders = {
  google: {
    instance: new firebase.auth.GoogleAuthProvider(),
    scopes: ["email", "profile"],
  },
  facebook: {
    instance: new firebase.auth.FacebookAuthProvider(),
    scopes: ["email"],
  },
  twitter: {
    instance: new firebase.auth.TwitterAuthProvider(),
    scopes: [],
  },
  github: {
    instance: new firebase.auth.GithubAuthProvider(),
    scopes: [],
  },
};

export { currentProvider };
