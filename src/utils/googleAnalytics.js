import * as ReactGA from "react-ga";
import { config } from "../firebase";

export const initializeReactGA = (pathname) => {
  ReactGA.initialize(config.analytics);
  ReactGA.pageview(pathname);
};

export const gaEvent = (category, action, label, value = 0) =>
  ReactGA.event({
    category: category,
    action: action,
    label: label,
    value: +value,
  });

export const gaError = (category, action) => gaEvent(category, action, null, null);
