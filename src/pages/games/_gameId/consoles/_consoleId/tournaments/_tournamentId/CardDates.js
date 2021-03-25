import React, { useEffect, useState, useGlobal } from "reactn";
import forEach from "lodash/forEach";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import isEmpty from "lodash/isEmpty";
import map from "lodash/map";
import get from "lodash/get";
import moment from "moment";
import styled from "styled-components";
import { config, firestore } from "../../../../../../../firebase";
import { snapshotToArray, spinLoader } from "../../../../../../../utils";
import { Image } from "../../../../../../../components/common/Image";

export const CardDates = (props) => {
  const [authUser] = useGlobal("user");
  const [tournament] = useState(props.tournament);
  const [groupMatches, setGroupMatches] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(0);
  const [matches, setMatches] = useState([]);
  const [tournamentGroups, setTournamentGroups] = useState([]);
  const [activeKey, setActiveKey] = useState(1);

  useEffect(() => {
    initialize();
  }, [tournament]);

  useEffect(() => {
    currentDate < 0 && setCurrentDate(Object.keys(groupMatches).length - 1);
    currentDate > Object.keys(groupMatches).length - 1 && setCurrentDate(0);
  }, [currentDate]);

  useEffect(() => {
    if (!isEmpty(matches) && !isEmpty(tournamentGroups)) {
      groupingMatches();
    }
  }, [matches, tournamentGroups]);

  const initialize = () => {
    fetchMatches();
    fetchTournamentGroups();
  };

  const groupingMatches = async () => {
    setIsLoading(true);

    const tournamentGroupsIds = tournamentGroups.map((group) => group.id);

    const filteredMatches = matches.filter((match) =>
      tournamentGroupsIds.includes(match.tournamentGroupId)
    );

    const tournamentGroupName = tournamentGroups.map((group) => group.name);

    const tournamentGroupNameById = {};

    tournamentGroupsIds.forEach(
      (key, idx) => (tournamentGroupNameById[key] = tournamentGroupName[idx])
    );

    await matchesByDate(filteredMatches, tournamentGroupNameById);
    setIsLoading(false);
  };

  const matchesByDate = async (matches, tournamentGroupNameById) => {
    const matchesGroupByScheduleDate = groupBy(matches, (match) => {
      return match.scheduleDate;
    });

    forEach(matchesGroupByScheduleDate, (value, key) => {
      matchesGroupByScheduleDate[key] = groupBy(
        matchesGroupByScheduleDate[key],
        (match) => {
          return match.tournamentGroupId;
        }
      );
    });

    forEach(matchesGroupByScheduleDate, (val, date) => {
      forEach(matchesGroupByScheduleDate[date], (val, groupId) => {
        matchesGroupByScheduleDate[date][tournamentGroupNameById[groupId]] =
          matchesGroupByScheduleDate[date][groupId];
        delete matchesGroupByScheduleDate[date][groupId];
      });
      const ordered = {};
      const sortedGroupNames = Object.keys(
        matchesGroupByScheduleDate[date]
      ).sort();
      sortedGroupNames.forEach((key) => {
        ordered[key] = orderByDate(matchesGroupByScheduleDate[date][key]);
      });
      matchesGroupByScheduleDate[date] = ordered;
    });

    setGroupMatches(matchesGroupByScheduleDate);
    setActiveKey(Object.keys(matchesGroupByScheduleDate)[0]);
  };

  const orderByDate = (matchesGroupByScheduleDate_) =>
    orderBy(matchesGroupByScheduleDate_, ["createAt"], ["asc"]);

  const fetchMatches = () =>
    firestore
      .collection("matches")
      .where("tournamentId", "==", tournament.id)
      .onSnapshot((snapshot) => {
        setMatches(snapshotToArray(snapshot));
      });

  const fetchTournamentGroups = () =>
    firestore
      .collection("tournamentGroups")
      .where("tournamentId", "==", tournament.id)
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        const snapShotArray = snapshotToArray(snapshot);
        const filteredGroups = snapShotArray.filter(
          (group) => group.phase === 0
        );
        setTournamentGroups(filteredGroups);
      });

  return isLoading ? (
    spinLoader()
  ) : (
    <ContainerCardDates key={`key-${currentDate}`}>
      {isEmpty(groupMatches) ? (
        <div className="empty-dates">
          <div className="description">
            Las fechas serán publicadas minutos antes del inicio del torneo.
          </div>
          <Image
            src={`${config.storageUrl}/resources/tournament/empty-dates.svg`}
            height="100px"
            width="204px"
            margin="1rem 0"
          />
        </div>
      ) : (
        <>
          <div className="dates-container">
            {Object.keys(groupMatches).map((key, idx) => (
              <div
                className={`key ${activeKey === key ? "active" : ""}`}
                onClick={() => setActiveKey(key)}
              >
                Fecha {idx + 1}
              </div>
            ))}
          </div>
          {map(groupMatches[activeKey], (val, groupName) =>
            groupMatches[activeKey][groupName] === [] ? (
              ""
            ) : (
              <ContainerGroups key={`key-groups-${groupName}`}>
                <div className="header-group">{groupName}</div>
                <ul className="body-group">
                  {groupMatches[activeKey][groupName].map((match, index) => (
                    <li key={`key-matches-${match.id}`}>
                      {(index > 0 &&
                        moment(match.createAt.toDate()).format("ddd D MMM") !==
                          moment(
                            groupMatches[activeKey][groupName][
                              index - 1
                            ].createAt.toDate()
                          ).format("ddd D MMM") && (
                          <div className="date-container">
                            <div className="game-date">
                              {moment(match.createAt.toDate()).format(
                                "ddd D MMM"
                              )}
                            </div>
                            <div className="result">Resultado</div>
                          </div>
                        )) ||
                        (index === 0 && (
                          <div className="date-container">
                            <div className="game-date">
                              {moment(match.createAt.toDate()).format(
                                "ddd D MMM"
                              )}
                            </div>
                            <div className="result">Resultado</div>
                          </div>
                        ))}
                      <div className="content-list">
                        <div className="challenger-content">
                          <div className="team-info">
                            <Image
                              size={
                                (get(tournament, "rule.totalPlayers", 1) > 1 &&
                                  match.challengerTeamImageUrlThumb) ||
                                (get(tournament, "rule.totalPlayers", 1) ===
                                  1 &&
                                  match.challenger[0].profileImageUrlThumb)
                                  ? "cover"
                                  : "contain"
                              }
                              src={
                                get(tournament, "rule.totalPlayers") > 1
                                  ? match.challengerTeamImageUrlThumb ||
                                    `${config.storageUrl}/resources/teams-default.svg`
                                  : match.challenger[0].profileImageUrlThumb ||
                                    `${config.storageUrl}/resources/perfil-icon.svg`
                              }
                              height="25px"
                              width="25px"
                              borderRadius="50%"
                              margin="0"
                            />
                            <div
                              className={`team-name ${
                                match.challengerIds.includes(
                                  get(authUser, "id")
                                )
                                  ? "my-team"
                                  : ""
                              }`}
                            >
                              {get(tournament, "rule.totalPlayers") > 1
                                ? match.challengerTeamName
                                : match.challenger[0].nickname}
                            </div>
                          </div>
                          <div className="team-score">
                            {match.challengerPoints && match.isClosed
                              ? match.challengerPoints[0]
                              : "-"}
                          </div>
                        </div>
                        <div className="challenged-content">
                          <div className="team-info">
                            <Image
                              size={
                                (get(tournament, "rule.totalPlayers", 1) > 1 &&
                                  match.challengedTeamImageUrlThumb) ||
                                (get(tournament, "rule.totalPlayers", 1) ===
                                  1 &&
                                  match.challenged[0].profileImageUrlThumb)
                                  ? "cover"
                                  : "contain"
                              }
                              src={
                                get(tournament, "rule.totalPlayers") > 1
                                  ? match.challengedTeamImageUrlThumb ||
                                    `${config.storageUrl}/resources/teams-default.svg`
                                  : match.challenged[0].profileImageUrlThumb ||
                                    `${config.storageUrl}/resources/perfil-icon.svg`
                              }
                              height="25px"
                              width="25px"
                              borderRadius="50%"
                              margin="0"
                            />
                            <div
                              className={`team-name ${
                                match.challengedIds.includes(
                                  get(authUser, "id")
                                )
                                  ? "my-team"
                                  : ""
                              }`}
                            >
                              {get(tournament, "rule.totalPlayers") > 1
                                ? match.challengedTeamName
                                : match.challenged[0].nickname}
                            </div>
                          </div>
                          <div className="team-score">
                            {match.challengedPoints && match.isClosed
                              ? match.challengedPoints[0]
                              : "-"}
                          </div>
                        </div>
                      </div>
                      <div className="hour">
                        {moment(match.createAt.toDate()).format("hh:mm a")}
                      </div>
                    </li>
                  ))}
                </ul>
              </ContainerGroups>
            )
          )}
        </>
      )}
    </ContainerCardDates>
  );
};

