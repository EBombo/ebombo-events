import React from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { GameConsole } from "../../../../components/common/GameConsole";
import { Image } from "../../../../components/common/Image";
import { config } from "../../../../firebase";
import { useHistory } from "react-router";
import { Icon } from "../../../../components/common/Icons";

export const ItemTournamentTeam = (props) => {
  const history = useHistory();

  return (
    <ItemTournamentTeamCss>
      <div className="item-team-name">
        <div className="li" />
        {props.tournament.name.toUpperCase()}
      </div>
      <div className="item-team-game-rule">
        <div className="game">{props.tournament.game.name.toUpperCase()}</div>
        <GameConsole
          gameConsole={get(props, "tournament.console", "")}
          style={{ fontSize: "9px" }}
        />
      </div>
      <div>Reglas: {props.tournament.rule.name}</div>
      <div className="item-footer">
        <Image
          margin="auto 0"
          borderRadius="20px"
          height="30px"
          width="30px"
          src={
            props.tournament.rule.totalPlayers > 1 && props.teamImageUrlThumb
              ? get(
                  props,
                  "players[0].profileImageUrlThumb",
                  `${config.storageUrl}/resources/perfil-icon.svg`
                )
              : props.teamImageUrlThumb
          }
        />
        <div className="name">
          {props.tournament.rule.totalPlayers > 1
            ? props.name
            : props.players[0].nickname}
        </div>
      </div>
      <div
        className="redirect"
        onClick={() =>
          history.push(
            `/games/${props.tournament.game.id}/consoles/${props.tournament.console.id}/tournaments/${props.tournament.id}`
          )
        }
      >
        VER <Icon type="right" />
      </div>
    </ItemTournamentTeamCss>
  );
};

const ItemTournamentTeamCss = styled.div`
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid ${(props) => props.theme.basic.whiteDarken};

  .item-team-name {
    margin-left: -20px;
    display: flex;
    font-weight: bold;

    .li {
      margin: auto 5px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      border: 1px solid ${(props) => props.theme.basic.white};
    }
  }

  .item-team-game-rule {
    display: flex;

    .game {
      color: ${(props) => props.theme.basic.action};
      font-weight: bold;
      margin-right: 10px;
    }

    div {
      display: inline-table;
    }
  }

  .item-footer {
    display: flex;

    .name {
      margin: auto 5px;
    }
  }

  .redirect {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 50%;
    font-weight: bold;
    color: ${(props) => props.theme.basic.primary};
  }
`;
