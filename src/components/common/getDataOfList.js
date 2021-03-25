import {accountStates, verifiedState, withdrawStates} from "./DataList";

export const userAccountState = (user) => {
  if (user.verifiedDocument) return accountStates["valid"];

  if (user.isRequestNewDocument || user.documentImageUrl)
    return accountStates["inProcess"];

  return accountStates["notValid"];
};

export const userVerifiedState = (user) => {
  if (user.isVerified) return verifiedState["noVerified"];
  return verifiedState["verified"];
};

export const withdrawState = (withdraw) => {
  if (withdraw.isRejected) return withdrawStates["rejected"];
  if (!withdraw.isDeposited && !withdraw.operationId)
    return withdrawStates["pending"];
  if (!withdraw.isDeposited && withdraw.operationId)
    return withdrawStates["rapydPending"];

  return withdrawStates["done"];
};
