const {
    updateTournament,
    fetchTournament,
} = require("../../../collections/tournaments");
const {firestore} = require("../../../config");
const {map, get} = require("lodash");
const logger = require("../../../utils/logger");
const {FieldValue} = require("@google-cloud/firestore");
const {fetchUser, updateUser} = require("../../../collections/users");
const {transaction} = require("../../../transactions");
const {fetchTournamentTeam} = require("../../../collections/tournamentTeams");

exports.putRejectTeam = async (req, res, next) => {
    logger.log("put tournamentTeam reject team->", req.params);
    try {
        const {tournamentTeamId} = req.params;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);

        if (tournamentTeam.deleted) return res.send(200);

        const tournament = await fetchTournament(tournamentTeam.tournamentId);

        await setTournamentTeam(tournamentTeamId);

        await updateTournament(tournament.id, {
            playerIds: tournament.playerIds.filter(
                (playerId) => !tournamentTeam.playerIds.includes(playerId)
            ),
            countTournamentTeams: FieldValue.increment(-1),
        });

        if (tournamentTeam.inscriptionByBrief) return res.send(200);

        const promises = map(
            tournamentTeam.playersPayments,
            async (amount, userId) => {
                const user_ = await fetchUser(userId);

                await transaction(
                    "user-tournament-refund",
                    user_,
                    +amount,
                    `usuario retirado del torneo : ${tournament.name}  monto retribuido ${amount}`,
                    `se retiro del torneo ${tournament.id}`,
                    tournament,
                    tournamentTeam
                );
                if (get(tournament, "realMoney", true)) {
                    await updateUser(userId, {
                        money: +(+get(user_, "money", 0) + +amount).toFixed(2),
                    });
                }
                if (!get(tournament, "realMoney", true)) {
                    await updateUser(userId, {
                        ebCoins: +(+get(user_, "ebCoins", 0) + +amount).toFixed(2),
                    });
                }
            }
        );

        await Promise.all(promises);

        return res.send(200);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const setTournamentTeam = async (tournamentTeamId) =>
    await firestore.doc(`tournamentTeams/${tournamentTeamId}`).update({
        deleted: true,
        updateAt: new Date(),
    });
