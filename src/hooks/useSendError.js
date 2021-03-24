import {useGlobal} from "reactn";
import get from "lodash/get";
import {config} from "../firebase";

export const useSendError = () => {
  const [authUser] = useGlobal("user");

  const sendError = async (error) => {
    try {
      error.url = window.location.href;
      error.userId = get(authUser, "id", null);
      const response = await fetch(`${config.serverUrl}/error-boundary`, {
        method: "POST",
        body: JSON.stringify(
            error,
            Object.getOwnPropertyNames(error).concat("url").concat("userId")
        ),
        headers: {
          "content-Type": "application/json",
        },
      });

      if (!response.ok) throw Error(response.statusText);

      console.log("Enviado correctamente");
    } catch (error) {
      console.error("error enviando el error", error);
    }
  };

  return {sendError: (error) => sendError(error)};
};
