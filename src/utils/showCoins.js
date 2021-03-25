import get from "lodash/get";

export const showCoins = (user) => {
  let coins = +get(user, "coins", 0);
  let expiringCoins = get(user, "expiringCoins", [{ coins: 0 }]);

  expiringCoins.forEach((amount) => (coins += +amount.coins));
  return +coins;
};

export const showSolesRemovable = (user) => +get(user, "soles", 0);

export const showSolesAvailable = (user) => +get(user, "coins", 0);

export const showAllSoles = (user) => {
  let coins = +get(user, "coins", 0);
  coins += +get(user, "soles", 0);
  let expiringCoins = get(user, "expiringCoins", [{ coins: 0 }]);

  expiringCoins.forEach((amount) => (coins += +amount.coins));
  return +coins;
};
