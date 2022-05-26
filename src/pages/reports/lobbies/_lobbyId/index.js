import { useRouter } from "next/router";
import React, { useEffect, useGlobal, useState } from "reactn";
import { useTranslation } from "../../../../hooks";
import { firestoreGames } from "../../../../firebase";

export const LobbyReport = (props) => {
  const router = useRouter();

  const { lobbyId } = router.query;

  const { t } = useTranslation("pages.reports");

  const [lobby, setLobby] = useState({});

  useEffect(() => {
    const fetchLobby = () =>
      firestoreGames
        .collection("lobbies")
        .doc(lobbyId)
        .onSnapshot((lobbiesSnapshot) => {
          const _lobbies = snapshotToArray(lobbiesSnapshot);

          const filterLobbies = _lobbies.filter((lobby) => defaultTo(lobby.game?.usersIds, []).includes(authUser.id));

          setLobby(filterLobbies);
          setLoading(false);
        });

    const unSub = fetchLobby();
    return () => unSub();
  }, [lobbyId]);

  return <div>algo</div>;
};
