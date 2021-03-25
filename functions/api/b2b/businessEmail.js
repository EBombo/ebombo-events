const {config} = require("../../config");
const {sendEmail} = require("../../email/sendEmail");
const fs = require("file-system");
const path = require("path");

const templateBusinessEmail = fs
    .readFileSync(path.join(__dirname, "../../email/templates/business.html"))
    .toString();

const businessEmail = async (req, res, next) => {
    try {
        const message = req.body.message;
        const phoneNumber = req.body.phoneNumber;
        const email = req.body.email;

        await sendEmail_(config.mails, message, phoneNumber, email);

        return res.send(200);
    } catch (error) {
        console.error("Post message chat", error);
        next(error);
    }
};

const sendEmail_ = async (emails, message, companyPhone, companyEmail) =>
    await sendEmail(emails, `CONTACTO DE EMPRESA`, templateBusinessEmail, {
        message,
        companyEmail,
        companyPhone,
    });

module.exports = {businessEmail};
