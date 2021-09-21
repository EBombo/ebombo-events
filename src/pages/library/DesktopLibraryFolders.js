import React, { useState, useGlobal } from "reactn";
import styled from "styled-components";
import { Input, ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalNewFolder } from "./ModalNewFolder";
import { ModalNewGame } from "./ModalNewGame";
import { config, firestore } from "../../firebase";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { ListGameView } from "./ListGameView";
import { darkTheme } from "../../theme";
import { Tooltip } from "antd";
import { useSendError } from "../../hooks";

export const DesktopLibraryFolders = (props) => {
  const [loadingGames] = useGlobal("loadingGames");
  const [listType, setListType] = useState("icons");
  const [isVisibleModalGame, setIsVisibleModalGame] = useState(false);
  const [isVisibleModalFolder, setIsVisibleModalFolder] = useState(false);
  const [folder, setFolder] = useState(null);
  const router = useRouter();
  const { sendError } = useSendError();

  const deleteFolder = async (folder) => {
    try {
      await firestore.doc(`folders/${folder.id}`).update({
        deleted: true,
      });
    } catch (error) {
      console.error(error);
      sendError(error, "deleteFolder");
    }
  };

  return (
    <FoldersContainer>
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
      <div className="nav-container">
        <div className="path">{props.parent?.path}</div>

        <div className="list-type">
          <div className="search-bar">
            <Input type="search" placeholder="Buscar" />
          </div>
          <Image
            src={`${config.storageUrl}/resources/folder.svg`}
            height={"30px"}
            width={"30px"}
            size={"contain"}
            margin={"0 25px"}
            cursor={"pointer"}
            onClick={() => setIsVisibleModalFolder(true)}
          />
          {/*<Image*/}
          {/*  src={`${config.storageUrl}/resources/social.svg`}*/}
          {/*  height={"30px"}*/}
          {/*  width={"30px"}*/}
          {/*  size={"contain"}*/}
          {/*  margin={"0 5px"}*/}
          {/*  onClick={() => setIsVisibleModalFolder(true)}*/}
          {/*/>*/}

          <div className="icons" onClick={() => setListType("icons")}>
            <div className={`${listType === "icons" ? "active" : ""}`} />
            <div className={`${listType === "icons" ? "active" : ""}`} />
          </div>
          <div className="list" onClick={() => setListType("list")}>
            <div className={`${listType === "list" ? "active" : ""}`} />
            <div className={`${listType === "list" ? "active" : ""}`} />
            <div className={`${listType === "list" ? "active" : ""}`} />
          </div>
        </div>
      </div>
      <div className="folders-container">
        {isEmpty(props.folders) ? (
          <div className="empty-message">No cuentas con folders</div>
        ) : (
          props.folders.map((folder) => (
            <div key={folder.id} className="folder">
              <div
                className="left"
                onClick={() => router.push(`/library/folders/${folder.id}`)}
              >
                <Image
                  src={`${config.storageUrl}/resources/folder-black.svg`}
                  width="20px"
                  height="25px"
                  className="icon"
                  margin="0 10px 0 0"
                />
                <div className="name">{folder.name}</div>
              </div>
              <Tooltip
                placement="bottomRight"
                trigger="click"
                title={
                  <ToolTipContent>
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
                  </ToolTipContent>
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
      </div>
      {isEmpty(props.games) ? (
        <div className="btn-container">
          <ButtonAnt
            variant="contained"
            color="primary"
            onClick={() => setIsVisibleModalGame(true)}
            loading={loadingGames}
          >
            Crear juego
          </ButtonAnt>
        </div>
      ) : (
        <div className="games-container">
          {props.games.map((game) => (
            <ListGameView
              game={game}
              key={game.id}
              listType={listType}
              {...props}
            />
          ))}
        </div>
      )}
    </FoldersContainer>
  );
};

const FoldersContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background: ${(props) => props.theme.basic.whiteDark};
  height: 100%;
  overflow: auto;

  .btn-container {
    width: 100%;
    height: 300px;
    border: 3px dashed ${(props) => props.theme.basic.grayLighten};
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .games-container {
    width: 100%;
  }

  .folders-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 280px));
    grid-gap: 1rem;
    margin: 2rem 0;

    .folder {
      display: grid;
      align-items: center;
      grid-template-columns: 220px auto;
      background: ${(props) => props.theme.basic.whiteLight};
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      height: 45px;
      padding: 0 1rem;
      cursor: pointer;

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
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-bar {
      width: 250px;
    }

    .list-type {
      display: flex;
      align-items: center;

      .icons {
        margin-right: 5px;
        cursor: pointer;
        div {
          border: 2px solid ${(props) => props.theme.basic.grayLighten};
          box-sizing: border-box;
          border-radius: 3px;
          width: 35px;
          height: 15px;
          margin-bottom: 2px;
        }

        .active {
          border: 2px solid ${(props) => props.theme.basic.secondary};
        }
      }

      .list {
        cursor: pointer;
        div {
          border: 2px solid ${(props) => props.theme.basic.grayLighten};
          box-sizing: border-box;
          border-radius: 3px;
          width: 35px;
          height: 9px;
          margin-bottom: 2px;
        }

        .active {
          border: 2px solid ${(props) => props.theme.basic.secondary};
        }
      }
    }
  }
`;

const ToolTipContent = styled.div`
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
