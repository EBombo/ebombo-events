const {defaultTo} = require("lodash");
const {firestore} = require("../../config");
const logger = require("../../utils/logger");

const postError = async (req, res, next) => {
    try {
        logger.log("error from boundary", req.body);

        const {stack, message, severity, url, userId, action} = req.body;

        await saveError(stack, message, severity, userId, url, action);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const saveError = async (stack, message, severity, userId, url, action = null) => {
    const errorId = firestore.collection("errors").doc().id;

    await firestore
        .collection("errors")
        .doc(errorId)
        .set({
            userId,
            url,
            action,
            stack: defaultTo(stack, null),
            message: defaultTo(message, null),
            severity: defaultTo(severity, null),
            createAt: new Date(),
            updateAt: new Date(),
            delete: false,
            id: errorId,
        });
};

module.exports = {postError};
