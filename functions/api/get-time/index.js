const momentTz = require("moment-timezone");

exports.getTime = async (req, res, next) => {
    console.log(
        "get time PERU-> ",
        momentTz().tz("America/Lima").format("YYYY-MM-DD HH:mm:ss")
    );

    try {
        const currentTime = momentTz().tz("America/Lima");

        res.status(200).send(currentTime);
    } catch (error) {
        next(error);
    }
};
