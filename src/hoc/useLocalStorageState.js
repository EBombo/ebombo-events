import {createLocalStorageStateHook} from "use-local-storage-state";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import firebase from "firebase";

export const useEbomboRules = createLocalStorageStateHook("ebomboRules", null);

export const useUser = createLocalStorageStateHook("user", null);

export const useGames = createLocalStorageStateHook("games", []);

export const useConsoles = createLocalStorageStateHook("consoles", []);

export const useRules = createLocalStorageStateHook("rules", []);

export const useUserAccounts = createLocalStorageStateHook("userAccounts", []);

export const useSettings = createLocalStorageStateHook("settings", {});

export const useSocialNetworks = createLocalStorageStateHook(
  "socialNetworks",
  []
);

export const useMatchInstructions = createLocalStorageStateHook(
  "matchInstructions",
  []
);

export const useCharacteristics = createLocalStorageStateHook(
  "characteristics",
  []
);

export const useHowItWorks = createLocalStorageStateHook("howItWorks", []);

export const useLocation = createLocalStorageStateHook("location", {});

export const useEnvironment = createLocalStorageStateHook("environment", "");

export const useChats = createLocalStorageStateHook("chats", []);

export const useLanding = createLocalStorageStateHook("landing", []);

export const useCoupons = createLocalStorageStateHook("coupons", []);

export const timeToString = (collection) =>
  isArray(collection)
    ? map(defaultTo(collection, []), (value) => toString(value))
    : toString(collection);

const toString = (collection) =>
  mapValues(defaultTo(collection, {}), (value) =>
    get(value, "seconds") ? value.toDate().toJSON() : value
  );

export const collectionToDate = (collection) =>
  isArray(collection)
    ? map(defaultTo(collection, []), (value) =>
        isArray(value)
          ? collectionToDate(value)
          : isObject(value)
          ? objectToDate(value)
          : value
      )
    : objectToDate(collection);

const objectToDate = (collection) =>
  mapValues(defaultTo(collection, {}), (value) =>
    isArray(value)
      ? collectionToDate(value)
      : get(value, "seconds")
      ? toDate(value)
      : value
  );

const toDate = (value) =>
  new firebase.firestore.Timestamp(value.seconds, value.nanoseconds);
