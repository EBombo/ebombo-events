import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, Tablet } from "../../constants";
import { TabletLibrary } from "./TabletLibrary";
import { DesktopLibrary } from "./DesktopLibrary";
import { firestore } from "../../firebase";
import { snapshotToArray } from "../../utils";
import { useRouter } from "next/router";

export const LibraryContainer = (props) => {
  const router = useRouter();
  const { folderId } = router.query;
  const [parent, setParent] = useState(null);
  const [folders, setFolders] = useState([]);
  const [authUser] = useGlobal("user");
  const [games, setGames] = useState([]);

  const fetchFolders = async () => {
    let folderRef = firestore
      .collection("folders")
      .where("usersIds", "array-contains", authUser?.id)
      .where("deleted", "==", false);

    folderRef = folderId
      ? folderRef.where("parent.id", "==", folderId)
      : folderRef.where("parent", "==", null);

    const foldersQuery = await folderRef.get();

    setFolders(snapshotToArray(foldersQuery));
  };

  const fetchGames = async () => {
    let gamesRef = firestore
      .collection("gamesToPlay")
      .where("usersIds", "array-contains", authUser?.id)
      .where("deleted", "==", false);

    gamesRef = folderId
      ? gamesRef.where("parent.id", "==", folderId)
      : gamesRef.where("parent", "==", null);

    const gamesQuery = await gamesRef.get();

    setGames(snapshotToArray(gamesQuery));
  };

  useEffect(() => {
    if (router.asPath === "/library") return;

    fetchFolders();
    fetchGames();
  }, [folderId]);

  useEffect(() => {
    if (!folderId) return;

    const fetchParent = async () => {
      const parentRef = await firestore
        .collection("folders")
        .doc(folderId)
        .get();

      setParent(parentRef.data());
    };

    fetchParent();
  }, [folderId]);

  return (
    <LibraryContainerCss>
      <Desktop>
        <DesktopLibrary
          {...props}
          games={games}
          parent={parent}
          folders={folders}
          fetchFolders={fetchFolders}
          fetchGames={fetchGames}
        />
      </Desktop>
      <Tablet>
        <TabletLibrary
          {...props}
          games={games}
          parent={parent}
          folders={folders}
          fetchFolders={fetchFolders}
          fetchGames={fetchGames}
        />
      </Tablet>
    </LibraryContainerCss>
  );
};

const LibraryContainerCss = styled.div`
  width: 100%;
`;
