import sortBy from "lodash/sortBy";
import isEmpty from "lodash/isEmpty";

export default (array) => {
  let returnArray = [];

  if (!isEmpty(array)) {
    returnArray = sortBy(array, (arr) => arr.name.toLowerCase());
  }

  return returnArray;
};
