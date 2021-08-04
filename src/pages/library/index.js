import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, Tablet } from "../../constants";
import { TabletLibrary } from "./TabletLibrary";
import { DesktopLibrary } from "./DesktopLibrary";

export const LibraryContainer = (props) => {
  const [folders, setFolders] = useState([]);
  const [games, setGames] = useState([{
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    name: "Trivia",
    imageUrl: "https://mk0snacknation9jc4nw.kinstacdn.com/wp-content/uploads/2020/08/27-Virtual-Trivia-Ideas-For-People-Who-Know-Facts-And-Nothing-Else-copy.png"
  }]);
  const [authUser] = useGlobal("user");

  useEffect(() => {
    fetchFolders();
    fetchGames();
  }, []);

  const fetchFolders = () => {
    console.log("USE SNAPSHOT TO DO THE FETCH");
  };

  const fetchGames = () => {
    console.log("USE SNAPSHOT TO DO THE FETCH");
  };

  return (
    <LibraryContainerCss>
      <Desktop>
        <DesktopLibrary folders={folders} games={games} {...props} />
      </Desktop>
      <Tablet>
        <TabletLibrary folders={folders} games={games} {...props} />
      </Tablet>
    </LibraryContainerCss>
  );
};

const LibraryContainerCss = styled.div`
  width: 100%;
`;
