import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import { mediaQuery } from "../../../../../../../../styles/constants";
import { useHistory, useParams } from "react-router";
import { UserImageProfile } from "../../../../../../../../components/users/UserImageProfile";

export const LeagueTeams = (props) => {
  const history = useHistory();
  const { gameId, consoleId, leagueId } = useParams();

  const isSelected = (team) =>
    history.location.pathname.includes(team.id) ? "selected" : "";

  return (
    <ContainerTeamLeagues>
      {get(props, "teams", []).map((team) => (
        <div
          className={`team-content ${isSelected(team)}`}
          onClick={() =>
            history.push(
              `/games/${gameId}/consoles/${consoleId}/leagues/${leagueId}/teams/${team.id}`
            )
          }
        >
          <UserImageProfile size={"league"} url={team.teamImageUrlThumb} />
          <span className="no-wrap name">{team.name}</span>
        </div>
      ))}
    </ContainerTeamLeagues>
  );
};

const ContainerTeamLeagues = styled.div`
  width: 100%;
  height: 79px;
  background-color: transparent;
  display: flex;
  overflow: auto;
  padding: 0 2px;
  margin: 3px 0;
  align-items: center;
  .team-content {
    height: 71px;
    background: ${(props) => props.theme.basic.default};
    overflow: auto;
    margin: 0 3px 0 0;
    display: grid;
    min-width: 76px;
    border-radius: 3px;
    grid-template-columns: 1fr;
    grid-template-rows: 3fr 1fr;
    cursor: pointer;
    span {
      color: ${(props) => props.theme.basic.white};
      margin: auto;
      font-size: 9px;
      width: 100%;
      text-align: center;
    }
  }
  .selected {
    border: 1px solid ${(props) => props.theme.basic.primary};
    span {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  ${mediaQuery.afterTablet} {
    margin: 5px;
  }
`;
