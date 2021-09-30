import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { ButtonAnt, Checkbox } from "../../components/form";
import { auth, config, firestore } from "../../firebase";
import { Tooltip } from "antd";
import { darkTheme } from "../../theme";
import get from "lodash/get";
import moment from "moment";
import { Desktop, mediaQuery } from "../../constants";
import { useRouter } from "next/router";
import { useSendError } from "../../hooks";
import { useFetch } from "../../hooks/useFetch";

export const ListGameView = (props) => {
  const [authUser] = useGlobal("user");
  const [games, setGames] = useGlobal("games");
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  useEffect(() => {
    const fetchResource = async () => {
      const resourceRef = await firestore
        .collection("games")
        .doc(props.game.resourceId)
        .get();
      setResource(resourceRef.data());
    };

    fetchResource();
  }, []);

  const getTimeCreation = () => {
    const still = moment();
    const time = moment(still).diff(moment(props.game.createAt));

    const newTime = moment.duration(time);

    return newTime.days() > 0
      ? `Creado hace ${newTime.days()} día${newTime.days() > 1 ? "s" : ""}`
      : newTime.hours() > 0
      ? `Creado hace ${newTime.hours()} hora${newTime.hours() > 1 ? "s" : ""}`
      : `Creado hace ${newTime.minutes()} minutos`;
  };

  const toggleFavorite = async () => {
    let newGames = games;
    const gameIndex = newGames.findIndex((game) => game.id === props.game.id);

    newGames[gameIndex].isFavorite = !get(
      newGames[gameIndex],
      "isFavorite",
      false
    );

    setGames(newGames);

    try {
      await Fetch(
        `${resource.domain}/api/games/${props.game.id}/users/${authUser.id}`,
        "PUT",
        {
          isFavorite: newGames[gameIndex].isFavorite,
        }
      );
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
      await Fetch(
        `${resource.domain}/api/games/${props.game.id}/users/${authUser.id}`,
        "PUT",
        {
          deleted: true,
        }
      );
    } catch (error) {
      await sendError(error, "createGame");
    }
  };

  const createTokenToPlay = async () => {
    setIsLoading(true);
    try {
      const tokenId = await auth.currentUser.getIdToken();

      const redirectUrl = `${props.game.adminGame.domain}/games/${props.game.id}?tokenId=${tokenId}`;

      window.open(redirectUrl, "blank");
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const redirectToGameView = () => {
    get(props, "game.parentId", null)
      ? router.push(
          `/library/games/${props.game.id}/view?resourceId=${props.game.resourceId}&folderId=${props.game.parentId}`
        )
      : router.push(
          `/library/games/${props.game.id}/view?resourceId=${props.game.resourceId}`
        );
  };

  return (
    <>
      {props.listType === "icons" && (
        <IconsContainer>
          <Image
            src={
              get(props, "game.coverImgUrl", null)
                ? get(props, "game.coverImgUrl", null)
                : `${config.storageUrl}/resources/empty-cover.svg`
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
                      <div className="option">
                        <Image
                          src={`${config.storageUrl}/resources/move.svg`}
                          width={"16px"}
                          height={"16px"}
                          size={"contain"}
                          margin={"0 15px 0 0"}
                        />
                        Mover
                      </div>
                      <div className="option" onClick={() => deleteGame()}>
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
            </div>
            <div className="bottom-container">
              <Desktop>
                <div className="company">
                  <Image
                    src={get(authUser, "company.imageUrl", "")}
                    height={"30px"}
                    width={"30px"}
                    borderRadius={"50%"}
                    margin={"0 5px 0 0"}
                    size="cover"
                  />
                  <div className="name">
                    {get(props, "game.company.name", "")}
                  </div>
                </div>
              </Desktop>
              <div className="dates">
                {getTimeCreation()}{" "}
                <ul>
                  <li>
                    <span>{props?.game?.countPlays ?? 0}</span>
                  </li>
                </ul>
              </div>
              <Desktop>
                <div className="btns-container">
                  <ButtonAnt
                    variant="contained"
                    color="secondary"
                    margin="0 1rem"
                    loading={isLoading}
                    onClick={() => {
                      setIsLoading(true);
                      get(props, "game.parentId", null)
                        ? router.push(
                            `/library/games/${props.game.id}?resourceId=${props.game.resourceId}&folderId=${props.game.parentId}`
                          )
                        : router.push(
                            `/library/games/${props.game.id}?resourceId=${props.game.resourceId}`
                          );
                      setIsLoading(false);
                    }}
                  >
                    Editar
                  </ButtonAnt>
                  <ButtonAnt
                    variant="contained"
                    color="primary"
                    loading={isLoading}
                    onClick={createTokenToPlay}
                  >
                    Jugar
                  </ButtonAnt>
                </div>
              </Desktop>
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
                      `/library/games/new?resourceId=${props.game.resourceId}&folderId=${props.game.parentId}`
                    )
                  : router.push(
                      `/library/games/${props.game.id}?resourceId=${props.game.resourceId}`
                    );
              }}
            >
              Editar
            </ButtonAnt>
            <ButtonAnt
              variant="contained"
              color="primary"
              margin="0 1rem"
              onClick={createTokenToPlay}
            >
              Jugar
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
                  <div className="option">
                    <Image
                      src={`${config.storageUrl}/resources/move.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    Mover
                  </div>
                  <div className="option" onClick={() => deleteGame()}>
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

    .bottom-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 25px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1rem;
      background: ${(props) => props.theme.basic.whiteDark};
      border-radius: 0px 0px 5px 0px;

      .company {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        .name {
          font-family: Lato;
          font-style: normal;
          font-weight: normal;
          font-size: 13px;
          line-height: 16px;
          color: ${(props) => props.theme.basic.grayLight};
        }
      }

      .dates {
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 11px;
        line-height: 13px;
        color: ${(props) => props.theme.basic.grayLight};
        display: flex;
        align-items: center;
        ul {
          margin: 0 0 0 10px;
          list-style-position: inside;

          span {
            position: relative;
            left: -5px;
          }
        }
      }

      .btns-container {
        display: flex;
        align-items: center;
        justify-content: space-around;
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

      .bottom-container {
        height: 45px;

        .dates {
          font-size: 13px;
          line-height: 16px;
        }
      }
    }
  }
`;
