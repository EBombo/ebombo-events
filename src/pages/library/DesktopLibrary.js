import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { DesktopLibraryGames } from "./DesktopLibraryGames";
import { DesktopLibraryFolders } from "./DesktopLibraryFolders";
import { DesktopLeftMenu } from "../../components/common/DesktopLeftMenu";
import { Events } from "./events";

export const DesktopLibrary = (props) => {
  const router = useRouter();

  return (
    <DesktopLibraryContainer>
      <DesktopLeftMenu {...props} />
      {router.asPath.includes("/folders") ? <DesktopLibraryFolders {...props} /> : null}
      {["/library", "/library/games"].includes(router.asPath) ? <DesktopLibraryGames {...props} /> : null}
      {router.asPath.includes("/events") ? <Events {...props} /> : null}
    </DesktopLibraryContainer>
  );
};

const DesktopLibraryContainer = styled.div`
  width: 100%;
  display: grid;
  height: calc(100vh - 50px);
  grid-template-columns: 250px auto;
`;
