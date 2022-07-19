import React, { useEffect, useState } from "reactn";
import { useRouter } from "next/router";
import { firestore } from "../../../../../../firebase";
import { spinLoader } from "../../../../../../components/common/loader";
import { Trivia } from "../../../../../library/games/_gameId/Trivia";

export const TemplateGame = (props) => {
  const router = useRouter();
  const { gameId, templateId } = router.query;

  const [isLoading, setIsLoading] = useState(true);
  const [game, setGame] = useState(null);
  const [parent, setParent] = useState(null);

  const [template, setTemplate] = useState([]);

  useEffect(() => {
    if (!gameId) return setIsLoading(false);
    if (!templateId) return setIsLoading(false);

    const initialize = async () => {
      const fetchAdminGame = async () => {
        const querySnapshotAdminGame = await firestore.collection("games").doc(gameId).get();

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
  }, [gameId]);

  const submitGame = async () => {};

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
