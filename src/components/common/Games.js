import React, {useEffect, useGlobal, useState} from "reactn";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import orderBy from "lodash/orderBy";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";
import {useParams} from "react-router";
import {config} from "../../firebase";
import UrlAssembler from "url-assembler";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../utils/useFetch/useFetch";
import {Anchor} from "./Anchor";

const allGames = {
  iconUrlThumb: `${config.storageUrl}/resources/open.svg`,
  name: "TODOS",
  id: "all",
};

export const Games = (props) => {
  const { gameId } = useParams();
  const [authUser] = useGlobal("user");
  const [games] = useGlobal("games");
  const [socialNetworks] = useGlobal("socialNetworks");
  const [, setCurrentGame] = useGlobal("currentGame");
  const [favoriteGameIds, setFavoriteGameIds] = useState(
    get(authUser, "favoriteGameIds", [])
  );

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    if (!get(authUser, "favoriteGameIds")) return;
    setFavoriteGameIds(get(authUser, "favoriteGameIds", []));
  }, [get(authUser, "favoriteGameIds")]);

  useEffect(() => {
    if (isEmpty(favoriteGameIds)) return;

    favoriteGameIds.map((gameId, index) => {
      let currentGame = games.find((game_) => game_.id === gameId);
      if (!currentGame) return;
      currentGame.index = index;
    });

    games
      .filter((game) => !favoriteGameIds.includes(game.id))
      .forEach((game) => delete game.index);
  }, [favoriteGameIds]);

  const orderGames = () =>
    (props.allGames ? [allGames] : []).concat(
      orderBy(games, ["index"], ["asc"])
    );

  const currentGame = () => games.find((game) => game.id === gameId);

  const currentGameId = () =>
    props.selectedGame ? props.selectedGame.id : defaultTo(gameId, games[0].id);

  const ContainerGames = props.isDesktop ? ContainerDesktop : ContainerMobile;

  const updateGames = (game) => {
    if (favoriteGameIds.includes(game.id)) {
      delete games.find((game_) => game_.id === game.id).index;
      return setFavoriteGameIds(
        favoriteGameIds.filter((gameId_) => gameId_ !== game.id)
      );
    }

    let currentGame = games.find((game_) => game_.id === game.id);
    currentGame.index = favoriteGameIds.length + 1;
    setFavoriteGameIds([...favoriteGameIds, game.id]);
  };

  const toggleFavoriteGame = async (game) => {
    updateGames(game);
    try {
      await ownFetch(urlApiFavoriteGame(authUser.id, game.id), "PUT");
    } catch (error) {
      handleError({ ...error, action: "toggleFavoriteGame" });
    }
  };

  const urlApiFavoriteGame = (userId, gameId) =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/users/:userId/games/:gameId")
      .param({
        userId,
        gameId,
      })
      .toString();

  return (
    <>
      <ContainerGames
        isDesktop={props.isDesktop}
        isFixed={props.isFixed}
        borderColor={get(currentGame(), "color")}
      >
        <div className="games-items first-step">
          {orderGames().map((game) => (
            <div
              className={`${
                currentGameId() === game.id ? "item selected" : "item"
              }`}
              onClick={() => {
                game.id === "all"
                  ? setCurrentGame(games[0])
                  : setCurrentGame(game);
                props.onClick(game);
              }}
              key={`${game.id}-${favoriteGameIds.length}`}
            >
              {get(game, "iconUrlThumb") && (
                <>
                  <img
                    src={get(game, "iconUrlThumb", "-")}
                    className="game-icon"
                    alt="vs"
                  />
                  {!isEmpty(authUser) && (
                    <div
                      onClick={() => toggleFavoriteGame(game)}
                      className="star-container"
                    >
                      {favoriteGameIds.includes(game.id) ? (
                        <IconStart
                          src={`${config.storageUrl}/resources/star-icon.svg`}
                        />
                      ) : (
                        <IconStart
                          src={`${config.storageUrl}/resources/star-icon-off.svg`}
                        />
                      )}
                    </div>
                  )}
                </>
              )}
              <span className="item-name"> {get(game, "name", "game")} </span>
            </div>
          ))}
        </div>
        {props.isDesktop && (
          <>
            <Divider />
            <div className="footer">
              <h2>Contáctanos</h2>
              <div className="redes">
                {socialNetworks.map((socialNetwork) => (
                  <div
                    className="redes-item"
                    onClick={() => window.open(socialNetwork.url, "_blank")}
                    id={socialNetwork.name}
                  >
                    <div className="footer-img-container">
                      <img
                        src={`${
                          config.storageUrl
                        }/resources/${socialNetwork.name.toLowerCase()}-white.svg`}
                        alt=""
                      />
                    </div>
                    <Anchor
                      textAlign="left"
                      fontSize="12px"
                      lineHeight="14px"
                      fontWeight="600"
                    >
                      {socialNetwork.name}
                    </Anchor>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </ContainerGames>
      <ChildrenContainer isDesktop={props.isDesktop}>
        {props.children}
      </ChildrenContainer>
    </>
  );
};

const Divider = styled.hr`
  border: none;
  width: 80%;
  height: 1px;
  margin: 0 auto;
  margin-top: 0.5rem;
  background-color: ${(props) => props.theme.basic.grayDarken};
`;

const IconStart = styled.img`
  font-size: 10px;
  position: absolute;
  top: 5%;
  left: 75%;
`;

const ChildrenContainer = styled.div`
  padding-left: ${(props) => (props.isDesktop ? "211px" : "0")};
`;

const ContainerMobile = styled.section`
  ${(props) =>
    props.isFixed
      ? `
  position: fixed;
  background: ${(props) => props.theme.basic.blackDarken};
  display: flex;
  align-items: center;
  justify-content: center;
  top: 64px;
  left: 0;
  right: 0;
  z-index: 999;
  overflow: auto;
 `
      : ""}

  height: 60px;
  width: 100%;

  ${mediaQuery.afterTablet} {
    height: 75px;
  }

  .games-items {
    height: 100%;
    overflow: auto;
    margin: 0 auto;
    display: -webkit-box;
    background: ${(props) => props.theme.basic.blackDarken};

    ::-webkit-scrollbar {
      display: none;
    }

    ::-webkit-scrollbar-thumb {
      display: none;
    }

    ${mediaQuery.afterTablet} {
      ::-webkit-scrollbar {
        width: 5px;
        display: block;
      }

      ::-webkit-scrollbar-track {
        background: transparent;
      }

      ::-webkit-scrollbar-thumb {
        background-color: ${(props) => props.theme.basic.grayDarken};
        border-radius: 5px;
        display: block;
      }
    }

    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: ${(props) => props.theme.basic.whiteDarken};
      cursor: pointer;
      min-width: 4.5rem;
      animation: ease-in 0.5s;

      ${(props) =>
        props.isDesktop
          ? ""
          : `border-bottom: 3px solid ${get(
              props,
              "borderColor",
              props.theme.basic.primary
            )}80;`}

      :hover {
        background-color: ${(props) => props.theme.basic.blackLighten}80;
      }

      .item-name {
        filter: brightness(0.6);
        color: ${(props) => props.theme.basic.whiteDarken};
        font-weight: bold;
        font-size: 10px;
        text-align: center;
        margin-top: 5px;
      }

      .game-icon {
        filter: brightness(0.6);
        width: 25px;
      }

      i {
        font-size: 18px;
      }

      svg {
        font-size: 10px;
      }
    }

    .selected {
      ${(props) =>
        props.isDesktop ? "" : `border-bottom: 3px solid ${props.borderColor};`}

      color: ${(props) => props.theme.basic.white};
      filter: none;

      background-color: ${(props) => props.theme.basic.default}80;

      :hover {
        background-color: ${(props) => props.theme.basic.default}80;
      }

      .game-icon {
        filter: brightness(1);
      }

      svg {
        color: ${(props) => props.theme.basic.action};
        font-size: 11px;
      }

      .item-name {
        color: ${(props) => props.theme.basic.white};
        filter: brightness(1);
      }
    }
  }
`;

const ContainerDesktop = styled(ContainerMobile)`
  position: fixed;
  background: ${(props) => props.theme.basic.blackDarken};
  height: 100%;
  width: 208px;
  top: 0;
  padding-top: 3rem;
  padding-right: 3px;
  align-items: flex-start;
  left: 0;
  z-index: 999;

  ::after {
    content: "";
    position: absolute;
    height: 100%;
    top: 0;
    right: -3px;
    border-right: 3px solid ${(props) => props.borderColor}80;
  }

  ${IconStart} {
    position: static;
  }

  .footer {
    height: 50%;
    overflow: auto;
    width: 100%;
    padding: 15px 20px 0 20px;

    h2 {
      font-weight: bold;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.white};
    }

    .redes {
      height: auto;
      margin-top: 15px;
      padding-bottom: 10px;

      .redes-item {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
        cursor: pointer;

        .footer-img-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 25px;
          height: 25px;
          background-color: ${(props) => props.theme.basic.blackLighten};
          border-radius: 5px;
          margin-right: 20px;
        }
      }
    }
  }

  .games-items {
    padding: 10px 0 0 0;
    height: 50%;

    .item {
      i {
        ${mediaQuery.afterMobile} {
          font-size: 30px;
        }
      }
    }

    .selected {
      img {
        ${mediaQuery.afterMobile} {
          font-size: 30px;
        }
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .games-items {
      display: flex;
      flex-direction: column;
      background: none;
      width: 100%;

      .item {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        min-height: 45px;
        padding: 15px 10px;

        .item-name {
          margin-left: 10px;
          font-size: 12px;
          font-weight: bold;
          color: ${(props) => props.theme.basic.whiteDarken};
        }

        .star-container {
          order: 2;
          margin-left: auto;
          margin-right: 5px;
        }
      }

      .selected {
        .item-name {
          color: ${(props) => props.theme.basic.white};
        }

        &:after {
          border-bottom: none;
        }
      }
    }
  }
`;
