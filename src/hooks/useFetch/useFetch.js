import {auth} from "../../firebase";
import defaultTo from "lodash/defaultTo";

export const useFetch = () => {
    const Fetch = async (url, method = "GET", body = null, token = null) => {
        const headers = await getHeader(method, token);

        let config = {method};

        if (headers) config.headers = headers;
        if (body) config.body = JSON.stringify(body);

        const response = await fetch(url, {
            ...config
        });

        if (!response.ok) throw Error(response.statusText);

        return (response.json || response.bodyUsed)
            ? await response.json()
            : response;
    };

    const getHeader = async (method, token) => {
        if (method.toLowerCase().includes("get")) return;

        let headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };

        const authUser = auth.currentUser;
        let newToken = token;

        if (authUser) newToken = await auth.currentUser.getIdToken();

        if (token || authUser) headers.Authorization = `Bearer ${defaultTo(token, newToken)}`;

        return headers;
    };

    return {
        Fetch: (url, body, method, token) => Fetch(url, body, method, token),
    };
};
