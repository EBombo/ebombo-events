import React, { useEffect, useState } from "reactn";
import { useRouter } from "next/router";
import { firestore } from "../../../../../../firebase";
import { spinLoader } from "../../../../../../components/common/loader";
import { Trivia } from "../../../../../library/games/_gameId/Trivia";
import { useSendError } from "../../../../../../hooks";
import { useFetch } from "../../../../../../hooks/useFetch";

export const TemplateGame = (props) => {
  const router = useRouter();
  const { adminGameId, templateId } = router.query;

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(true);
  const [game, setGame] = useState(null);
  const [parent, setParent] = useState(null);

  const [template, setTemplate] = useState(null);

  useEffect(() => {
    if (!adminGameId) return setIsLoading(false);
    if (!templateId) return setIsLoading(false);

    const initialize = async () => {
      const fetchAdminGame = async () => {
        const querySnapshotAdminGame = await firestore.collection("games").doc(adminGameId).get();

        const adminGame = querySnapshotAdminGame.data();
        setGame(adminGame);
      };

      const fetchTemplate = async () => {
        if (templateId === "new") return;

        const querySnapshotTemplate = await firestore.collection("templates").doc(templateId).get();

        const template_ = querySnapshotTemplate.data();
        setTemplate(template_);
      };

      await fetchAdminGame();
      await fetchTemplate();

      setIsLoading(false);
    };

    initialize();
  }, [adminGameId]);

  const submitGame = async () => {
    try {
      setIsLoadingSubmit(true);

      const method = template ? "POST" : "PUT";

      const body = {
        deleted: false,
        adminGameId: adminGameId,
        updateAt: new Date(),
        createAt: template ? template.createAt.toDate() : new Date(),
        adminGame: { ...game, createAt: game.createAt.toDate(), updateAt: game.updateAt.toDate() },
      };

      const { error } = await Fetch(`${config.serverUrl}/api/templates/${templateId}`, method, body);

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
      {game?.name === "trivia" && (
        <Trivia
          submitGame={submitGame}
          isLoading={isLoading}
          game={game}
          parent={parent}
          setParent={setParent}
          {...props}
        />
      )}
    </div>
  );
};
