import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ButtonAnt, Input } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalNewFolder } from "./ModalNewFolder";
import { config, firestore } from "../../firebase";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { ListGameView } from "./ListGameView";
import { darkTheme } from "../../theme";
import { Modal, Tooltip } from "antd";
import { useSendError, useTranslation } from "../../hooks";
import { ModalMove } from "../../components/common/ModalMove";
import { updateGame } from "./games/_gameId";
import { PopTypeGame } from "../../components/createGame/PopTypeGame";

export const DesktopLibraryFolders = (props) => {
  const router = useRouter();

  const { sendError } = useSendError();

  const { t } = useTranslation("pages.library");

  const [authUser] = useGlobal("user");
  const [loadingGames] = useGlobal("loadingGames");

  const [folder, setFolder] = useState(null);
  const [listType, setListType] = useState("icons");
  const [selectedGameToMove, setSelectedGameToMove] = useState(null);
  const [isVisibleModalMove, setIsVisibleModalMove] = useState(false);
  const [isVisibleModalFolder, setIsVisibleModalFolder] = useState(false);

  const moveGameToFolder = async (folder) => {
    if (!selectedGameToMove) return;

    try {
      await updateGame(selectedGameToMove.adminGame, { id: selectedGameToMove.id, parentId: folder?.id }, authUser);

      props.fetchGames();
    } catch (error) {
      await sendError(error);
    }
  };

  const deleteFolder = async (folder) => {
    Modal.confirm({
      title: "¿Seguro que quieres eliminar este folder y su contenido?",
      content: "No se podrá revertir el cambio una vez eliminado el folder y su contenido.",
      okText: "Eliminar",
      async onOk() {
        try {
          await firestore.doc(`folders/${folder.id}`).update({
            deleted: true,
          });
        } catch (error) {
          console.error(error);
          sendError(error, "deleteFolder");
        }
      },
      onCancel() {},
    });
  };

  return (
    <FoldersContainer>
      <ModalMove
        moveToFolder={moveGameToFolder}
        setIsVisibleModalMove={setIsVisibleModalMove}
        isVisibleModalMove={isVisibleModalMove}
        {...props}
      />

      {isVisibleModalFolder && (
        <ModalNewFolder
          {...props}
          folder={folder}
          isVisibleModalFolder={isVisibleModalFolder}
          setIsVisibleModalFolder={setIsVisibleModalFolder}
        />
      )}

      <div className="nav-container">
        <div className="path">{props.parent?.path}</div>

        <div className="list-type">
          <div className="search-bar">
            <Input type="search" placeholder={t("search")} />
          </div>

          <div className="folder-icon" onClick={() => setIsVisibleModalFolder(true)} />

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
          <div className="empty-message">{t("folder-empty")}</div>
        ) : (
          props.folders.map((folder) => (
            <div key={folder.id} className="folder">
              <div
                className="left"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/library/folders/${folder.id}`);
                }}
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
                      {t("rename")}
                    </div>
                    {/*
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
                    */}
                    <div className="folder-option">
                      <Image
                        src={`${config.storageUrl}/resources/duplicate.svg`}
                        width={"16px"}
                        height={"16px"}
                        size={"contain"}
                        margin={"0 15px 0 0"}
                      />
                      {t("duplicate")}
                    </div>
                    <div className="folder-option" onClick={() => deleteFolder(folder)}>
                      <Image
                        src={`${config.storageUrl}/resources/delete.svg`}
                        width={"16px"}
                        height={"16px"}
                        size={"contain"}
                        margin={"0 15px 0 0"}
                      />
                      {t("delete")}
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
          <PopTypeGame placement="top">
            <ButtonAnt variant="contained" color="primary" loading={loadingGames}>
              {t("create-game")}
            </ButtonAnt>
          </PopTypeGame>
        </div>
      ) : (
        <div className="games-container">
          {props.games.map((game) => (
            <ListGameView
              game={game}
              key={game.id}
              listType={listType}
              initModalMove={(toggle) => {
                setIsVisibleModalMove(toggle);
                setSelectedGameToMove(game);
              }}
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

      .folder-icon {
        width: 30px;
        height: 30px;
        margin: 0 25px;
        cursor: pointer;
        background-image: url(${`${config.storageUrl}/resources/folder.svg`});
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;

        :hover {
          background-image: url(${`${config.storageUrl}/resources/folder-hover.svg`});
        }
      }

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
        :hover:not(.active) {
          div {
            border-color: ${(props) => props.theme.basic.secondaryHover};
          }
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
        :hover:not(.active) {
          div {
            border-color: ${(props) => props.theme.basic.secondaryHover};
          }
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
