import * as ReactGA from "react-ga";
import { config } from "../firebase";
import defaultTo from "lodash/defaultTo";

export const initializeReactGA = () => {
  ReactGA.initialize(config.analytics);
  ReactGA.pageview(window.location.pathname);
};

export const gaEvent = (category, action, label, value) =>
  ReactGA.event({
    category: category,
    action: action,
    label: label,
    value: +defaultTo(value, null),
  });

export const gaError = (category, action) =>
  gaEvent(category, action, null, null);

export const gaRegister = (label) =>
  gaEvent("Purchase", "0 User Registered", label, null);

export const gaRegisterFacebook = (label) =>
  gaEvent("Purchase", "0 Facebook User registered", label, null);

export const gaRegisterEmail = (label) =>
  gaEvent("Purchase", "0 Email User registered", label, null);

export const gaGameWeekUserTeam = (action, label) =>
  gaEvent("Purchase", action, label);

export const gaGameWeek = (category, action, label) =>
  gaEvent(category, action, label, null);

export const gaWithdraw = (amount) =>
  gaEvent("Money", "Withdraw", null, amount);

export const gaCharge = (amount) => gaEvent("Money", "Charge", null, amount);

export const gaChange = (amount) => gaEvent("Money", "Change", null, amount);

export const gaLeague = (label) =>
  gaEvent("Purchase", "1 League clicked", label, null);

export const gaTournament = (label) =>
  gaEvent("Purchase", "2 Tournament clicked", label, null);

export const gaCoupon = (label, amount) =>
  gaEvent("Money", "Use Coupon", label, amount);

export const gaAdminCoin = (action, amount) =>
  gaEvent("Money", action, null, amount);

export const gaAdminCoupon = (amount) =>
  gaEvent("Money", "Admin Give Coupon", null, amount);
