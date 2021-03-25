const {firestore, config} = require("../../../config");
const fs = require("file-system");
const {get} = require("lodash");
const {sendEmail} = require("../../../email/sendEmail");
const path = require("path");
const {updateUser, fetchUser} = require("../../../collections/users");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/verifyDocument.html")
    )
    .toString();

exports.uploadDocument = async (req, res, next) => {
    try {
        console.log("update document user->", req.params.userId, req.body);

        const uid = req.params.userId;
        const file = req.body;

        const user = await fetchUser(uid);

        await updateUser(uid, {
            documentImageUrl: file.documentImageUrl,
            documentImageUrlThumb: file.documentImageUrlThumb,
            isRequestNewDocument: false,
            verifiedDocument: false,
        });

        await sendDocumentEmail(user, file);

        return res.status(200).send("success");
    } catch (error) {
        console.error("upload document ", error);
    }
};

const sendDocumentEmail = async (user, file) =>
    await sendEmail(
        config.mails.replace("santiago@bombo.pe,", ""),
        "Validar cuenta",
        template,
        {
            userFullName: `${user.name} ${user.lastName}`,
            userEmail: get(user, "email", ""),
            userNickname: get(user, "nickname", ""),
            documentImageUrl: file.documentImageUrl,
            verifyDocumentUrl: `${config.serverUrl}/users/${user.id}/verify-document`,
            requestNewDocumentUrl: `${config.serverUrl}/users/${user.id}/request-new-document`,
        }
    );
