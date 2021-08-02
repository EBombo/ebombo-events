import React from "reactn";
import styled from "styled-components";
import { Desktop, Tablet } from "../../constants";
import { TabletLibrary } from "./TabletLibrary";
import { DesktopLibrary } from "./DesktopLibrary";

export const Library = (props) => {
  return (
    <LibraryContainer>
      <Desktop>
        <DesktopLibrary {...props} />
      </Desktop>
      <Tablet>
        <TabletLibrary {...props} />
      </Tablet>
    </LibraryContainer>
  );
};

const LibraryContainer = styled.div`
  width: 100%;
`;
