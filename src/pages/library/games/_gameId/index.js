import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useSendError } from "../../../../hooks";
import { useFetch } from "../../../../hooks/useFetch";
import isEmpty from "lodash/isEmpty";
import { Bingo } from "./Bingo";
import { firestore } from "../../../../firebase";

export const GameContainer = (props) => {
  const router = useRouter();
  const { gameId, resourceId, folderId } = router.query;
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");
  const [resources] = useGlobal("resources");
  const [isLoading, setIsLoading] = useState(false);
  const [parent, setParent] = useState(null);
  const [resource, setResource] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);

  useEffect(() => {
    const fetchParent = async () => {
      if (!folderId) return null;
      const parentRef = await firestore
        .collection("folders")
        .doc(folderId)
        .get();
      setParent(parentRef.data());
    };

    fetchParent();
  }, []);

  useEffect(() => {
    if (gameId === "new") return;

    const _game = games.find((game) => game.id === gameId);

    setCurrentGame(_game);
  }, [games]);

  useEffect(() => {
    if (isEmpty(resources)) return;

    const currentResource = resources.find(
      (resource_) => resource_.id === resourceId
    );

    setResource(currentResource);
  }, [resources]);

  const submitGame = async (game) => {
    setIsLoading(true);
    try {
      let adminGame = resource;
      delete adminGame.createAt;
      delete adminGame.updateAt;

      const fetchProps = {
        url: currentGame ? updateUrl(resource) : createUrl(resource),
        method: currentGame ? "PUT" : "POST",
        body: currentGame
          ? { ...game, adminGame, parentId: parent?.id || null }
          : {
              ...game,
              adminGame,
              resourceId,
              user: authUser,
              parentId: parent?.id || null,
            },
      };

      const { error } = await Fetch(
        fetchProps.url,
        fetchProps.method,
        fetchProps.body
      );

      if (error) throw new Error(error);

      props.fetchGames();
      router.back();
    } catch (error) {
      console.error(error);
      sendError(error, "createGame");
    }
    setIsLoading(false);
  };

  const updateUrl = (resource) =>
    `${resource.api}/games/${currentGame.id}/users/${authUser.id}`;

  const createUrl = (resource) =>
    `${resource.api}/games/new/users/${authUser.id}`;

  return (
    <GameContainerCss>
      {resource && resource.name === "Bingo" && (
        <Bingo
          submitGame={submitGame}
          isLoading={isLoading}
          game={currentGame}
          parent={parent}
          setParent={setParent}
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
