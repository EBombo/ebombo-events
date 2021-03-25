export const validateText = (value) => {
  return /^[A-Za-z]+$/.test(value.replace(/\s/g, ""));
};

export const validateNumber = (value) => {
  return /^[0-9]*$/.test(value);
};
