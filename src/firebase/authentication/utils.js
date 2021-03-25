import {auth} from "../config";
import get from "lodash/get";

export const authUserValidated = (authUser) =>
  !!(
    providerData(authUser, "displayName") &&
    (providerData(authUser, "email") || providerData(authUser, "phoneNumber"))
  );

export const providerData = (authUser, field) =>
  get(authUser, ["providerData", "0", field], "");

export const deleteAuthUser = async () =>
  (await auth.currentUser) && auth.currentUser.delete();

export const mapSuccess = (result = {}) => ({
  success: true,
  result: result,
  providerId: providerData(result.user, "providerId"),
});

export const mapError = (error, providerId) => ({
  success: false,
  error: error,
  providerId: providerId,
});
