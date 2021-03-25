import defaultTo from "lodash/defaultTo";

export const validateNegativeNumbers = (rule, value, callback, message) =>
  +value < 1 || !Number.isInteger(+value)
    ? callback(defaultTo(message, "El valor no puede ser negativo"))
    : callback();
