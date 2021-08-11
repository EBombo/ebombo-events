import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useSendError } from "../../../../hooks";
import { useFetch } from "../../../../hooks/useFetch";
import { firestore } from "../../../../firebase";
import { Bingo } from "./Bingo";

const imageUrl =
  "https://mk0snacknation9jc4nw.kinstacdn.com/wp-content/uploads/2020/08/27-Virtual-Trivia-Ideas-For-People-Who-Know-Facts-And-Nothing-Else-copy.png";

export const GameContainer = (props) => {
  const router = useRouter();
  const { gameId, resourceId, folderId } = router.query;
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");
  const [isLoading, setIsLoading] = useState(false);
  const [resource, setResource] = useState(null);
  const [game, setGame] = useState(null);

  useEffect(() => {
    if (!resource || gameId === "new") return;

    const fetchGame = async () => {
      try {
        const { response, error } = await Fetch(
          `${resource.domain}/api/games/${gameId}`
        );

        if (error) throw Error(error);

        setGame(response?.game);
      } catch (error) {
        console.error(error);
        sendError(error, "fetchGame");
      }
    };

    fetchGame();
  }, [resource]);

  useEffect(() => {
    if (!resourceId) return;

    const fetchResource = () => {};

    fetchResource();
  }, []);

  useEffect(() => {
    if (!folderId) return;

    const fetchFolder = () => {};

    fetchFolder();
  }, []);

  const fetchParent = async () => {
    if (!folderId) return null;
    const parentRef = await firestore.collection("folders").doc(folderId).get();
    return parentRef.data();
  };

  const createGame = async (game) => {
    try {
      setIsLoading(true);
      const gameToPlayRef = firestore.collection("gamesToPlay");
      const newGameToPlayId = gameToPlayRef.doc().id;

      const parent = await fetchParent();

      await gameToPlayRef.doc(newGameToPlayId).set(
        {
          ...game,
          id: newGameToPlayId,
          parent,
          imageUrl,
          user: authUser,
          usersIds: [authUser?.id],
          createAt: new Date(),
          updateAt: new Date(),
          deleted: false,
        },
        { merge: true }
      );

      props.fetchGames();
    } catch (error) {
      console.error(error);
      sendError(error, "createGame");
    }
    setIsLoading(false);
  };

  return (
    <GameContainerCss>
      {resourceId === "vJY65JpTHMcW0KyaypOT" && <Bingo {...props} />}
      {/*hello-{resourceId}-{folderId}*/}
    </GameContainerCss>
  );
};

const GameContainerCss = styled.div``;
