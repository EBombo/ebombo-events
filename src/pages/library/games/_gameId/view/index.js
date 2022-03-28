import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useRouter } from "next/router";
import { config, firestoreBingo, firestoreHanged, firestoreRoulette, firestoreTrivia } from "../../../../../firebase";
import { spinLoader } from "../../../../../components/common/loader";
import { updateGame } from "../index";
import { useSendError } from "../../../../../hooks";
import { useFetch } from "../../../../../hooks/useFetch";
import { BingoView } from "./BingoView";
import { HangedView } from "./HangedView";
import { SideBar } from "./SideBar";
import { RouletteView } from "./RouletteView";
import { TriviaView } from "./TriviaView";
import { UsersView } from "./UsersView";
import { ModalMove } from "../../../../../components/common/ModalMove";

// TODO: This component is long consider a refactoring.
export const GameView = (props) => {
  const router = useRouter();
  const { gameId, adminGameId, folderId } = router.query;

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");
  const [adminGames] = useGlobal("adminGames");
  const [games, setGames] = useGlobal("userGames");

  const [resource, setResource] = useState(null);
  const [isVisibleModalMove, setIsVisibleModalMove] = useState(false);
  const [isVisibleInscriptions, setIsVisibleInscriptions] = useState(false);

  const game = useMemo(() => {
    if (!gameId) return {};
    if (!games?.length) return {};

    const currentGame = games.find((game) => game.id === gameId);

    return currentGame ?? {};
  }, [games, gameId]);

  useEffect(() => {
    if (isEmpty(adminGames)) return;

    const currentResource = adminGames.find((resource_) => resource_.id === adminGameId);

    setResource(currentResource);
  }, [adminGames]);

  const redirectToGameViewWithFolder = (folderId) => {
    folderId
      ? router.push(`/library/games/${gameId}/view?adminGameId=${adminGameId}&folderId=${folderId}`)
      : router.push(`/library/games/${gameId}/view?adminGameId=${adminGameId}`);
  };

  const moveGameToFolder = async (folder) => {
    if (!game) return;

    try {
      await updateGame(game.adminGame, { id: game.id, parentId: folder?.id }, authUser);

      redirectToGameViewWithFolder(folder?.id);
    } catch (error) {
      await sendError(error);
    }
  };

  const deleteGame = async () => {
    let newGames = games;
    const gameIndex = newGames.findIndex((_game) => _game.id === game.id);
    newGames.splice(gameIndex, 1);
    setGames(newGames);

    try {
      await Fetch(`${resource.api}/games/${game.id}/users/${authUser.id}`, "DELETE");
      router.back();
    } catch (error) {
      await sendError(error, "deleteGame");
    }
  };

  const createTokenToPlay = async () => {
    try {
      const gameName = game.adminGame.name.toLowerCase();
      const redirectUrl = `${config.bomboGamesUrl}/${gameName}/lobbies/new?gameId=${game.id}&userId=${authUser?.id}`;

      window.open(redirectUrl, "blank");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async () => {
    let newGames = games;
    const gameIndex = newGames.findIndex((game) => game.id === game.id);

    newGames[gameIndex].isFavorite = !get(newGames[gameIndex], "isFavorite", false);

    setGames(newGames);

    try {
      await Fetch(`${resource.domain}/api/games/${game.id}/users/${authUser.id}`, "PUT", {
        isFavorite: newGames[gameIndex].isFavorite,
      });
    } catch (error) {
      await sendError(error, "createGame");
    }
  };

  const moveToFolder = async (folder) => {
    let currentFirebase;

    if (game?.adminGame?.name === "bingo") {
      currentFirebase = firestoreBingo;
    }

    if (game?.adminGame?.name === "trivia") {
      currentFirebase = firestoreTrivia;
    }

    if (game?.adminGame?.name === "hanged") {
      currentFirebase = firestoreHanged;
    }

    if (game?.adminGame?.name === "roulette" || game?.adminGame?.name.toLowerCase().includes("questions")) {
      currentFirebase = firestoreRoulette;
    }

    await currentFirebase
      .collection("games")
      .doc(game.id)
      .update({
        ...game,
        parentId: folderId,
      });
  };

  if (!game) return spinLoader();

  return (
    <div className="w-full grid md:grid-cols-[350px_auto]">
      <ModalMove
        {...props}
        isVisibleModalMove={isVisibleModalMove}
        setIsVisibleModalMove={setIsVisibleModalMove}
        moveToFolder={moveToFolder}
        parent={game.parentId}
        game={game}
      />

      <SideBar
        {...props}
        game={game}
        deleteGame={deleteGame}
        toggleFavorite={toggleFavorite}
        createTokenToPlay={createTokenToPlay}
        setIsVisibleInscriptions={setIsVisibleInscriptions}
        isVisibleInscriptions={isVisibleInscriptions}
        setIsVisibleModalMove={setIsVisibleModalMove}
      />

      {isVisibleInscriptions && <UsersView game={game} {...props} />}

      {game?.adminGame?.name === "bingo" && !isVisibleInscriptions && <BingoView game={game} {...props} />}

      {game?.adminGame?.name === "hanged" && !isVisibleInscriptions && <HangedView game={game} {...props} />}

      {(game?.adminGame?.name === "roulette" || game?.adminGame?.name === "rouletteQuestions") &&
        !isVisibleInscriptions && <RouletteView game={game} {...props} />}

      {game?.adminGame?.name === "trivia" && !isVisibleInscriptions && <TriviaView game={game} {...props} />}
    </div>
  );
};
