import {auth} from "../config";
import {mapError, mapSuccess} from "./utils";

export const doSendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);

    return mapSuccess();
  } catch (error) {
    console.error("sendPasswordResetEmail", error);
    return mapError(error, "password");
  }
};
