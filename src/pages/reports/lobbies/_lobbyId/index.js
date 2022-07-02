import { useRouter } from "next/router";
import React, { useEffect, useState } from "reactn";
import { firestoreGames } from "../../../../firebase";
import { spinLoader } from "../../../../components/common/loader";
import { TriviaReport } from "./TriviaReport";
import { BingoReport } from "./BingoReport";

export const LobbyReport = (props) => {
  const router = useRouter();

  const { lobbyId } = router.query;

  const [lobby, setLobby] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLobby = () =>
      firestoreGames.doc(`lobbies/${lobbyId}`).onSnapshot((snapshot) => {
        setLobby(snapshot.data());
        setLoading(false);
      });

    const unSub = fetchLobby();
    return () => unSub();
  }, [lobbyId]);

  if (loading) return spinLoader();

  switch (lobby.game?.adminGame?.name) {
    case "trivia":
      return <TriviaReport {...props} lobby={lobby} />;
    case "bingo":
      return <BingoReport {...props} lobby={lobby} />;
    default:
      return <TriviaReport {...props} lobby={lobby} />;
  }
};
