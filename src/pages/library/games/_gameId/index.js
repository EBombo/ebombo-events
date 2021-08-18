import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useSendError } from "../../../../hooks";
import { useFetch } from "../../../../hooks/useFetch";
import { firestore } from "../../../../firebase";
import { Bingo } from "./Bingo";

export const GameContainer = (props) => {
  const router = useRouter();
  const { gameId, resourceId, folderId } = router.query;
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");
  const [isLoading, setIsLoading] = useState(false);
  const [resource, setResource] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (!gameId || gameId === "new") return;

    const _game = games.find((game) => game.id === gameId);

    setGame(_game);
  }, []);

  useEffect(() => {
    const fetchResource = async () => {
      const resourceRef = await firestore
        .collection("games")
        .doc(resourceId)
        .get();
      setResource(resourceRef.data());
    };

    fetchResource();
  }, []);

  const submitGame = async (game) => {
    setIsLoading(true);
    try {
      game
        ? await Fetch(updateUrl(resource), "PUT", { ...game, resourceId })
        : await Fetch(createUrl(resource), "POST", { ...game, resourceId });

      props.fetchGames();
      router.back();
    } catch (error) {
      console.error(error);
      sendError(error, "createGame");
    }
    setIsLoading(false);
  };

  const updateUrl = (resource) => {
    if (folderId)
      return `${resource.domain}/api/games/${game.id}/users/${authUser.id}?folderId=${folderId}`;
    return `${resource.domain}/api/games/${game.id}/users/${authUser.id}`;
  };

  const createUrl = (resource) => {
    if (folderId)
      return `${resource.domain}/api/games/new/users/${authUser.id}?folderId=${folderId}`;
    return `${resource.domain}/api/games/new/users/${authUser.id}`;
  };

  return (
    <GameContainerCss>
      {resource && resource.name === "Bingo" && (
        <Bingo
          submitGame={submitGame}
          isLoading={isLoading}
          game={game}
          {...props}
        />
      )}
      {/*hello-{resourceId}-{folderId}*/}
    </GameContainerCss>
  );
};

const GameContainerCss = styled.div`
  width: 100%;
`;
