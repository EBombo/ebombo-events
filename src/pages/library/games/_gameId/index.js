import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import { useRouter } from "next/router";
import { useSendError } from "../../../../hooks";
import { useFetch } from "../../../../hooks/useFetch";
import { Bingo } from "./Bingo";
import { firestore } from "../../../../firebase";
import { Hanged } from "./Hanged";
import { spinLoader } from "../../../../components/common/loader";
import { Roulette } from "./Roulette";
import { Trivia } from "./Trivia";
import defaultTo from "lodash/defaultTo";
import { gaEvent } from "../../../../utils";

export const updateGameUrl = (adminGame, game, authUser) => `${adminGame.api}/games/${game.id}/users/${authUser.id}`;

export const updateGame = async (adminGame, game, authUser) => {
  const { Fetch } = useFetch();

  delete adminGame.createAt;
  delete adminGame.updateAt;

  const fetchProps = {
    url: updateGameUrl(adminGame, game, authUser),
    method: "PUT",
    body: { ...game, adminGame },
  };

  const { error } = await Fetch(fetchProps.url, fetchProps.method, fetchProps.body);

  if (error) throw new Error(error);
};

export const GameContainer = (props) => {
  const router = useRouter();
  const { gameId, adminGameId, folderId } = router.query;

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("userGames");
  const [adminGames] = useGlobal("adminGames");

  const [isLoading, setIsLoading] = useState(false);
  const [parent, setParent] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    router.prefetch("/library/games");
  }, []);

  useEffect(() => {
    if (!folderId) return null;

    const fetchParent = async () => {
      const parentRef = await firestore.collection("folders").doc(folderId).get();
      setParent(parentRef.data());
    };

    fetchParent();
  }, [folderId]);

  useEffect(() => {
    if (!gameId) return;

    if (gameId === "new") return;

    const _game = defaultTo(games, []).find((game) => game.id === gameId);

    setCurrentGame(_game);
  }, [gameId, games]);

  const currentAdminGame = useMemo(() => {
    if (!adminGames?.length) return;

    const currentAdminGame_ = adminGames.find((adminGame_) => adminGame_.id === adminGameId);

    if (!currentAdminGame_) return;

    return currentAdminGame_;
  }, [adminGameId, adminGames]);

  const submitGame = async (game) => {
    try {
      setIsLoading(true);

      let adminGame = currentAdminGame;
      delete adminGame.createAt;
      delete adminGame.updateAt;

      const fetchProps = {
        url: currentGame ? updateUrl(adminGame) : createUrl(adminGame),
        method: currentGame ? "PUT" : "POST",
        body: currentGame
          ? { ...game, adminGame, parentId: parent?.id || null }
          : {
              ...game,
              adminGame,
              adminGameId,
              user: authUser,
              parentId: parent?.id || null,
            },
      };

      const { error } = await Fetch(fetchProps.url, fetchProps.method, fetchProps.body);

      if (error) {
        props.showNotification("Error", "Algo salio mal. Por favor intenta nuevamente.");
        throw new Error(error);
      }

      props.fetchGames();

      /** Google event. **/
      gaEvent("user", "create-game", `create-game-${adminGame?.title}`);

      await router.push("/library/games");
    } catch (error) {
      console.error(error);
      sendError(error, "createGame");
    }

    setIsLoading(false);
  };

  const updateUrl = (adminGame) => `${adminGame.api}/games/${currentGame.id}/users/${authUser.id}`;

  const createUrl = (adminGame) => `${adminGame.api}/games/new/users/${authUser.id}`;

  const isFetchingGame = useMemo(() => {
    return gameId !== "new" && !currentGame?.id;
  }, [currentGame, gameId]);

  if (gameId !== "new" && !currentGame) return spinLoader();

  return (
    <div className="w-full" key={`${adminGameId}`}>
      {currentAdminGame?.name === "bingo" && (
        <Bingo
          submitGame={submitGame}
          isLoading={isLoading}
          game={currentGame}
          parent={parent}
          setParent={setParent}
          {...props}
        />
      )}

      {currentAdminGame?.name === "hanged" && (
        <Hanged
          submitGame={submitGame}
          isLoading={isLoading}
          game={currentGame}
          parent={parent}
          setParent={setParent}
          {...props}
        />
      )}

      {(currentAdminGame?.name === "roulette" || currentAdminGame?.name === "rouletteQuestions") && (
        <>
          {isFetchingGame ? (
            spinLoader()
          ) : (
            <Roulette
              submitGame={submitGame}
              isLoading={isLoading}
              game={currentGame}
              parent={parent}
              setParent={setParent}
              currentAdminGame={currentAdminGame}
              {...props}
            />
          )}
        </>
      )}

      {currentAdminGame?.name === "trivia" && (
        <Trivia
          submitGame={submitGame}
          isLoading={isLoading}
          game={currentGame}
          parent={parent}
          setParent={setParent}
          {...props}
        />
      )}
    </div>
  );
};
