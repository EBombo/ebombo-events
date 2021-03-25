import moment from "moment";

export const dateFormats = {
  dataBase: "YYYY-MM-DD",
  userInterface: "DD/MM/YYYY",
  creditCard: "MM/YYYY",
};

export const cardDateFormat = (month, year) => {
  if (month && year) {
    return moment({
      year: year,
      month: Number(month) - 1,
    }).format(dateFormats.creditCard);
  }
  return false;
};

export const dataBaseDateFormat = (year, month, day) => {
  if (day && month && year) {
    return moment({
      year: year,
      month: Number(month) - 1,
      day: day,
    }).format(dateFormats.dataBase);
  }

  return false;
};

export const userInterfaceDateFormat = (date) => {
  if (moment(date).isValid()) {
    return moment(date).format(dateFormats.userInterface);
  } else {
    return moment(date.toDate).format(dateFormats.userInterface);
  }
};

export const singleDataBaseDateFormat = (date) => {
  if (date) {
    if (moment(date).isValid()) {
      return moment(date).format(dateFormats.userInterface);
    } else if (moment(date, dateFormats.userInterface).isValid()) {
      return moment(date, dateFormats.userInterface).format(
        dateFormats.userInterface
      );
    } else {
      return moment(date.toDate).format(dateFormats.userInterface);
    }
  } else {
    return null;
  }
};

export const datePickerMobile = (date) => {
  let _date;

  if (date) {
    if (moment(date).isValid()) {
      _date = moment(date)._d;
    } else {
      _date = moment(date, dateFormats.userInterface)._d;
    }
  } else {
    _date = "";
  }

  return _date;
};

export const datePickerCardMobileYearMonth = (date) => {
  if (moment(date).isValid()) {
    return moment(date)._d;
  } else {
    return moment(date, dateFormats.creditCard)._d;
  }
};
