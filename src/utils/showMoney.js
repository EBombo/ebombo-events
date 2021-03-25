import get from "lodash/get";
import moment from "moment";

export const showMoney = (user) => {
  let money = +get(user, "money", 0);
  let expiringMoney = get(user, "expiringMoney", [{ money: 0 }]);

  expiringMoney.forEach((amount) => {
    if (moment(get(amount, "expireDate", moment()).toDate()).isAfter(moment()))
      return (money += +amount.money);
  });

  return +money;
};

export const showExpiringMoney = (user) => {
  let totalExpiringMoney = 0;
  let expiringMoney = get(user, "expiringMoney", [{ money: 0 }]);

  expiringMoney.forEach((amount) => {
    if (moment(get(amount, "expireDate", moment()).toDate()).isAfter(moment()))
      return (totalExpiringMoney += +amount.money);
  });
  return +totalExpiringMoney.toFixed(2);
};
