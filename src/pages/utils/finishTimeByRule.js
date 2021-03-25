import moment from "moment";
import get from "lodash/get";

export const finishTimeByRule = (rule, startDate = new Date()) =>
  moment(startDate)
    .add(
      moment(get(rule, "duration", "0:30:0"), "HH:mm:ss").get("hours"),
      "hours"
    )
    .add(
      moment(get(rule, "duration", "0:30:0"), "HH:mm:ss").get("minutes"),
      "minutes"
    )
    .add(
      moment(get(rule, "duration", "0:30:0"), "HH:mm:ss").get("seconds"),
      "seconds"
    )
    .toDate();
