import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { ButtonAnt, Checkbox } from "../../components/form";
import { config, firestore } from "../../firebase";
import { Tooltip } from "antd";
import { darkTheme } from "../../theme";
import get from "lodash/get";
import capitalize from "lodash/capitalize";
import moment from "moment";
import { Desktop, mediaQuery } from "../../constants";
import { useRouter } from "next/router";
import { useSendError, useTranslation } from "../../hooks";
import { useFetch } from "../../hooks/useFetch";

export const ListGameView = (props) => {
  const router = useRouter();

  const { t } = useTranslation("pages.library");

  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");
  const [games, setGames] = useGlobal("userGames");

  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchResource = () =>
      firestore
        .collection("games")
        .doc(props.game.adminGameId)
        .onSnapshot(async (resourceSnap) => {
          setResource(resourceSnap.data());
        });

    const unsubscribeResource = fetchResource();

    return () => unsubscribeResource && unsubscribeResource();
  }, []);

  const getTimeCreation = () => {
    const still = moment();
    const time = moment(still).diff(moment(props.game.createAt));

    const newTime = moment.duration(time);

    return newTime.days() > 0
      ? `${t("created-ago")} ${newTime.days()} día${newTime.days() > 1 ? "s" : ""}`
      : newTime.hours() > 0
      ? `${t("created-ago")} ${newTime.hours()} hora${newTime.hours() > 1 ? "s" : ""}`
      : `${t("created-ago")} ${newTime.minutes()} minutos`;
  };

  const toggleFavorite = async () => {
    let newGames = games;
    const gameIndex = newGames.findIndex((game) => game.id === props.game.id);

    newGames[gameIndex].isFavorite = !get(newGames[gameIndex], "isFavorite", false);

    setGames(newGames);

    try {
      await Fetch(`${resource.api}/games/${props.game.id}/users/${authUser.id}`, "PUT", {
        isFavorite: newGames[gameIndex].isFavorite,
      });
    } catch (error) {
      await sendError(error, "createGame");
    }
  };

  const deleteGame = async () => {
    let newGames = games;
    const gameIndex = newGames.findIndex((game) => game.id === props.game.id);
    newGames.splice(gameIndex, 1);
    setGames(newGames);

    try {
      await Fetch(`${resource.api}/games/${props.game.id}/users/${authUser.id}`, "DELETE");
    } catch (error) {
      await sendError(error, "deleteGame");
    }
  };

  const createTokenToPlay = async () => {
    setIsLoading(true);
    try {
      const gameName = props.game.adminGame.name.toLowerCase();
      const redirectUrl = `${config.bomboGamesUrl}/${gameName}/lobbies/new?gameId=${props.game.id}&userId=${authUser?.id}`;

      window.open(redirectUrl, "blank");
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const redirectToGameView = () => {
    get(props, "game.parentId", null)
      ? router.push(
          `/library/games/${props.game.id}/view?adminGameId=${props.game.adminGameId}&folderId=${props.game.parentId}`
        )
      : router.push(`/library/games/${props.game.id}/view?adminGameId=${props.game.adminGameId}`);
  };

  // Codigo es ilegible, considere refactorizar/dividir en pequeñas porciones
  return (
    <>
      {props.listType === "icons" && (
        <IconsContainer>
          <Image
            src={
              get(props, "game.coverImgUrl", null) ??
              `${config.storageUrl}/resources/games/${get(props, "game.adminGame.name", "")}.png`
            }
            width="91px"
            height="65px"
            desktopWidth="164px"
            desktopHeight="141px"
            margin="0"
            size="cover"
            borderRadius="4px 0px 0px 4px"
            cursor="pointer"
            onClick={() => redirectToGameView()}
          />

          <div className="main-content">
            <div className="description">
              <div className="name" onClick={() => redirectToGameView()}>
                {props.game.name}
              </div>

              <div className="right-content">
                {props.game.isFavorite ? (
                  <Image
                    src={`${config.storageUrl}/resources/yellow-star.svg`}
                    width="20px"
                    height="20px"
                    className="icon"
                    margin="0 20px 0 0"
                    onClick={() => toggleFavorite()}
                  />
                ) : (
                  <Image
                    src={`${config.storageUrl}/resources/star.svg`}
                    width="20px"
                    height="20px"
                    className="icon"
                    margin="0 20px 0 0"
                    onClick={() => toggleFavorite()}
                  />
                )}
                <Tooltip
                  placement="bottomRight"
                  trigger="click"
                  title={
                    <ToolTipContent>
                      <div className="option" onClick={() => props?.initModalMove(true)}>
                        <Image
                          src={`${config.storageUrl}/resources/move.svg`}
                          width={"16px"}
                          height={"16px"}
                          size={"contain"}
                          margin={"0 15px 0 0"}
                        />
                        {t("move")}
                      </div>
                      <div className="option" onClick={() => deleteGame()}>
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
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between py-2 px-4 bg-whiteDark rounded-[0_0_5px_0]">
              <Desktop>
                <div className="bg-gray rounded-[6px] flex items-center p-2">
                  <Image
                    src={`${config.storageUrl}/resources/games/${get(props, "game.adminGame.name", "")}-icon.svg`}
                    height={"20px"}
                    width={"20px"}
                    borderRadius={get(props, "game.adminGame.name", "") === "hanged" ? "0" : "50%"}
                    margin={"0 5px 0 0"}
                    size="contain"
                  />

                  <div className="text-['Lato'] font-[400] text-[12px] leading-[14px] text-grayLight">
                    {capitalize(get(props, "game.adminGame.title", ""))}
                  </div>
                </div>
              </Desktop>

              <div className="flex items-center text-['Lato'] text-[13px] leading-[16px] text-grayLight">
                {getTimeCreation()}{" "}
                <div className="ml-[10px] flex items-center">
                  <div className="w-[5px] h-[5px] bg-grayLight rounded-[50%] mr-[10px]" />
                  <div className="font-bold">{props?.game?.countPlays ?? 0} reproducciones</div>
                </div>
                <Desktop>
                  <div className="flex items-center justify-around">
                    <ButtonAnt
                      variant="contained"
                      color="secondary"
                      margin="0 1rem"
                      loading={isLoading}
                      onClick={() => {
                        try {
                          setIsLoading(true);

                          const adminGameId = props.game.adminGameId ?? props.game.adminGame.id;

                          const url = get(props, "game.parentId", null)
                            ? `/library/games/${props.game.id}?adminGameId=${adminGameId}&folderId=${props.game.parentId}`
                            : `/library/games/${props.game.id}?adminGameId=${adminGameId}`;

                          router.push(url);

                          setIsLoading(false);
                        } catch (error) {
                          props.showNotification("Error", "Algo salio mal. Por favor intenta nuevamente.");
                          sendError(error, "action edit game");
                          router.back();
                        }
                      }}
                    >
                      {t("edit")}
                    </ButtonAnt>
                    <ButtonAnt variant="contained" color="primary" loading={isLoading} onClick={createTokenToPlay}>
                      {t("play")}
                    </ButtonAnt>
                  </div>
                </Desktop>
              </div>
            </div>
          </div>
        </IconsContainer>
      )}

      {props.listType === "list" && (
        <ListContainer>
          <div className="left-content">
            <div className="select">
              <Checkbox />
            </div>
            <div className="description">{props.game.name}</div>
          </div>

          <div className="right-content">
            <ButtonAnt
              variant="contained"
              color="secondary"
              margin="0 1rem"
              onClick={() => {
                get(props, "game.parentId", null)
                  ? router.push(
                      `/library/games/new?adminGameId=${props.game.adminGameId}&folderId=${props.game.parentId}`
                    )
                  : router.push(`/library/games/${props.game.id}?adminGameId=${props.game.adminGameId}`);
              }}
            >
              {t("edit")}
            </ButtonAnt>
            <ButtonAnt variant="contained" color="primary" margin="0 1rem" onClick={createTokenToPlay}>
              {t("play")}
            </ButtonAnt>
            {props.game.isFavorite ? (
              <Image
                src={`${config.storageUrl}/resources/yellow-star.svg`}
                width="20px"
                height="20px"
                className="icon"
                margin="0 20px 0 0"
                onClick={() => toggleFavorite()}
              />
            ) : (
              <Image
                src={`${config.storageUrl}/resources/star.svg`}
                width="20px"
                height="20px"
                className="icon"
                margin="0 20px 0 0"
                onClick={() => toggleFavorite()}
              />
            )}
            <Tooltip
              placement="bottomLeft"
              trigger="click"
              title={
                <ToolTipContent>
                  <div className="option" onClick={() => props.setIsVisibleModalMove(true)}>
                    <Image
                      src={`${config.storageUrl}/resources/move.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    {t("move")}
                  </div>
                  <div className="option" onClick={() => deleteGame()}>
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
              <div className="more">
                <div />
                <div />
                <div />
              </div>
            </Tooltip>
          </div>
        </ListContainer>
      )}
    </>
  );
};

const ToolTipContent = styled.div`
  padding: 0.5rem;

  .option {
    display: flex;
    align-items: center;
    color: ${(props) => props.theme.basic.grayLight};
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    padding: 0.5rem;
    cursor: pointer;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  height: 52px;
  margin: 1rem 0;

  .left-content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.black};
      margin-left: 1rem;
    }
  }

  .right-content {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .more {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      height: 18px;

      div {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: ${(props) => props.theme.basic.black};
      }
    }
  }
`;

const IconsContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};
  display: grid;
  grid-template-columns: 91px auto;
  align-items: center;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  margin: 1rem 0;
  cursor: pointer;

  ul {
    margin: 0 !important;
  }

  .select {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-content {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 0 !important;

    .description {
      font-weight: bold;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.black};
      padding: 10px;
      display: grid;
      align-items: flex-start;
      grid-template-columns: 80% 20%;
      height: 80%;

      ${mediaQuery.afterTablet} {
        grid-template-columns: 90% 10%;
      }

      .name {
        height: 100%;
        cursor: pointer;
      }

      .right-content {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
      }

      .right {
        width: 10px;
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

  ${mediaQuery.afterTablet} {
    grid-template-columns: 164px auto;

    .main-content {
      .description {
        padding: 1rem;
        font-size: 15px;
        line-height: 18px;
        color: ${(props) => props.theme.basic.black};
      }
    }
  }
`;
