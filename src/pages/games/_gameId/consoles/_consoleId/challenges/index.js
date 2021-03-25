import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { useHistory, useParams } from "react-router";
import { Games, GeneralInfo, WhiteSpace } from "../../../../../../components";
import { homeGlobal, layoutGeneral } from "../../../../../../styles/constants";
import { Desktop, Tablet } from "../../../../../../styles/utils";
import { Chat } from "../../../../../../components/chat/Chat";
import { ChallengesResults } from "./ChallengesResults";
import { BannerGame } from "./BannerGame";
import defaultTo from "lodash/defaultTo";
import { spinLoader } from "../../../../../../utils";

export const ChallengesContainer = (props) => {
  const [games] = useGlobal("games");
  const [consoles] = useGlobal("consoles");
  const [rules] = useGlobal("rules");
  const [gameRuleId, setGameRuleId] = useGlobal("gameRuleId");

  const [isVisibleCreateRoom, setIsVisibleCreateRoom] = useState(false);

  const history = useHistory();
  const { gameId, consoleId } = useParams();

  useEffect(() => {
    (!consoleId || !existConsole(defaultTo(gameId, games[0].id))) &&
      history.push(
        `/games/${defaultTo(
          gameId,
          games[0].id
        )}/consoles/${autoSelectConsoleId()}/challenges`
      );

    const currentRule = rules.filter(
      (rule) => rule.gameId === defaultTo(gameId, games[0].id)
    );

    setGameRuleId(get(currentRule, "[0].id", null));
  }, [gameId]);

  useEffect(() => {
    if (gameId && consoleId && gameRuleId)
      console.log(
        "Seleccion de games,console,rule->",
        gameId,
        consoleId,
        gameRuleId
      );
  }, [gameId, consoleId, gameRuleId]);

  const autoSelectConsoleId = () => {
    const currentGame = games.find(
      (game) => game.id === defaultTo(gameId, games[0].id)
    );

    return get(
      consoles.find((console_) => currentGame.consoleIds.includes(console_.id)),
      "id",
      null
    );
  };

  const existConsole = (gameId_) =>
    defaultTo(games, [])
      .find((game) => get(game, "id", null) === gameId_)
      .consoleIds.includes(consoleId);

  const currentGame = () => games.find((game) => game.id === gameId);

  const onClickGame = (game) =>
    history.push(`/games/${game.id}/consoles/${consoleId}/challenges`);

  if (!gameId || !consoleId || !gameRuleId) return spinLoader();

  return (
    <>
      <Desktop>
        <Games onClick={onClickGame} isDesktop>
          <LayoutDesktop>
            <div className="left-container">
              <BannerGame
                game={currentGame()}
                key={`key-room-game-change-${gameId}-${gameRuleId}`}
                {...props}
              />
              <div>
                <ChallengesResults {...props} />
              </div>
            </div>
            <div className="right-container second-step">
              <Chat key={gameId} chatId={gameId} showGames />
            </div>
          </LayoutDesktop>
          <GeneralInfo />
        </Games>
      </Desktop>
      <Tablet>
        {!isVisibleCreateRoom ? (
          <LayoutMobile
            game={currentGame()}
            isVisibleCreateRoom={isVisibleCreateRoom}
          >
            <Games onClick={onClickGame} />
            <div className="leagues-content">
              <BannerGame
                game={currentGame()}
                key={`key-room-game-change-${gameId}-${gameRuleId}`}
                {...props}
              />
              <ChallengesResults
                {...props}
                isDesktop={false}
                setIsVisibleCreateRoom={setIsVisibleCreateRoom}
                isVisibleCreateRoom={isVisibleCreateRoom}
              />
            </div>
            <div className="second-step">
              <Chat key={gameId} chatId={gameId} showGames />
            </div>
            <GeneralInfo />
          </LayoutMobile>
        ) : (
          <LayoutMobile
            game={currentGame()}
            isVisibleCreateRoom={isVisibleCreateRoom}
          >
            hello
          </LayoutMobile>
        )}
      </Tablet>
    </>
  );
};

const LayoutDesktop = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto 30%;
  height: 100vh;
  border-bottom: 2px solid ${(props) => props.theme.colorPrimary.darken_13};

  .right-container {
    background: ${(props) => props.theme.basic.blackLighten};
  }

  .left-container {
    overflow: auto;

    .grid-container {
      display: grid;
      grid-template-columns: 47% 6% 47%;
    }
  }
`;

const LayoutMobile = styled.section`
  .body-game-mobile {
    background-image: url("${(props) =>
      props.game ? props.game.homeImageMbUrlThumb : ""}");
    background-size: cover;
    padding: 0.3rem 0;
  }

  .content-layout-body {
    width: 71%;
    height: ${layoutGeneral.bodyHeight};
    min-height: ${layoutGeneral.bodyHeight};
    background: ${(props) => props.theme.basic.default};

    .container-sub-layout {
      display: flex;
      width: 100%;
      height: 100%;

      .container-leagues {
        width: 50%;
        overflow-y: scroll;
        height: 100%;
        padding: ${homeGlobal.padding_cards_desktop};
      }

      .container-information {
        width: 50%;
        overflow-y: scroll;
        height: 100%;
        padding: ${homeGlobal.padding_cards_desktop};
      }
    }
  }

  .leagues-content {
    width: 100%;
    padding: 0;
  }

  .span-buttons {
    display: flex;
    margin: 10px 0;

    .true-container {
      background: ${(props) => props.theme.basic.primary};
      color: ${(props) => props.theme.basic.blackDarken};
      padding: 0 20px;
    }

    .false-container {
      background: ${(props) => props.theme.basic.blackDarken};
      color: ${(props) => props.theme.basic.white};
      padding: 0 20px;
    }

    span {
      cursor: pointer;
      font-size: 12px;
      border-radius: 5px;
    }

    span:first-child {
      margin-right: 10px;
    }
  }
`;
