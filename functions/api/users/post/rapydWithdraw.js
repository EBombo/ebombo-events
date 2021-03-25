const {firestore, config} = require("../../../config");
const {transaction} = require("../../../transactions");
const {defaultTo, get} = require("lodash");
const {sendEmail} = require("../../../email/sendEmail");
const {fetchUser, updateUser} = require("../../../collections/users");
const fs = require("file-system");
const path = require("path");

const templateAdmin = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/withdrawAdmin.html")
    )
    .toString();

const currency = config.currency;

const withdrawRapyd = async (req, res, next) => {
    console.log("withdraw ", req.params, req.body);

    try {
        const userId = req.params.userId;
        const amount = +req.body.amount;
        const beneficiary = req.body.beneficiary;

        const user = await fetchUser(userId);

        if (!checkWithdraw(user, amount)) {
            console.log("termino aqui");
            return res.status(400).send(`${currency} insuficiente`);
        }

        const transactionMessage = `Retiro de ${amount} ${currency} por el usuario ${user.id}. Pais del retiro: ${beneficiary.countryCode} Número de cuenta ${beneficiary.accountNumber}. Nombre de propietario: ${user.name} ${user.lastName}`;

        await transaction(
            "withdraw",
            user,
            +amount,
            transactionMessage,
            "Rapyd",
            beneficiary
        );

        user.money = get(user, "money", 0) - amount;

        await updateUser(userId, user);

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const checkWithdraw = async (user, amount) =>
    defaultTo(user.money, 0) >= amount;

module.exports = {withdrawRapyd};
