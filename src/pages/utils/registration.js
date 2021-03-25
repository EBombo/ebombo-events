import { config } from "../firebase";
import { message } from "antd";
import { gaError } from "./googleAnalytics";

export const registration = async (data) => {
  let status = false;

  try {
    const url = `${config.serverUrl}/registrations/`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      message.success("Registro completado.");

      status = true;
    } else {
      gaError("Error", "POST /registrations");

      message.error("Fallo en el registro.");
      throw Error(response.statusText);
    }
  } catch (error) {
    console.error(error);
  }
  return status;
};
