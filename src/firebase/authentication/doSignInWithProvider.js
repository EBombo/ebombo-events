import {auth, firebase} from "../config";
import {isMobileDevice} from "../../utils/deviceType";
import {currentProvider} from "../authentication/config";
import {deleteAuthUser, mapError, mapSuccess} from "./utils";
import {createUser} from "./createUser";
import ReactPixel from "react-facebook-pixel";

export const doSignInWithProvider = async (provider, currentInfluencer) => {
  try {
    await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

    const currentProvider_ = currentProvider(provider);

    if (isMobileDevice) return await auth.signInWithRedirect(currentProvider_);

    const result = await auth.signInWithPopup(currentProvider_);

    const authUser = result.user;

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

    console.error("signInWith " + provider, error);
    return mapError(error, provider);
  }
};
