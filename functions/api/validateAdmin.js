const {fetchUser} = require("../collections/users");
const {auth} = require("../config");

const validateAdmin = async (req, res, next) => {
    try {
        console.log("req.headers.authorization", req.headers.authorization);

        const tokenId = req.headers.authorization.split("Bearer ")[1];

        console.log("tokenId", tokenId);

        const authUser = await auth.verifyIdToken(tokenId);

        console.log("authUser", authUser);

        const user = await fetchUser(authUser.uid);

        console.log("user", user);

        if (!user.isAdmin) return res.status(400).send("access denied");

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {validateAdmin};


