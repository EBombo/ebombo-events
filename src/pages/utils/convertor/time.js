import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import moment from "moment";

export const timeToTimeMarker = (time, timeUnit = "seconds") => {
  const timeInSeconds = get(timeToSeconds, timeUnit, 0);

  const totalSeconds = timeInSeconds(time);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor((totalSeconds % 3600) % 60);

  return formatTime(hours, minutes, seconds);
};

export const dateToTimeMarker = (date) => {
  const time = timeDuration(date);

  const days = time.days();
  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  return days > 0
    ? `${days}d ${formatTime(hours, minutes, seconds)}`
    : formatTime(hours, minutes, seconds);
};

export const dateToTimeMarkerSimple = (date) => {
  const time = timeDuration(date);

  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  return formatTimeSimple(hours, minutes, seconds);
};

const timeDuration = (date) => {
  const dateInitial = moment(defaultDate(date.initial));
  const dateFinal = moment(defaultDate(date.final));

  const dateDifference = moment(dateInitial).diff(dateFinal);

  return moment.duration(dateDifference);
};

const defaultDate = (date) => defaultTo(date, new Date());

const timeToSeconds = {
  milliseconds: (time) => time / 1000,
  seconds: (time) => time,
  minutes: (time) => time * 600,
};

const formatTime = (hours, minutes, seconds) => {
  const _hours = addZero(hours);
  const _minutes = addZero(minutes);
  const _seconds = addZero(seconds);

  return _hours + ":" + _minutes + ":" + _seconds;
};

const formatTimeSimple = (hours, minutes, seconds) => {
  const _hours = addZero(hours);
  const _minutes = addZero(minutes);
  const _seconds = addZero(seconds);

  let formatTime = "";

  if (_hours > 0) formatTime = formatTime + _hours + ":";
  if (_minutes > 0) formatTime = formatTime + _minutes + ":";

  formatTime = formatTime + _seconds;

  return formatTime;
};
const addZero = (number) => (number < 10 ? "0" : "") + defaultTo(number, "00");
