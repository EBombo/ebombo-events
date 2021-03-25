import moment from "moment";
import get from "lodash/get";

export const formatToDate = (value, path) => {
  if (get(value, `${path}._seconds`, false))
    return moment.unix(get(value, `${path}._seconds`, null)).toDate();
  return moment.unix(get(value, `${path}.seconds`, null)).toDate();
};
