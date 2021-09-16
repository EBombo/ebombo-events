import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { ButtonAnt } from "../../components/form";
import { Tooltip } from "antd";
import { darkTheme } from "../../theme";
import { ModalNewFolder } from "./ModalNewFolder";
import { ModalNewGame } from "./ModalNewGame";
import { ListGameView } from "./ListGameView";
import { spinLoaderMin } from "../../components/common/loader";

export const TabletLibrary = (props) => {
  const router = useRouter();
  const [isVisibleModalGame, setIsVisibleModalGame] = useState(false);
  const [isVisibleModalFolder, setIsVisibleModalFolder] = useState(false);
  const [folder, setFolder] = useState(null);
  const [loadingGames] = useGlobal("loadingGames");
  const [games] = useGlobal("games");

  const getGames = () => {
    if (router.asPath.includes("/favorites"))
      return games.filter((game) => !!game.isFavorite);

    return games;
  };

  return (
    <TabletLibraryContainer>
      {isVisibleModalFolder && (
        <ModalNewFolder
          {...props}
          folder={folder}
          isVisibleModalFolder={isVisibleModalFolder}
          setIsVisibleModalFolder={setIsVisibleModalFolder}
        />
      )}
      {isVisibleModalGame && (
        <ModalNewGame
          {...props}
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
              <div className="left">
                <Image
                  src={`${config.storageUrl}/resources/purple-puzzle.svg`}
                  width="20px"
                  height="25px"
                  className="icon"
                  margin="0 20px 0 0"
                />
                <div className="name">Mis juegos</div>
              </div>
            </div>
            <div
              className="item favorites"
              onClick={() => router.push("/library/favorites")}
            >
              <div className="left">
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
          </div>
        </>
      )}
      {router.asPath.includes("/library/") && (
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
                <div key={folder.id} className="item games folder">
                  <div
                    className="left"
                    onClick={() => router.push(`/library/folders/${folder.id}`)}
                  >
                    <Image
                      src={`${config.storageUrl}/resources/purple-folder.svg`}
                      width="20px"
                      height="25px"
                      className="icon"
                      margin="0 20px 0 0"
                    />
                    <div className="name">{folder.name}</div>
                  </div>
                  <Tooltip
                    placement="bottomRight"
                    trigger="click"
                    title={
                      <ToolTipContentOptions>
                        <div
                          className="folder-option"
                          onClick={() => {
                            setFolder(folder);
                            setIsVisibleModalFolder(true);
                          }}
                        >
                          <Image
                            src={`${config.storageUrl}/resources/edit-name.svg`}
                            width={"16px"}
                            height={"16px"}
                            size={"contain"}
                            margin={"0 15px 0 0"}
                          />
                          Cambiar Nombre
                        </div>
                        <div className="folder-option">
                          <Image
                            src={`${config.storageUrl}/resources/move.svg`}
                            width={"16px"}
                            height={"16px"}
                            size={"contain"}
                            margin={"0 15px 0 0"}
                          />
                          Mover
                        </div>
                        <div className="folder-option">
                          <Image
                            src={`${config.storageUrl}/resources/duplicate.svg`}
                            width={"16px"}
                            height={"16px"}
                            size={"contain"}
                            margin={"0 15px 0 0"}
                          />
                          Duplicar
                        </div>
                        <div
                          className="folder-option"
                          onClick={() => deleteFolder(folder)}
                        >
                          <Image
                            src={`${config.storageUrl}/resources/delete.svg`}
                            width={"16px"}
                            height={"16px"}
                            size={"contain"}
                            margin={"0 15px 0 0"}
                          />
                          Borrar
                        </div>
                      </ToolTipContentOptions>
                    }
                    color={darkTheme.basic.whiteLight}
                  >
                    <div className="right">
                      <div />
                      <div />
                      <div />
                    </div>
                  </Tooltip>
                </div>
              ))
            )}

            <div className="item-subtitle">Juegos ({props.games.length})</div>

            {loadingGames ? (
              spinLoaderMin()
            ) : isEmpty(props.games) ? (
              <div className="empty-message">No cuentas con juegos</div>
            ) : (
              getGames().map((game) => (
                <ListGameView
                  game={game}
                  key={game.id}
                  listType={"icons"}
                  {...props}
                />
              ))
            )}
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
      display: grid;
      align-items: center;
      grid-template-columns: 90% 10%;
      width: 100%;
      height: 42px;
      background: ${(props) => props.theme.basic.whiteLight};
      border: 0.5px solid ${(props) => props.theme.basic.secondaryLight};
      box-sizing: border-box;

      .left {
        display: flex;
        align-items: center;
      }
      .right {
        height: 18px;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;

        div {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${(props) => props.theme.basic.black};
        }
      }
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

const ToolTipContentOptions = styled.div`
  background: ${(props) => props.theme.basic.whiteLight};
  box-sizing: border-box;
  color: ${(props) => props.theme.basic.grayLight};

  .folder-option {
    display: flex;
    align-items: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    padding: 0.5rem;
    cursor: pointer;
  }
`;
