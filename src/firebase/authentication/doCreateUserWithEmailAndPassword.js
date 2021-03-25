import {auth} from "../config";
import {deleteAuthUser, mapError, mapSuccess} from "./utils";
import {createUser} from "./createUser";

export const doCreateUserWithEmailAndPassword = async (
  email,
  password,
  name,
  currentInfluencer,
  phoneNumber
) => {
  try {
    const result = await auth.createUserWithEmailAndPassword(email, password);

    const authUser = mapAuthUser(result.user, name);

    await createUser(authUser, currentInfluencer, phoneNumber);

    return mapSuccess(result);
  } catch (error) {
    await deleteAuthUser();

    console.error("createUserWithEmailAndPassword", error);
    return mapError(error, "password");
  }
};

const mapAuthUser = (authUser, name) => ({
  ...authUser,
  providerData: [
    {
      ...authUser.providerData[0],
      displayName: name,
    },
  ],
});
