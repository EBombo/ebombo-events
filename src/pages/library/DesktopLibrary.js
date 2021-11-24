import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useRouter } from "next/router";
import get from "lodash/get";
import { DesktopLibraryGames } from "./DesktopLibraryGames";
import { DesktopLibraryFolders } from "./DesktopLibraryFolders";
import { DesktopLeftMenu } from "../../components/common/DesktopLeftMenu";

export const DesktopLibrary = (props) => {
  const router = useRouter();

  return (
    <DesktopLibraryContainer>
      <DesktopLeftMenu {...props} />
      {router.asPath.includes("/folders") ? (
        <DesktopLibraryFolders {...props} />
      ) : (
        <DesktopLibraryGames {...props} />
      )}
    </DesktopLibraryContainer>
  );
};

const DesktopLibraryContainer = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  display: grid;
  grid-template-columns: 250px auto;
`;
