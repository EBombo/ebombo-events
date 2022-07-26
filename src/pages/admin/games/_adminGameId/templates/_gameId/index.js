import React, { useEffect, useState } from "reactn";
import { useRouter } from "next/router";
import { config, firestore } from "../../../../../../firebase";
import { spinLoader } from "../../../../../../components/common/loader";
import { Trivia } from "../../../../../library/games/_gameId/Trivia";
import { useSendError } from "../../../../../../hooks";
import { useFetch } from "../../../../../../hooks/useFetch";

export const TemplateGame = (props) => {
  const router = useRouter();
  const { adminGameId, gameId } = router.query;

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [parent, setParent] = useState(null);
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminGame, setAdminGame] = useState(null);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!gameId) return setIsLoading(false);
    if (!adminGameId) return setIsLoading(false);

    const initialize = async () => {
      const fetchAdminGame = async () => {
        const querySnapshotAdminGame = await firestore.collection("games").doc(adminGameId).get();

        const adminGame = querySnapshotAdminGame.data();
        setAdminGame(adminGame);
      };

      const fetchTemplate = async () => {
        if (gameId === "new") return;

        const querySnapshotTemplate = await firestore.collection("templates").doc(gameId).get();

        const template_ = querySnapshotTemplate.data();
        setTemplate(template_);
      };

      await fetchAdminGame();
      await fetchTemplate();

      setIsLoading(false);
    };

    initialize();
  }, [adminGameId]);

  const submitGame = async (dataGame) => {
    try {
      setIsLoadingSubmit(true);

      const method = template ? "PUT" : "POST";

      const body = {
        ...dataGame,
        adminGameId: adminGameId,
        isDynamic: !!template?.isDynamic,
        adminGame: { ...adminGame, createAt: adminGame.createAt.toDate(), updateAt: adminGame.updateAt.toDate() },
      };

      const { error } = await Fetch(`${config.serverUrl}/api/templates/${gameId}`, method, body);

      if (error) {
        throw Error(error);
      }

      props.showNotification("OK", "la operacion fue exitosa", "success");

      router.back();
    } catch (error) {
      console.error(error);
      sendError(error, "submitGame-template");
      props.showNotification("Error", error.message ?? "Algo salió mal");
    }

    setIsLoadingSubmit(false);
  };

  if (isLoading) return spinLoader();

  return (
    <div>
      {adminGame?.name === "trivia" && (
        <Trivia
          submitGame={submitGame}
          isLoading={isLoadingSubmit}
          game={template}
          parent={parent}
          setParent={setParent}
          {...props}
        />
      )}

      {adminGame?.name !== "trivia" ? "PROXIMAMENTE" : null}
    </div>
  );
};
