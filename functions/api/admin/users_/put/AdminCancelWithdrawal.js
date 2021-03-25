const fs = require("file-system");
const path = require("path");
const {get} = require("lodash");
const {fetchUser} = require("../../../../collections/users");
const {transaction} = require("../../../../transactions");
const {firestore, config} = require("../../../../config");
const {sendEmail} = require("../../../../email/sendEmail");
const logger = require("../../../../utils/logger");
const {fetchTransaction} = require("../../../../collections/transactions");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../../email/templates/rejectWithdrawal.html")
    )
    .toString();

const currency = config.currency;

exports.adminCancelWithdrawal = async (req, res, next) => {
    try {
        logger.log("rejectWithdrawal");
        const {withdrawalId} = req.params;

        const withdrawal = await fetchTransaction(withdrawalId);

        logger.log("withdrawal => ", withdrawal);

        const user = await fetchUser(withdrawal.user.id);

        const money = +get(user, "money", 0) + +get(withdrawal, "amount", 0);

        await updateWithdrawal(withdrawal);

        await updateUser_(user.id, {money});

        // --> create a transaction

        await transaction(
            "reject-withdrawal",
            user,
            +get(withdrawal, "amount", 0),
            `Dinero devuelto ${user.id} ${+get(withdrawal, "amount", 0)}`
        );

        await sendEmail_(withdrawal.user.email, withdrawal, template);

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const updateWithdrawal = (withdrawal) =>
    firestore.doc(`transactions/${withdrawal.id}`).update({
        isRejected: true,
        description: withdrawal.description.replace(
            "Retiro",
            "Se rechazo su retiro"
        ),
    });

const updateUser_ = (userId, user) =>
    firestore.doc(`users/${userId}`).update(user);

const sendEmail_ = async (email, withdrawal, template) =>
    await sendEmail(
        email,
        `Se rechazo su retiro de ${currency} ${withdrawal.amount}`,
        template,
        {
            name: withdrawal.user.name,
            amount: withdrawal.amount,
            currency: currency,
        }
    );
