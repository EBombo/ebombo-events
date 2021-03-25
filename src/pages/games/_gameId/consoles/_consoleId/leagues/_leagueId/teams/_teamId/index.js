import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import { useHistory, useParams } from "react-router";
import { mediaQuery } from "../../../../../../../../../styles/constants";
import { UserImageProfile } from "../../../../../../../../../components/users/UserImageProfile";
import { Icon } from "../../../../../../../../../components/common/Icons";

export const Team = (props) => {
  const history = useHistory();
  const { gameId, consoleId, leagueId, teamId } = useParams();
  return (
    <ContainerTeam>
      {!props.team ? (
        <div className="not-found-team">No se encontro el torneo</div>
      ) : (
        <>
          <div className="team">
            <UserImageProfile
              size={"league-big"}
              afterTablet={"168px"}
              borderRadius={"0"}
              url={get(props, "team.teamImageUrlThumb", "")}
            />
            <span>{get(props, "team.name", "")}</span>
          </div>
          <div className="team-options">
            <div
              className="option"
              onClick={() =>
                history.push(
                  `/games/${gameId}/consoles/${consoleId}/leagues/${leagueId}/teams/${teamId}/details`
                )
              }
            >
              <span>Team Info</span>
              <Icon type="info-circle" />
            </div>
            <div
              className="option"
              onClick={() =>
                history.push(
                  `/games/${gameId}/consoles/${consoleId}/leagues/${leagueId}/teams/${teamId}/members`
                )
              }
            >
              <span>Miembros</span>
              <Icon type="user" />
            </div>
          </div>
        </>
      )}
    </ContainerTeam>
  );
};

const ContainerTeam = styled.div`
  .team {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    margin: 40px 10px;

    span {
      color: ${(props) => props.theme.basic.white};
      text-align: center;
      margin: 20px 0;
    }

    ${mediaQuery.afterTablet} {
      grid-template-columns: 2fr 5fr;

      span {
        text-align: start;
        margin: auto 0 auto 20px;
      }
    }
  }

  .not-found-team {
    text-align: center;
    color: ${(props) => props.theme.basic.white};
    margin-top: 30px;
  }

  .team-options {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin: 60px 0;

    .option {
      display: flex;
      height: 40px;
      padding-left: 5px;
      cursor: pointer;

      span {
        min-width: 40px;
        text-align: end;
        color: ${(props) => props.theme.basic.whiteDarken};
        margin: auto 0;
      }

      i {
        margin: auto 0 auto 20px;
        color: ${(props) => props.theme.basic.primary};
        text-align: start;
      }
    }

    div:first-child {
      border-top: 1.5px solid ${(props) => props.theme.basic.primary};
      border-bottom: 1px solid ${(props) => props.theme.basic.whiteDarken};
    }

    div:last-child {
      border-bottom: 1px solid ${(props) => props.theme.basic.whiteDarken};
    }
  }
`;
