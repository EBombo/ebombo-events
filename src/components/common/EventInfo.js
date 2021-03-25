import React, {useEffect, useGlobal, useState} from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import {calculateAward} from "../../utils/CalculateAward";
import {mediaQuery} from "../../styles/constants";
import {RuleTooltip} from "./RuleTooltip";
import {spinLoader} from "../../utils";

export const EventInfo = (props) => {
  const currentCurrency = useGlobal("currentCurrency");
  const [globalSettings] = useGlobal("settings");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    props.challenge ? setEvent(props.challenge) : setEvent(props.match);
    setLoading(false);
  }, []);

  if (loading) return spinLoader();

  return (
    <Container>
      <div className="game-console">
        <div className="left">
          <h4>{get(event, "game.name", "")}</h4>
          <span>{get(event, "console.name", "")}</span>
        </div>
        <div className="right">
          {!event.tournamentId && (
            <>
              <span>Premio: </span>
              <h3>
                {currentCurrency}{" "}
                {calculateAward(
                  get(event, "gameEntryCost", 0),
                  globalSettings,
                  true
                ) * get(event, "rule.totalPlayers", 1)}
              </h3>
            </>
          )}
        </div>
      </div>
      <div className="rule">
        <div className="left">
          <span>Reglas:</span>
          <RuleTooltip rule={get(event, "rule", "")} />
        </div>
        <div className="right">
          {!event.tournamentId && (
            <>
              <span>Entrada:</span>
              <h4>
                {currentCurrency} {get(event, "gameEntryCost", "")}
              </h4>
            </>
          )}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  .game-console,
  .rule {
    padding: 1rem 1rem;
    border-bottom: 1px solid #404040;
  }

  .game-console {
    border-top: 1px solid #404040;
  }

  ${mediaQuery.afterTablet} {
    .game-console,
    .rule {
      padding: 1rem 2rem;
    }
  }

  .game-console {
    display: flex;
    justify-content: space-between;

    .left {
      h4 {
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        color: ${(props) => props.theme.basic.action};
        margin-bottom: 5px;
      }

      span {
        padding: 0 1rem;
        border: 1px solid #ff730d;
        box-sizing: border-box;
        border-radius: 1px;
        color: #ff730d;
        font-weight: bold;
        font-size: 10px;
        line-height: 12px;
      }
    }

    .right {
      display: flex;
      align-items: center;

      span {
        font-weight: 600;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
      }

      h3 {
        margin-left: 5px !important;
        font-weight: 600;
        font-size: 20px;
        line-height: 25px;
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }

  .rule {
    display: flex;
    justify-content: space-between;

    .left {
      span {
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
      }

      p {
        color: ${(props) => props.theme.basic.white};
        font-weight: normal;
        font-size: 14px;
        line-height: 17px;
        margin: 0;
      }
    }

    .right {
      display: flex;
      align-items: center;

      span {
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
      }

      h4 {
        margin-left: 5px !important;
        font-weight: 500;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
