const moment = require("moment");
const {get} = require("lodash");

const calculateFinishTime = (rule) =>
    moment(new Date())
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

module.exports = {calculateFinishTime};
