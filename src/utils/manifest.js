import { config } from "../firebase";

export const initializeManifest = () => {
  const hostname = window.location.hostname;
  document
    .querySelector("#manifest-placeholder")
    .setAttribute("href", `${config.serverUrl}/manifest/${hostname}`);
};
