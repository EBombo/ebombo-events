import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useRouter } from "next/router";
import get from "lodash/get";
import { DesktopLibraryGames } from "./DesktopLibraryGames";
import { DesktopLibraryFolders } from "./DesktopLibraryFolders";

export const DesktopLibrary = (props) => {
  const router = useRouter();

  return (
    <DesktopLibraryContainer>
      <div className="left-container">
        <div className="subtitle">Libreria</div>
        <div
          className={`item games ${
            get(router, "asPath", "") === "/library/games" ? "active" : ""
          }`}
          onClick={() => router.push("/library/games")}
        >
          <Image
            src={`${config.storageUrl}/resources/purple-puzzle.svg`}
            width="20px"
            height="25px"
            className="icon"
            margin="0 20px 0 0"
          />
          <div className="name">Mis juegos</div>
        </div>
        <div
          className={`item favorites ${
            get(router, "asPath", "").includes("/library/games/folders")
              ? "active"
              : ""
          }`}
          onClick={() => router.push("/library/games/folders")}
        >
          <Image
            src={`${config.storageUrl}/resources/purple-folder.svg`}
            width="20px"
            height="25px"
            className="icon"
            margin="0 20px 0 0"
          />
          <div className="name">Folders</div>
        </div>
      </div>
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

  .left-container {
    background: ${(props) => props.theme.basic.whiteLight};
    color: ${(props) => props.theme.basic.grayLight};
    box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.25);

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      padding: 0.5rem;
    }

    .item {
      font-family: Lato;
      font-size: 15px;
      line-height: 18px;
      padding: 0.5rem 1rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      height: 42px;
      border-radius: 4px;
      margin: 0 5px;
      cursor: pointer;
    }

    .item:hover {
      background: ${(props) => props.theme.basic.whiteDark};
    }

    .active {
      background: ${(props) => props.theme.basic.whiteDark};
    }

    .selected {
      background: #f2f2f2;
    }
  }
`;
