import trim from "lodash/trim";
import defaultTo from "lodash/defaultTo";

export const validateEmptyField = (rule, field, callback, message) =>
  field.length
    ? trim(field)
      ? callback()
      : callback(defaultTo(message, "El campo es obligatorio"))
    : callback();
