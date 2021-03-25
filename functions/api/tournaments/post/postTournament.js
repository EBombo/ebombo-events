const {firestore} = require("../../../config");

const postTournament = async (req, res, next) => {
    try {
        const {
            name,
            lastName,
            email,
            countryCode,
            dialCode,
            phoneNumber,
            games,
        } = req.body;

        console.log(
            "postTournament->",
            name,
            lastName,
            email,
            countryCode,
            dialCode,
            phoneNumber,
            games
        );

        if (
            !name ||
            !lastName ||
            !email ||
            !countryCode ||
            !dialCode ||
            !phoneNumber
        )
            return;

        const tournamentsRef = firestore.collection("tournamentsTMP");

        const tournamentId = tournamentsRef.doc().id;

        await tournamentsRef.doc(tournamentId).set({
            createAt: new Date(),
            updateAt: new Date(),
            tournamentId,
            name,
            lastName,
            email,
            countryCode,
            dialCode,
            phoneNumber,
            games,
        });

        return res.send(200);
    } catch (Error) {
        console.error(Error);
        next(Error);
    }
};

module.exports = {postTournament};
