import get from "lodash/get";

export const calculateAward = (entryCost, globalSettings, realMoney = true) => {
  let totalAward = entryCost * 2;
  let commission = +get(globalSettings, "commission", 0) / 100;
  if (!realMoney) commission = 0;
  totalAward = totalAward * (1 - commission);
  return +totalAward.toFixed(2);
};
