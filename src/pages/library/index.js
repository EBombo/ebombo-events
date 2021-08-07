import React, { useEffect } from "reactn";
import styled from "styled-components";
import { Desktop, Tablet } from "../../constants";
import { TabletLibrary } from "./TabletLibrary";
import { DesktopLibrary } from "./DesktopLibrary";

export const LibraryContainer = (props) => {
  useEffect(() => {
    props.fetchFolders();
    props.fetchGames();
  }, []);

  return (
    <LibraryContainerCss>
      <Desktop>
        <DesktopLibrary {...props} />
      </Desktop>
      <Tablet>
        <TabletLibrary {...props} />
      </Tablet>
    </LibraryContainerCss>
  );
};

const LibraryContainerCss = styled.div`
  width: 100%;
`;
