import React, { useEffect, useState } from "reactn";
import { useRouter } from "next/router";
import { firestore } from "../../../../../../firebase";
import { spinLoader } from "../../../../../../components/common/loader";
import { Trivia } from "../../../../../library/games/_gameId/Trivia";
import { useSendError } from "../../../../../../hooks";
import { useFetch } from "../../../../../../hooks/useFetch";

export const TemplateGame = (props) => {
  const router = useRouter();
  const { adminGameId, gameId } = router.query;

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [adminGame, setAdminGame] = useState(null);

  const [parent, setParent] = useState(null);

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (!adminGameId) return setIsLoading(false);
    if (!gameId) return setIsLoading(false);

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
        createAt: template ? template.createAt.toDate() : new Date(),
        adminGame: { ...adminGame, createAt: adminGame.createAt.toDate(), updateAt: adminGame.updateAt.toDate() },
      };

      //http://localhost:8080
      //${config.serverUrl}
      const { error } = await Fetch(`http://localhost:8080/api/templates/${gameId}`, method, body);

      if (error) {
        throw Error(error);
      }

      props.showNotification("OK", "Creado con exito", "Success");

      router.back();
    } catch (error) {
      console.error(error);
      sendError(error, "submitGame temaplte");
      props.showNotification("Error", error.message ?? "Algo salio mal");
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
    </div>
  );
};
