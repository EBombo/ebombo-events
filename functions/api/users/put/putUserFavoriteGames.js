const logger = require("../../../utils/logger");
const {get} = require("lodash");
const {updateUser, fetchUser} = require("../../../collections/users");

exports.putUserFavoriteGames = async (req, res, next) => {
    try {
        logger.log("putUserFavoriteGameIds", req.body, req.params);

        const {userId, gameId} = req.params;

        if (!userId || !gameId)
            return res.status(400).send("Error save favorite games");

        logger.log("userId - gameId", userId, gameId);

        const user = await fetchUser(userId);

        let favoriteGameIds = get(user, "favoriteGameIds", []);

        const gameIdExists = favoriteGameIds.includes(gameId);

        if (gameIdExists) {
            await updateUser(userId, {
                favoriteGameIds: favoriteGameIds.filter(
                    (gameId_) => gameId_ !== gameId
                ),
                updateAt: new Date(),
            });

            return res.send(200);
        }

        favoriteGameIds.push(gameId);

        await updateUser(userId, {
            favoriteGameIds: favoriteGameIds,
            updateAt: new Date(),
        });

        return res.send(200);
    } catch (error) {
        next(error);
    }
};
