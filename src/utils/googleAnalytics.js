import * as ReactGA from "react-ga";
import { config } from "../firebase";
import defaultTo from "lodash/defaultTo";

export const initializeReactGA = (pathname) => {
  ReactGA.initialize(config.analytics);
  ReactGA.pageview(pathname);
};

export const gaEvent = (category, action, label, value) =>
  ReactGA.event({
    category: category,
    action: action,
    label: label,
    value: +defaultTo(value, null),
  });

export const gaError = (category, action) => gaEvent(category, action, null, null);
