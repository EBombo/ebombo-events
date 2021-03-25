import {config} from "../config";
import get from "lodash/get";
import toString from "lodash/toString";
import defaultTo from "lodash/defaultTo";
import {providerData} from "./utils";

export const createUser = async (
  authUser,
  currentInfluencer,
  phoneNumber = null
) => {
  const url = `${config.serverUrl}/users/`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body(authUser, currentInfluencer, phoneNumber)),
  });

  if (!response.ok)
    throw {
      code: "fetch/users-post",
      message: "Failed create user",
    };
};

const body = (authUser, currentInfluencer, phoneNumber) => ({
  email: providerData(authUser, "email"),
  name: providerData(authUser, "displayName"),
  id: toString(authUser.uid),
  phoneNumber: providerData(authUser, "phoneNumber") || phoneNumber,
  photoUrl: providerData(authUser, "photoURL"),
  providerId: providerData(authUser, "providerId"),
  providerData: get(authUser, "providerData", ""),
  influencer: defaultTo(currentInfluencer, null),
});
