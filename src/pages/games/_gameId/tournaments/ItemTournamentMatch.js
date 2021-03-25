import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { GameConsole } from "../../../../components/common/GameConsole";
import get from "lodash/get";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { useHistory } from "react-router";
import moment from "moment";
import { Icon } from "../../../../components/common/Icons";
import { Anchor } from "../../../../components/common/Anchor";
import { RuleTooltip } from "../../../../components/common/RuleTooltip";

export const ItemTournamentMatch = (props) => {
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const isChallenger = (userId) =>
    props.challengerIds.includes(userId) ? "challenged" : "challenger";

  return (
    <ItemTournamentMatchCss color={props.tournament.game.color}>
      <div className="item-team-name">
        <div className="li" />
        {props.tournament.name}
      </div>
      <div className="main-container">
        <div className="item-team-game-name">
          {props.game.name.toUpperCase()}
        </div>
        <div className="item-match-opponent">
          <Image
            margin="auto 0"
            height="30px"
            width="30px"
            size={
              props.rule.totalPlayers > 1
                ? props[`${isChallenger(authUser.id)}TeamImageUrlThumb`]
                  ? "cover"
                  : "contain"
                : props[`${isChallenger(authUser.id)}[0].profileImageUrlThumb`]
                ? "cover"
                : "contain"
            }
            src={
              props.rule.totalPlayers > 1
                ? props[`${isChallenger(authUser.id)}TeamImageUrlThumb`]
                  ? props[`${isChallenger(authUser.id)}TeamImageUrlThumb`]
                  : `${config.storageUrl}/resources/teams-default.svg`
                : props[`${isChallenger(authUser.id)}[0].profileImageUrlThumb`]
                ? props[`${isChallenger(authUser.id)}[0].profileImageUrlThumb`]
                : `${config.storageUrl}/resources/perfil-icon.svg`
            }
          />
          <div className="name">
            {props.tournament.rule.totalPlayers > 1
              ? props[`${isChallenger(authUser.id)}TeamName`]
              : props[isChallenger(authUser.id)][0].nickname}
          </div>
        </div>
        <div className="item-rule-console">
          <RuleTooltip rule={get(props, "rule", "")} />
          <GameConsole
            gameConsole={get(props, "console", "")}
            style={{ fontSize: "9px" }}
          />
        </div>
        <div className="dates-container">
          <div className="time-to-match">
            <div className="primary">Hora del partido:</div>
            {moment(props.createAt.toDate()).format("ddd DD MMM h:mm a")}
          </div>
          <div className="line-container">
            <Line />
          </div>
          <div className="time-to-expire">
            <div className="primary">Expira:</div>
            {moment(props.finishAt.toDate()).format("ddd DD MMM h:mm a")}
          </div>
        </div>
      </div>
      <Anchor
        type="primary"
        className="redirect"
        onClick={() => history.push(`/notifications/matches/${props.id}`)}
      >
        Ver <Icon type="right" />
      </Anchor>
    </ItemTournamentMatchCss>
  );
};

const Line = styled.div`
  width: 1px;
  height: 80%;
  background: ${(props) => props.theme.basic.white};
`;

const ItemTournamentMatchCss = styled.div`
  position: relative;
  padding: 0.5rem;
  margin-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

  .item-team-name {
    display: flex;
    font-weight: bold;

    .li {
      margin: auto 5px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      border: 1px solid ${(props) => props.color};
    }
  }
  .main-container {
    padding-left: 25px;

    .item-team-game-name {
      font-weight: bold;
      font-size: 11px;
      line-height: 13px;
      color: ${(props) => props.color};
      padding: 3px 0;
    }

    .item-rule-console {
      display: flex;
      align-items: center;
    }

    .dates-container {
      display: grid;
      grid-template-columns: 100px 10px 100px;
      align-items: center;
      margin: 0.5rem 0;
      .time-to-match,
      .time-to-expire {
        font-weight: 500;
        font-size: 9px;
        line-height: 11px;
        .primary {
          color: ${(props) => props.theme.basic.primary};
        }

      }
      .line-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .item-match-opponent {
      display: flex;
      align-items: center;
      padding-bottom: 0.5rem;

      .name {
        margin: auto 5px;
      }
    }
  }

  .redirect {
    cursor: pointer;
    position: absolute;
    right: 1.5rem;
    top: 50%;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
  }
`;
