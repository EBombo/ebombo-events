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
  const [games, setGames] = useState([
    {
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      name: "Trivia",
      id: "Trivia",
      imageUrl:
        "https://mk0snacknation9jc4nw.kinstacdn.com/wp-content/uploads/2020/08/27-Virtual-Trivia-Ideas-For-People-Who-Know-Facts-And-Nothing-Else-copy.png",
    },
  ]);

  const fetchFolders = async () => {
    let folderRef = firestore
      .collection("folders")
      .where("user.id", "==", authUser.id)
      .where("deleted", "==", false);

    folderRef = folderId
      ? folderRef.where("parent.id", "==", folderId).limit(1)
      : folderRef.where("parent", "==", null);

    const foldersQuery = await folderRef.get();

    setFolders(snapshotToArray(foldersQuery));
  };

  useEffect(() => {
    if (router.asPath === "/library") return;

    fetchFolders();
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
          folders={folders}
          games={games}
          {...props}
          parent={parent}
          fetchFolders={fetchFolders}
        />
      </Desktop>
      <Tablet>
        <TabletLibrary
          folders={folders}
          games={games}
          {...props}
          parent={parent}
          fetchFolders={fetchFolders}
        />
      </Tablet>
    </LibraryContainerCss>
  );
};

const LibraryContainerCss = styled.div`
  width: 100%;
`;
