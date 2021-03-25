const {firestore} = require("../../../config");
const {remove, orderBy} = require("lodash");

const userDiscountCoins = async (req, res, next) => {
    console.log("users discount->", req.params);

    try {
        const user = await user_(req.params.userId);
        let debt = +req.params.amount;

        const userRef = await firestore.collection("users").doc(req.params.userId);
        const expiringCoins = orderBy(user.expiringCoins, ["expireDate"], ["asc"]);

        expiringCoins.forEach((amount) => {
            if (debt > 0) {
                if (amount.coins >= debt) {
                    amount.coins -= debt;
                    debt = 0;
                } else {
                    debt -= amount.coins;
                    amount.coins = 0;
                }
            }
        });

        remove(expiringCoins, (amount) => amount.coins < 1);

        await userRef.update({
            coins: user.coins - debt,
            expiringCoins,
        });

        //-----transaction------
        const transactionsRef = await firestore.collection("transactions");
        const uid = await transactionsRef.doc().id;

        await transactionsRef.doc(uid).set({
            userId: req.params.userId,
            amount: Number(req.params.amount),
            description: "Descuento ",
            createAt: new Date(),
        });

        console.log("transaction-> ", req.params.amount);
        //-----transaction------

        return res.send(200);
    } catch (error) {
        next(error);
    }
};

const user_ = async (userId) => {
    const user = await firestore.collection("users").doc(userId).get();
    return user.data();
};

module.exports = {userDiscountCoins};
