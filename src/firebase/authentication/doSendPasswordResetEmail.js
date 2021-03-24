import {auth} from "../config";
import get from "lodash/get";

export const doSendPasswordResetEmail = async (email) => {
    try {
        await auth.sendPasswordResetEmail(email);

        return mapSuccess();
    } catch (error) {
        console.error("sendPasswordResetEmail", error);
        return mapError(error, "password");
    }
};

const mapSuccess = (result = {}) => ({
    success: true,
    result: result,
    providerId: providerData(result.user, "providerId"),
});

export const providerData = (authUser, field) => get(authUser, ["providerData", "0", field], "");

const mapError = (error, providerId) => ({
    success: false,
    error: error,
    providerId: providerId
});
