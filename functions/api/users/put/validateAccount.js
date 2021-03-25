const {firestore} = require("../../../config");
const {assign} = require("lodash");

exports.validateAccount = async (req, res, next) => {
    try {
        const {userId} = req.params;

        const user = req.body;
        user.id = userId;

        const _user = mapUser(user);
        console.log("Validate account", _user);

        await updateUser(_user);

        return res.status(200).send("success");
    } catch (error) {
        console.error("Validate account", error);
        next(error);
    }
};

const updateUser = async (user) => {
    await firestore.collection("users").doc(user.id).update(user);
};

const mapUser = (user) =>
    assign({}, user, {
        verifiedDocument: true,
        isRequestNewDocument: false,
    });
