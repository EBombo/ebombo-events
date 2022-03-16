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
      {router.asPath.includes("/folders") && <DesktopLibraryFolders {...props} /> }
      {router.asPath.includes("/games") &&   <DesktopLibraryGames {...props} />}
      {router.asPath.includes("/events") &&   <Events {...props} />}
    </DesktopLibraryContainer>
  );
};

const DesktopLibraryContainer = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  display: grid;
  grid-template-columns: 250px auto;
`;
