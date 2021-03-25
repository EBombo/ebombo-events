import { auth } from "../../firebase";
import defaultTo from "lodash/defaultTo";

export const useOwnFetch = () => {
  const ownFetch = async (url, method = "GET", body = null, token = null) => {
    const headers = await getHeader(method, token);

    let config = { method };

    if (headers) config.headers = headers;
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(url, {
      ...config,
    });

    if (!response.ok) throw Error(response.statusText);

    return await response
      .clone()
      .json()
      .catch(() => response.text());
  };

  const getHeader = async (method, token) => {
    if (method === "get") return;

    let headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const authUser = auth.currentUser;
    let newToken;

    if (authUser) newToken = await auth.currentUser.getIdToken();

    if (token || authUser)
      headers.Authorization = `Bearer ${defaultTo(token, newToken)}`;

    return headers;
  };

  return {
    ownFetch: (url, method, body, token = null) =>
      ownFetch(url, method, body, token),
  };
};
