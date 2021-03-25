import get from "lodash/get";
import {LEVELS} from "./DataList";
import styled from "styled-components";
import React from "reactn";
import {useLocation} from "react-router";
import {Image} from "./Image";

export const Game = (props) => {
  const location = useLocation();

  const isVs = () => location.pathname.includes("vs");

  const winRatio = () => {
    const matchesTotal = get(userGameStatistics(), "matchesTotal", 0);
    const wonMatches = get(userGameStatistics(), "wonMatches", 0);
    const loseMatches =
      matchesTotal - wonMatches <= 0 ? 1 : matchesTotal - wonMatches;

    return (wonMatches / loseMatches).toFixed(2);
  };

  const level = () =>
    LEVELS.find(
      (level) => level.number === get(userGameStatistics(), "level", 0)
    );

  const userGameStatistics = () => {
    const gamesStatistics = get(props.user, "gamesStatistics", []);

    return gamesStatistics.find(
      (gameStatistics) => gameStatistics.gameId === props.game.id
    );
  };

  return (
    <Container
      isVs={isVs()}
      onClick={() => props.onClick && props.onClick()}
      level={level()}
      image={get(
        props.game,
        [isVs() ? "historyImageDskUrlThumb" : "homeImageDskUrlThumb"],
        ""
      )}
      borderColor={`${get(props, "game.color", "")}80`}
    >
      <div className="information">
        <div className="game">
          <Image
            src={get(props, "game.iconUrlThumb", "-")}
            height="30px"
            width="30px"
          />
          <div className="name">{get(props.game, "name", "")}</div>
        </div>
        <div className="level">
          Level {get(userGameStatistics(), "level", 0)}
        </div>
        <div className="win-ratio">
          <span>ratio: </span>
          <span className="green">{winRatio()}</span>
        </div>
        {props.button && (
          <div className="button-container">
            <span className="green" onClick={props.button.onClick}>
              {props.button.content}
            </span>
          </div>
        )}
      </div>
      {props.dropdown && (
        <div className="dropdown">
          {props.dropdown.active ? <Triangle.Down /> : <Triangle.Right />}
        </div>
      )}
    </Container>
  );
};

const Triangle = {
  Up: styled.div`
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    border-bottom: 20px solid ${(props) => props.theme.basic.white};
  `,
  Down: styled.div`
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 15px solid transparent;
    border-top: 20px solid ${(props) => props.theme.basic.white};
  `,
  Right: styled.div`
    width: 0;
    height: 0;
    border-bottom: 15px solid transparent;
    border-top: 15px solid transparent;
    border-left: 20px solid ${(props) => props.theme.basic.white};
  `,
  Left: styled.div`
    width: 0;
    height: 0;
    border-bottom: 15px solid transparent;
    border-top: 15px solid transparent;
    border-right: 20px solid ${(props) => props.theme.basic.white};
  `,
};

const Container = styled.div`
  width: 100%;
  background-image: url(${(props) => props.image});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: ${(props) =>
    props.isVs ? "center center" : "center right"};
  margin: 1rem 0;
  border-top: 2px solid
    ${(props) =>
      props.borderColor ? props.borderColor : props.theme.basic.blackLighten};
  border-bottom: 2px solid
    ${(props) =>
      props.borderColor ? props.borderColor : props.theme.basic.blackLighten};

  .information {
    width: 100%;
    background: linear-gradient(
      291deg,
      transparent 0%,
      transparent,
      0%,
      rgba(0, 0, 0, 0.6) 0%,
      rgba(0, 0, 0, 0.6) 100%
    );

    display: flex;
    flex-direction: column;
    align-items: baseline;
    padding: 1rem 1.5rem;
    color: ${(props) => props.theme.basic.white};

    .game {
      display: flex;
      align-items: center;
      margin-bottom: 0.2rem;

      .name {
        color: ${(props) => props.theme.basic.white};
        margin-left: 10px !important;
        font-weight: 600;
        font-size: 13px;
        line-height: 16px;
      }
    }

    .level {
      margin-bottom: 0.2rem;
      color: ${(props) => get(props.level, "color", props.theme.basic.white)};
    }

    .win-ratio {
      margin-bottom: 0.2rem;
      color: ${(props) => props.theme.basic.white};
      display: flex;
      align-items: center;
      justify-content: center;
      .green {
        margin-left: 5px;
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }

  .dropdown {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 1.5rem 2rem;
  }

  .button-container {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    span {
      font-size: 12px;
      line-height: 14px;
      color: ${(props) => props.theme.basic.primary};
      cursor: pointer;
    }
  }
`;
