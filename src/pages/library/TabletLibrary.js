import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config, firestore } from "../../firebase";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { ButtonAnt } from "../../components/form";
import { Tooltip } from "antd";
import { darkTheme } from "../../theme";
import { ModalNewFolder } from "./ModalNewFolder";
import { ModalNewGame } from "./ModalNewGame";

export const TabletLibrary = (props) => {
  const router = useRouter();
  const [isVisibleModalGame, setIsVisibleModalGame] = useState(false);
  const [isVisibleModalFolder, setIsVisibleModalFolder] = useState(false);

  return (
    <TabletLibraryContainer>
      {isVisibleModalFolder && (
        <ModalNewFolder
          {...props}
          isVisibleModalFolder={isVisibleModalFolder}
          setIsVisibleModalFolder={setIsVisibleModalFolder}
        />
      )}
      {isVisibleModalGame && (
        <ModalNewGame
          isVisibleModalGame={isVisibleModalGame}
          setIsVisibleModalGame={setIsVisibleModalGame}
        />
      )}
      {router.asPath === "/library" && (
        <>
          <div className="subtitle">Librería</div>
          <div className="main-content">
            <div className="recents">Recientes</div>
            <div className="most-recent" />
            <div
              className="item games"
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
              className="item favorites"
              onClick={() => router.push("/library/favorites")}
            >
              <Image
                src={`${config.storageUrl}/resources/purple-star.svg`}
                width="20px"
                height="25px"
                className="icon"
                margin="0 20px 0 0"
              />
              <div className="name">Favoritos</div>
            </div>
          </div>
        </>
      )}
      {router.asPath.includes("/library/games") && (
        <>
          <div className="subtitle">
            Mis Juegos
            <Tooltip
              placement="bottomLeft"
              trigger="click"
              title={
                <ToolTipContent>
                  <div
                    className="option"
                    onClick={() => setIsVisibleModalGame(true)}
                  >
                    <Image
                      src={`${config.storageUrl}/resources/purple-puzzle.svg`}
                      width="20px"
                      height="25px"
                      className="icon"
                      margin="0 20px 0 0"
                      filter="grayscale(100%)"
                    />
                    Crear juego
                  </div>
                  <div
                    className="option"
                    onClick={() => setIsVisibleModalFolder(true)}
                  >
                    <Image
                      src={`${config.storageUrl}/resources/purple-star.svg`}
                      width="20px"
                      height="25px"
                      className="icon"
                      margin="0 20px 0 0"
                      filter="grayscale(100%)"
                    />
                    Crear folder
                  </div>
                </ToolTipContent>
              }
              color={darkTheme.basic.whiteLight}
            >
              <ButtonAnt variant="contained" color="secondary">
                Crear
                <Image
                  src={`${config.storageUrl}/resources/plus-icon.svg`}
                  width="20px"
                  height="25px"
                  className="icon"
                  margin="0 0 0 5px"
                />
              </ButtonAnt>
            </Tooltip>
          </div>
          <div className="main-content">
            <div className="item-subtitle">
              Folder ({props.folders.length}) [{props.parent?.path}]
            </div>

            {isEmpty(props.folders) ? (
              <div className="empty-message">No cuentas con folders</div>
            ) : (
              props.folders.map((folder) => (
                <div
                  key={folder.id}
                  className="item games folder"
                  onClick={() =>
                    router.push(`/library/games/folders/${folder.id}`)
                  }
                >
                  <Image
                    src={`${config.storageUrl}/resources/purple-puzzle.svg`}
                    width="20px"
                    height="25px"
                    className="icon"
                    margin="0 20px 0 0"
                  />
                  <div className="name">{folder.name}</div>
                </div>
              ))
            )}

            <div className="item-subtitle">Juegos (0)</div>

            <div className="empty-message">No cuentas con juegos</div>
          </div>
        </>
      )}
    </TabletLibraryContainer>
  );
};

const TabletLibraryContainer = styled.div`
  width: 100%;

  .subtitle {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0.5rem;
    color: ${(props) => props.theme.basic.white};
    background: ${(props) => props.theme.basic.primary};
  }

  .main-content {
    padding: 1rem;

    .item {
      padding: 0 1rem;
      display: flex;
      align-items: center;
      width: 100%;
      height: 42px;
      background: ${(props) => props.theme.basic.whiteLight};
      border: 0.5px solid ${(props) => props.theme.basic.secondaryLight};
      box-sizing: border-box;
    }

    .folder {
      margin: 10px auto;
    }

    .games {
      border-radius: 3px 3px 0px 0px;
    }

    .favorites {
      border-radius: 0px 0px 3px 3px;
    }

    .item-subtitle {
      font-family: "Lato", sans-serif;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
    }

    .empty-message {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 13px;
      line-height: 16px;
      padding: 1rem;
    }
  }
`;

const ToolTipContent = styled.div`
  padding: 0.5rem;

  .option {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.basic.grayLight};
    font-size: 13px;
    line-height: 16px;
  }
`;
