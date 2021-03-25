import {auth} from "../config";
import {createUser} from "./createUser";
import {deleteAuthUser, mapError, mapSuccess} from "./utils";
import ReactPixel from "react-facebook-pixel";

export const doGetRedirectResult = async (currentInfluencer) => {
  try {
    const result = await auth.getRedirectResult();

    const authUser = result.user;

    if (!authUser) return mapSuccess(result);

    if (!result.additionalUserInfo.isNewUser) {
      return mapSuccess(result);
    }

    ReactPixel.track("Subscribe", {
      value: 1.0,
      currency: "PEN",
    });

    await createUser(authUser, currentInfluencer);

    return mapSuccess(result);
  } catch (error) {
    await deleteAuthUser();

    console.error("signInWith ", error);
    return mapError(error);
  }
};
