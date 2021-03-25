import TagManager from "react-gtm-module";
import { config } from "../firebase";

const gtmId = config.googleTagManager.gtmId;

export const initializeGoogleTM = () => {
  const tagManagerArgs = {
    gtmId: gtmId,
    dataLayer: {
      event: "pageview",
      page: {
        url: window.location.href,
        title: "pageview",
      },
    },
  };
  console.log("Google Tag manager config", tagManagerArgs);
  TagManager.initialize(tagManagerArgs);
};

export const googleTagManagerRegisterArgs = () =>
  TagManager.dataLayer({
    dataLayer: {
      event: "Sign Up",
      projectType: "Twitter-Ads",
      page: "register",
    },
  });

export const googleTagManagerRegisterFBArgs = () =>
  TagManager.dataLayer({
    dataLayer: {
      event: "Sign Up Twitter",
      projectType: "Twitter-Ads",
      page: "register-facebook",
    },
  });

export const googleTagManagerChargeArgs = (amount) =>
  TagManager.dataLayer({
    dataLayer: {
      event: "Charge",
      projectType: "Twitter-Ads",
      page: "charge",
      amount: amount,
    },
  });

export const googleTagManagerConversionArgs = () =>
  TagManager.dataLayer({
    dataLayer: {
      event: "conversion",
      send_to: "AW-642953154/ceg9CPT_1ecBEMLfyrIC",
    },
  });
