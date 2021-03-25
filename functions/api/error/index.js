const {defaultTo, get} = require("lodash");
const {firestore} = require("../../config");
const {fetchUser} = require("../../collections/users");
const logger = require("../../utils/logger");

const postError = async (req, res, next) => {
    try {
        logger.log("error from boundary", req.body, req.params);

        const {stack, message, severity, url, userId} = req.body;

        const action = get(req, "body.action", null);

        const user = userId ? await fetchUser(userId) : null;

        await saveError(stack, message, severity, user, url, action);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const saveError = async (stack, message, severity, user, url, action) => {
    const errorId = firestore.collection("errors").doc().id;

    logger.log("error to save->", stack, message, severity, user, url);

    await firestore
        .collection("errors")
        .doc(errorId)
        .set({
            id: errorId,
            user,
            url,
            action,
            stack: defaultTo(stack, null),
            message: defaultTo(message, null),
            severity: defaultTo(severity, null),
            createAt: new Date(),
            updateAt: new Date(),
            delete: false,
        });
};

module.exports = {postError};
