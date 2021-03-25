import {auth, firebase} from "../config";
import {mapError, mapSuccess} from "./utils";

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const result = await auth.signInWithEmailAndPassword(email, password);

    return mapSuccess(result);
  } catch (error) {
    console.error("signInWithEmailAndPassword", error);
    return mapError(error, "password");
  }
};