const ContainerGroups = styled.section`
  margin: 1rem 0;
  padding-bottom: 2rem;
  .text-red {
    font-size: 10px;
    color: ${(props) => props.theme.basic.danger};
  }

  .text-primary {
    color: ${(props) => props.theme.basic.primary};
  }

  .header-group {
    text-align: left;
    color: ${(props) => props.theme.basic.whiteDarken};
    font-weight: bold;
    font-size: 15px;
    line-height: 19px;
    margin: 0 0.5rem;
  }

  .body-group {
    list-style: none;
    margin: 0;
    padding: 0;

    li:last-child {
      border-bottom: 1px solid ${(props) => props.theme.basic.primaryDark};
    }

    li {
      display: flex;
      flex-direction: column;
      width: 100%;
      padding: 0.3rem 0;
      background: ${(props) => props.theme.basic.default};
      border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

      .content-list {
        display: flex;
        flex-direction: column;
        .challenger-content,
        .challenged-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          .team-info {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .team-name {
              margin-left: 5px;
            }
            .my-team {
              color: ${(props) => props.theme.basic.action};
            }
          }
          .team-score {
            font-weight: bold;
            font-size: 16px;
            line-height: 20px;
            color: ${(props) => props.theme.basic.whiteDarken};
            text-align: center;
            width: 50px;
          }
        }
      }

      .hour {
        padding: 0 0.5rem;
        font-size: 11px;
        line-height: 14px;
      }

      .date-container {
        background: ${(props) => props.theme.basic.blackLighten};
        padding: 0 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid ${(props) => props.theme.basic.primaryDark};
        height: 25px;
        margin-top: 1rem;
        .game-date {
          font-weight: bold;
          font-size: 11px;
          line-height: 14px;
        }
        .result {
          font-weight: 500;
          font-size: 12px;
          line-height: 15px;
          color: ${(props) => props.theme.basic.grayDark};
        }
      }
    }
  }
`;

const ContainerCardDates = styled.section`
  .empty-dates {
    padding: 0.5rem;

    .description {
      font-size: 12px;
      line-height: 13px;
      color: ${(props) => props.theme.basic.grayLighten};
    }
  }

  .hidden {
    display: none;
  }

  .dates-container {
    display: -webkit-box;
    justify-content: flex-start;
    align-items: center;
    padding: 1rem;
    max-width: 100%;
    overflow: auto;

    .key {
      margin-right: 5px;
      padding: 0 0.5rem;
      font-size: 12px;
      line-height: 15px;
      text-align: center;
      color: ${(props) => props.theme.basic.grayLighten};
      border-radius: 10px;
      cursor: pointer;
    }

    .active {
      color: ${(props) => props.theme.basic.blackDarken};
      background: ${(props) => props.theme.basic.grayLighten}!important;
    }
  }
`;
