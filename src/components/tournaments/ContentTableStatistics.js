import React from "reactn";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import {calculateScore} from "../../business";
import moment from "moment";
import {useHistory, useLocation} from "react-router";
import {config} from "../../firebase";
import {Image} from "../common/Image";

export const ContentTableStatistics = (props) => {
  const history = useHistory();
  const location = useLocation();

  const orderByCreateAt = (tournamentGroups_) =>
    orderBy(
      tournamentGroups_,
      [(tournamentGroup_) => tournamentGroup_.createAt.toDate()],
      ["asc"]
    );

  const orderByPointsAndAverage = (teams_) =>
    orderBy(
      teams_,
      [
        (team_) => get(team_, "score.points", 0),
        (team_) => get(team_, "score.average", 0),
        (team_) => get(team_, "score.goalsFor", 0),
        (team_) => get(team_, "score.goalsAgainst", 0),
        (team_) => get(team_, "createAt", moment()).toDate(),
      ],
      ["desc", "desc", "desc", "asc", "asc"]
    );

  const teamsByGroup = (group_) => {
    let teams = group_.tournamentTeams.map((teamGroup) => {
      const team = props.tournamentTeams.find(
        (team_) => team_.id === teamGroup.id
      );
      if (team) return calculateScore(props.tournament, team);
    });
    teams = teams.filter((team) => team);
    return orderByPointsAndAverage(teams);
  };

  return (
    <ContainerContentTableStatistics>
      <div className="content-table-group">
        {isEmpty(props.tournamentGroups) ? (
          <div className="empty-groups">
            <div className="description">
              Los grupos serán publicados minutos antes del inicio del torneo.
            </div>
            <Image
              src={`${config.storageUrl}/resources/tournament/empty-groups.svg`}
              height="100px"
              width="204px"
              margin="1rem 0"
            />
          </div>
        ) : (
          <>
            {orderByCreateAt(props.tournamentGroups).map((group) => (
              <table key={`key-by-group-${group.id}`}>
                <thead className="thead">
                  <tr>
                    <th>{group.name}</th>
                    <th>PTS</th>
                    <th>PJ</th>
                    <th>V</th>
                    {!props.tournament.name
                      .toLowerCase()
                      .includes("liga 1") && <th>E</th>}
                    <th>D</th>
                    <th>
                      {get(props, "tournament.game.name", "")
                        .toLowerCase()
                        .includes("clash")
                        ? props.tournament.name.toLowerCase().includes("liga 1")
                          ? "SF"
                          : "TA"
                        : "GF"}
                    </th>
                    <th>
                      {get(props, "tournament.game.name", "")
                        .toLowerCase()
                        .includes("clash")
                        ? props.tournament.name.toLowerCase().includes("liga 1")
                          ? "SC"
                          : "CC"
                        : "GC"}
                    </th>
                    <th>+/-</th>
                  </tr>
                </thead>
                <tbody className="tbody">
                  {teamsByGroup(group).map((team, index) => (
                    <tr
                      onClick={() =>
                        window.location.pathname.includes("leagues")
                          ? history.push(
                              `/games/${props.tournament.game.id}/consoles/${props.tournament.console.id}/leagues/${props.tournament.id}/teams/${team.id}`
                            )
                          : console.log(team)
                      }
                      key={`key-team-by-group-${index}`}
                    >
                      <td className="row-primary">
                        <div
                          className={`num-row ${
                            index + 1 <= group.amountWinners ? "classified" : ""
                          }`}
                        >
                          {index + 1}
                        </div>
                        <Image
                          src={
                            team.teamImageUrlThumb
                              ? team.teamImageUrlThumb
                              : team.players[0].profileImageUrlThumb
                              ? team.players[0].profileImageUrlThumb
                              : `${config.storageUrl}/resources/perfil-icon.svg`
                          }
                          height="25px"
                          width="25px"
                          borderRadius="50%"
                          size="cover"
                          className="user-image"
                        />
                        <div className="item-user-name">
                          {props.tournament.rule.totalPlayers > 1
                            ? get(team, `name`, "-")
                            : get(team, `players[0].nickname`, "-")}
                        </div>
                      </td>
                      <td>{get(team, "score.points", 0)}</td>
                      <td>{get(team, "score.matchesPlayed", 0)}</td>
                      <td>{get(team, "score.victories", 0)}</td>
                      {!props.tournament.name
                        .toLowerCase()
                        .includes("liga 1") && (
                        <td>{get(team, "score.ties", 0)}</td>
                      )}
                      <td>{get(team, "score.defeats", 0)}</td>
                      <td>{get(team, "score.goalsFor", 0)}</td>
                      <td>-{get(team, "score.goalsAgainst", 0)}</td>
                      <td>
                        {get(team, "score.average", 0) > 0 && "+"}
                        {get(team, "score.average", 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </>
        )}
      </div>
      {!isEmpty(props.tournamentGroups) &&
        !location.pathname.includes("/admin") && (
          <div className="legend-content">
            <div className="lenged">Leyenda</div>
            <div className="description">
              <div className="circle-green" />
              <div className="description">Equipos clasificados</div>
            </div>
          </div>
        )}
    </ContainerContentTableStatistics>
  );
};

const ContainerContentTableStatistics = styled.section`
  .item-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    margin: 1rem 0;
    .item-arrow {
      width: auto;
      color: ${(props) => props.theme.basic.default};
      font-size: 14px;
      cursor: pointer;
    }
    .item-arrow-selection {
      color: ${(props) => props.theme.basic.primary};
      cursor: pointer;
    }
    .item-text {
      width: auto;
      padding: 0 1rem;
      font-weight: 600;
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .content-table-group {
    overflow: auto;

    ${mediaQuery.afterTablet} {
      overflow: initial;
    }

    .empty-groups {
      padding: 0.5rem;

      .description {
        font-size: 12px;
        line-height: 13px;
        color: ${(props) => props.theme.basic.grayLighten};
      }
    }

    table {
      width: 520px;
      overflow-x: scroll;
      margin: 1rem 0;

      ${mediaQuery.afterMobile} {
        width: 100%;
      }

      .thead {
        background: ${(props) => props.theme.basic.blackLighten};
        font-size: 10px;
        font-weight: 600;
        border-bottom: 1px solid ${(props) => props.theme.basic.primaryDark};
        th {
          text-align: center;
          padding: 0 0.4rem;
          height: 20px;
          color: ${(props) => props.theme.basic.white};
        }
        th:first-child {
          text-align: left;
          padding: 0 1rem;
          width: 50%;
          ${mediaQuery.afterTablet} {
            width: 70%;
          }
        }
      }

      .tbody {
        font-size: 10px;
        border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};

        tr {
          font-size: 10px;
          font-weight: 600;
          border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

          td {
            text-align: center;
            padding: 0 0.4rem;
          }
          .row-primary {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-weight: 500;
            font-size: 10px;
            line-height: 12px;

            .user-image {
              padding: 0.7rem;
            }

            .item-user-name {
              padding: 0.7rem;
              width: 100%;
              text-align: left;
            }

            .num-row {
              display: flex;
              justify-content: center;
              align-items: center;
              border-radius: 50%;
              padding: 2px 5px;
              margin-right: 5px;
              font-size: 10px;
            }

            .classified {
              background: ${(props) => props.theme.basic.primary};
              color: ${(props) => props.theme.basic.blackLighten};
            }
          }
        }
      }
    }
  }

  .legend-content {
    padding: 1rem;
    .lenged {
      font-weight: bold;
      font-size: 10px;
      line-height: 12px;
      color: ${(props) => props.theme.basic.white};
      margin-bottom: 1rem;
    }
    .description {
      display: flex;
      align-items: center;

      .circle-green {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${(props) => props.theme.basic.primary};
        margin-right: 10px;
      }

      .description {
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
`;
