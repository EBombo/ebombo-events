const {firestore, config} = require("../../../config");
const fs = require("file-system");
const path = require("path");
const {sendEmail} = require("../../../email/sendEmail");
const {fetchUser} = require("../../../collections/users");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/requestNewDocument.html")
    )
    .toString();

exports.requestNewDocument = async (req, res, next) => {
    console.log("Request new document ", req.params);

    try {
        const {userId} = req.params;

        const user = await fetchUser(userId);

        await updateUser(user);

        await sendEmail_(user);

        return res.status(200).send("success");
    } catch (error) {
        console.error(error);
    }
};

const sendEmail_ = async (user) => {
    await sendEmail(
        user.email,
        "Subir foto de tú documento de identidad",
        template,
        {
            userName: user.name,
            applicationRootUrl: config.applicationRootUrl,
        }
    );
};

const updateUser = async (user) => {
    await firestore.collection("users").doc(user.id).update({
        documentImageUrl: null,
        documentImageUrlThumb: null,
        verifiedDocument: false,
        isRequestNewDocument: true,
    });
};
