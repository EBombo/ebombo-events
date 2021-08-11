const logger = require("../../../utils/logger");
const { snapshotToArray } = require("../../../utils");
const { firestore } = require("../../../config");
const fetch = require("node-fetch");
const flatMap = require("lodash/flatMap");

exports.getGames = async (req, res, next) => {
  try {
    logger.log("getGames->", req.params);

    const { userId } = req.params;
    const { folderId } = req.query;

    const gamesAdmin = await fetchGamesAdmin();

    const promises = gamesAdmin.map(async (game) => {
      try {
        const response = await fetch(
          `${game.domain}/api/games/folders/${folderId}/users/${userId}?folderId=${folderId}`,
          { method: "GET" }
        );
        if (!response.ok) throw Error(response.statusMessage);

        const responseJSON = await response.json();

        return responseJSON;
      } catch (error) {
        logger.error(error);
        return null;
      }
    });

    const responses = await Promise.all(promises);

    logger.log("responses", responses);

    const games = flatMap(responses);

    return res.send(games);
  } catch (error) {
    logger.error(error);
    next(error);
  }
};

const fetchGamesAdmin = async () => {
  const gamesRef = await firestore
    .collection("games")
    .where("deleted", "==", false)
    .get();

  return snapshotToArray(gamesRef);
};
