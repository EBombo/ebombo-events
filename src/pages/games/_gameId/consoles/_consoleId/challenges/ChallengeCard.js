import React, { useGlobal } from "reactn";
import get from "lodash/get";
import styled from "styled-components";
import { useHistory, useParams } from "react-router";
import { Levels } from "../../../../../../components";
import { calculateAward } from "../../../../../../utils/CalculateAward";
import { UserImageProfile } from "../../../../../../components/users/UserImageProfile";
import { GameConsole } from "../../../../../../components/common/GameConsole";
import { Desktop, Tablet } from "../../../../../../utils";
import { mediaQuery } from "../../../../../../styles/constants";
import moment from "moment";
import { Icon } from "../../../../../../components/common/Icons";
import { config } from "../../../../../../firebase";
import { RuleTooltip } from "../../../../../../components/common/RuleTooltip";
import { Anchor } from "../../../../../../components/common/Anchor";

export const ChallengeCard = (props) => {
  const { gameId } = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [currentCurrency] = useGlobal("currentCurrency");
  const [settings] = useGlobal("settings");

  const getTime = () => {
    const still = moment();
    const time = moment(still).diff(moment(props.challenge.createAt.toDate()));

    const newTime = moment.duration(time);

    return newTime.days() > 0
      ? `Publicado hace ${newTime.days()} día${newTime.days() > 1 ? "s" : ""}`
      : newTime.hours() > 0
      ? `Publicado hace ${newTime.hours()} hora${
          newTime.hours() > 1 ? "s" : ""
        }`
      : newTime.minutes() >= 30
      ? `Publicado hace ${newTime.minutes()} minutos`
      : "";
  };

  return (
    <Container>
      <div className="left-cont">
        <div className="row-primary">
          <div className="card-header">
            <div className="user-img">
              <UserImageProfile
                url={
                  props.challenge.challenger.profileImageUrlThumb
                    ? props.challenge.challenger.profileImageUrlThumb
                    : `${config.storageUrl}/resources/perfil-icon.svg`
                }
              />
              <Levels
                gamesStatistics={get(
                  props.challenge,
                  "challenger.gamesStatistics",
                  []
                )}
                gameId={gameId}
                border={true}
                key={gameId}
                style={{
                  fontSize: "9px",
                  position: "absolute",
                  bottom: 0,
                  right: -5,
                }}
                isRounded
              />
            </div>
            <div className="user-info">
              <div
                className={`user-nickname ${
                  get(props.challenge, "challenger.id") ===
                    get(authUser, "id", null) && "my-match"
                }`}
              >
                {get(props.challenge, "challenger.nickname", "-")}
              </div>
              <div className="game-name">
                {get(props, "challenge.game.name", "")}
              </div>
            </div>
          </div>
          <div className="game-info">
            <RuleTooltip rule={get(props, "challenge.rule", "")} />
            <GameConsole
              gameConsole={get(props, "challenge.console", "")}
              style={{ fontSize: "9px" }}
            />
          </div>
          <div className="money-section">
            <div className="challenge-entry-cost">
              Entrada:{" "}
              {get(props.challenge, "realMoney", true)
                ? `${currentCurrency} ${get(
                    props.challenge,
                    "gameEntryCost",
                    0
                  )}`
                : `${get(props.challenge, "gameEntryCost", 0)}K`}{" "}
              <span>|</span>
            </div>
            <div className="challenge-prize">
              Ganador:{" "}
              {get(props.challenge, "realMoney", true)
                ? `${currentCurrency} ${calculateAward(
                    get(props.challenge, "gameEntryCost", 0),
                    settings,
                    get(props.challenge, "realMoney", true)
                  )}`
                : `${calculateAward(
                    get(props.challenge, "gameEntryCost", 0),
                    settings,
                    get(props.challenge, "realMoney", true)
                  )}K`}
            </div>
          </div>
        </div>
      </div>
      <div className="published-time">{getTime()}</div>

      <div
        className="right-cont"
        onClick={() =>
          history.push(
            `/games/${gameId}/consoles/${get(
              props,
              "challenge.console.id",
              ""
            )}/challenges/${get(props, "challenge.id", "")}`
          )
        }
      >
        <div className="award">
          {get(props.challenge, "realMoney", true)
            ? `${currentCurrency} ${calculateAward(
                get(props.challenge, "gameEntryCost", 0),
                settings,
                get(props.challenge, "realMoney", true)
              )}`
            : `${calculateAward(
                get(props.challenge, "gameEntryCost", 0),
                settings,
                get(props.challenge, "realMoney", true)
              )}K`}
        </div>
        <div className="row-redirect">
          <Desktop>
            <Anchor
              type="primary"
              margin="0px 10px 0px 2rem"
              className="view-challenge"
            >
              Ver Desafío
              <Icon type={"right"} className="icon-arrow" />
            </Anchor>
          </Desktop>
          <Tablet>
            <div>
              <Icon type={"right"} className="icon-arrow-tablet" />
            </div>
          </Tablet>
        </div>
        <div className="published-time-tablet no-wrap">{getTime()}</div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  ${mediaQuery.afterTablet} {
  }

  overflow: auto;
  display: grid;
  grid-template-columns: auto auto 15% 20%;
  background: inherit;
  width: 100%;
  padding-bottom: 1rem;
  border-radius: 2px;
  position: relative;

  .view-challenge {
    display: flex;
    align-items: center;
    padding-left: 2rem;
    padding-right: 10px;

    .icon-arrow {
      font-size: 20px;
      margin-left: 6px;
    }
  }

  .icon-arrow-tablet {
    padding-left: 10px;
  }

  .user-img {
    position: relative;
    margin-right: 8px;
  }

  .published-time {
    display: none;

    ${mediaQuery.afterTablet} {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.basic.whiteDarken};
    }
  }

  .left-cont {
    display: flex;
    justify-content: start;
    align-items: center;

    .row-primary {
      .card-header {
        display: flex;
        width: auto;
        height: 25px;

        .user-info {
          color: ${(props) => props.theme.basic.white};
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 5px;

          .user-nickname {
            font-size: 12px;
            color: ${(props) => props.theme.basic.white};
          }

          .game-name {
            font-size: 9px;
            color: ${(props) => props.theme.basic.whiteDarken};
          }

          .my-match {
            color: ${(props) => props.theme.basic.action};
          }
        }
      }

      .game-info {
        display: flex;
        align-items: center;
        margin-top: 8px;
        margin-bottom: 3px;
      }

      .money-section {
        display: flex;

        .challenge-entry-cost {
          span {
            margin: 0 5px;
          }
        }

        .challenge-entry-cost,
        .challenge-prize {
          color: ${(props) => props.theme.basic.whiteDarken};
          font-weight: 500;
          font-size: 11px;
          line-height: 12px;
        }

        .challenge-prize {
          color: ${(props) => props.theme.basic.primary};
        }
      }
    }
  }

  .right-cont {
    grid-column-end: span 3;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    position: relative;

    ${mediaQuery.afterTablet} {
      grid-column-end: span 2;
      font-size: 0.8rem;
      justify-content: space-between;
    }

    .published-time-tablet {
      position: absolute;
      bottom: 0;
      font-size: 10px;
      color: ${(props) => props.theme.basic.whiteDarken};

      ${mediaQuery.afterTablet} {
        display: none;
      }
    }

    .award {
      color: ${(props) => props.theme.basic.primary};
      font-weight: 500;
      font-size: 0.8rem;
      line-height: 15px;
    }
  }

  .row-primary {
    font-size: 10px;
    font-weight: 600;
    padding: 0.5rem 0;

    .item-user-name {
      font-size: 9px;
      color: ${(props) => props.theme.basic.white};
      padding: 0 0.5rem;
    }
  }

  .row-redirect {
    color: ${(props) => props.theme.basic.primary};
    cursor: pointer;
  }

  .items-states {
    display: flex;
    justify-content: center;
    align-items: center;

    .item {
      width: 8.86px;
      height: 10px;
      border-radius: 3px;
      margin: 0 0.3rem;
      background: ${(props) => props.theme.basic.white};

      &_red {
        width: 8.86px;
        height: 10px;
        border-radius: 3px;
        margin: 0 0.3rem;
        background: ${(props) => props.theme.basic.danger};
      }

      &_primary {
        width: 8.86px;
        height: 10px;
        border-radius: 3px;
        margin: 0 0.3rem;
        background: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
