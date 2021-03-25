const {firestore, config} = require("../../../config");
const {get} = require("lodash");

const verifyDocument = async (req, res, next) => {
    console.log("verifyDocument ", req.params);

    try {
        await firestore.doc("users/" + get(req, "params.userId", "")).update({
            verifiedDocument: true,
        });

        return res.redirect(config.applicationRootUrl);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

module.exports = {verifyDocument};
