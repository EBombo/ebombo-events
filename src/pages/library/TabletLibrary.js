import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config, firestore } from "../../firebase";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { ButtonAnt } from "../../components/form";
import { Modal, Tooltip } from "antd";
import { darkTheme } from "../../theme";
import { ModalNewFolder } from "./ModalNewFolder";
import { ListGameView } from "./ListGameView";
import { spinLoaderMin } from "../../components/common/loader";
import { useSendError, useTranslation } from "../../hooks";
import { ModalMove } from "../../components/common/ModalMove";
import { updateGame } from "./games/_gameId";
import { Events } from "./events";
import { PopTypeGame } from "../../components/createGame/PopTypeGame";

export const TabletLibrary = (props) => {
  const router = useRouter();

  const { sendError } = useSendError();

  const { t } = useTranslation("pages.library");

  const [authUser] = useGlobal("user");
  const [games] = useGlobal("userGames");
  const [loadingGames] = useGlobal("loadingGames");

  const [folder, setFolder] = useState(null);
  const [selectedGameToMove, setSelectedGameToMove] = useState(null);
  const [isVisibleModalMove, setIsVisibleModalMove] = useState(false);
  const [isVisibleModalFolder, setIsVisibleModalFolder] = useState(false);

  useEffect(() => {
    router.prefetch("/library/games");
    router.prefetch("/library/favorites");
    router.prefetch("/library/events");
  }, []);

  const getGames = () => {
    if (router.asPath.includes("/favorites")) return games.filter((game) => !!game.isFavorite);

    return games;
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

  const moveGameToFolder = async (folder) => {
    if (!selectedGameToMove) return;

    try {
      await updateGame(selectedGameToMove.adminGame, { id: selectedGameToMove.id, parentId: folder?.id }, authUser);

      props.fetchGames();
    } catch (error) {
      await sendError(error, "moveGameToFolder");
    }
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

      <ModalMove
        moveToFolder={moveGameToFolder}
        setIsVisibleModalMove={setIsVisibleModalMove}
        isVisibleModalMove={isVisibleModalMove}
        {...props}
      />
      {router.asPath === "/library" && (
        <>
          <div className="subtitle">{t("library")}</div>
          <div className="main-content">
            <div className="recents">{t("recent")}</div>
            <div className="most-recent" />
            <div
              className="item games"
              onClick={(e) => {
                e.preventDefault();
                router.push("/library/games");
              }}
            >
              <div className="left">
                <Image
                  src={`${config.storageUrl}/resources/purple-puzzle.svg`}
                  width="20px"
                  height="25px"
                  className="icon"
                  margin="0 20px 0 0"
                />
                <div className="name">{t("activities")}</div>
              </div>
            </div>
            <div
              className="item favorites"
              onClick={(e) => {
                e.preventDefault();
                router.push("/library/favorites");
              }}
            >
              <div className="left">
                <Image
                  src={`${config.storageUrl}/resources/purple-star.svg`}
                  width="20px"
                  height="25px"
                  className="icon"
                  margin="0 20px 0 0"
                />
                <div className="name">{t("favorites")}</div>
              </div>
            </div>
            <div
              className="item favorites"
              onClick={(e) => {
                e.preventDefault();
                router.push("/library/events");
              }}
            >
              <div className="left">
                <Image
                  src={`${config.storageUrl}/resources/calendar-purple-icon.svg`}
                  width="20px"
                  height="25px"
                  className="icon"
                  margin="0 20px 0 0"
                />
                <div className="name">{t("events")}</div>
              </div>
            </div>
          </div>
        </>
      )}

      {router.asPath.includes("/events") && <Events {...props} />}

      {router.asPath.includes("/library/") && !router.asPath.includes("/events") && (
        <>
          <div className="subtitle">
            {t("activities")}
            <Tooltip
              placement="bottomLeft"
              trigger="click"
              title={
                <ToolTipContent>
                  <PopTypeGame>
                    <div className="option">
                      <Image
                        src={`${config.storageUrl}/resources/purple-puzzle.svg`}
                        width="20px"
                        height="25px"
                        className="icon"
                        margin="0 20px 0 0"
                        filter="grayscale(100%)"
                      />
                      {t("create-game")}
                    </div>
                  </PopTypeGame>

                  <div className="option" onClick={() => setIsVisibleModalFolder(true)}>
                    <Image
                      src={`${config.storageUrl}/resources/purple-folder.svg`}
                      width="20px"
                      height="25px"
                      className="icon"
                      margin="0 20px 0 0"
                      filter="grayscale(100%)"
                    />
                    {t("create-folder")}
                  </div>
                </ToolTipContent>
              }
              color={darkTheme.basic.whiteLight}
            >
              <ButtonAnt variant="contained" color="secondary">
                {t("create")}
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
              {t("folder")} ({props.folders.length}) [{props.parent?.path}]
            </div>

            {isEmpty(props.folders) ? (
              <div className="empty-message">{t("folder-empty")}</div>
            ) : (
              props.folders.map((folder) => (
                <div key={folder.id} className="item games folder">
                  <div
                    className="left"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(`/library/folders/${folder.id}`);
                    }}
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
                          {t("rename")}
                        </div>
                        <div className="folder-option">
                          <Image
                            src={`${config.storageUrl}/resources/move.svg`}
                            width={"16px"}
                            height={"16px"}
                            size={"contain"}
                            margin={"0 15px 0 0"}
                          />
                          {t("move")}
                        </div>
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

            <div className="item-subtitle">
              {t("games")} ({props.games.length})
            </div>

            {loadingGames ? (
              spinLoaderMin()
            ) : isEmpty(props.games) ? (
              <div className="empty-message">{t("games-empty")}</div>
            ) : (
              getGames().map((game) => (
                <ListGameView
                  game={game}
                  key={game.id}
                  listType={"icons"}
                  initModalMove={(toggle) => {
                    setIsVisibleModalMove(toggle);
                    setSelectedGameToMove(game);
                  }}
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
