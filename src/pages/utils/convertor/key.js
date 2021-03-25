import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
// import {clientDateTimeFormat} from "./date";

export const key = (object, field) => {
  const valueSearch = get(object, `${field}`, false);
  return `${field}-${defaultTo(valueSearch, "")}`;
};

// export const keyDate = (object, field) => {
//     const valueSearch = get(object, `${field}`, null);
//     const transformDate = clientDateTimeFormat(valueSearch);
//     return `${field}-${defaultTo(transformDate, "")}`;
// };
