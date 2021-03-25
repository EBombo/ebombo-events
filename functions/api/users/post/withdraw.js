const {firestore, config} = require("../../../config");
const {transaction} = require("../../../transactions");
const {fetchUser, updateUser} = require("../../../collections/users");
const {defaultTo} = require("lodash");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const logger = require("../../../utils/logger");

const templateAdmin = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/withdrawAdmin.html")
    )
    .toString();

const currency = config.currency;

const withdraw = async (req, res, next) => {
    logger.log("withdraw ", req.params, req.body);

    try {
        const amount = +req.params.amount;
        const userId = req.params.userId;
        const accountType = req.body.accountType;
        const documentType = req.body.documentType;
        const accountNumber = req.body.accountNumber;
        const holderName = req.body.holderName;
        const document = req.body.document;

        const user = await fetchUser(userId);

        if (!checkWithdraw(user, amount)) {
            logger.log("termino aqui");
            return res.status(400).send(`${currency} insuficiente`);
        }

        const transactionMessage = `Retiro de ${amount} ${currency} por el usuario ${user.id},
            con el número de cuenta ${accountType}:${accountNumber} Nombre de propietario: ${holderName}
            tipo de documento:${documentType} número de documento:${document}`;

        await transaction("withdraw", user, +amount, transactionMessage, null, {
            accountType: accountType,
            documentType: documentType,
            document: document,
            accountNumber: accountNumber,
        });

        const userMoney = +defaultTo(user.money, 0) - amount;

        await updateUser(userId, {money: userMoney.toFixed(2)});

        await sendEmail_(
            config.mails.replace("santiago@bombo.pe,", "hello@bombo.pe,"),
            user,
            accountType,
            amount,
            accountNumber,
            documentType,
            document,
            templateAdmin
        );

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const checkWithdraw = (user, amount) => defaultTo(user.money, 0) >= amount;

const sendEmail_ = async (
    email,
    user,
    accountType,
    amount,
    accountNumber,
    documentType,
    document,
    template
) =>
    await sendEmail(email, `Retiro de ${currency}`, template, {
        name: user.name,
        isCCI: accountType === "CCI",
        amount: amount,
        accountNumber: accountNumber,
        documentType: documentType,
        documentNumber: document,
        email: user.email,
        applicationRootUrl: config.applicationRootUrl,
        currency: currency,
    });

module.exports = {withdraw};
