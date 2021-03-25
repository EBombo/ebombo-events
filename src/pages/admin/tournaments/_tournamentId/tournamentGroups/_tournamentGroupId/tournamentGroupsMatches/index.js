import React, {useEffect, useState} from "reactn";
import {querySnapshotToArray, spinLoader} from "../../../../../../../utils";
import {List as ListAntd, message, Modal, Tooltip} from "antd";
import {firestore} from "../../../../../../../firebase";
import forEach from "lodash/forEach";
import isEmpty from "lodash/isEmpty";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import get from "lodash/get";
import moment from "moment";
import {useHistory} from "react-router";
import {ModalAdminGroupMatchDateEdit} from "./_tournamentGroupMatchId";
import styled from "styled-components";
import {Icon} from "../../../../../../../components/common/Icons";
import orderBy from "lodash/orderBy";

export const AdminTournamentGroupsMatches = (props) => {
  const history = useHistory();

  const [tournament] = useState(props.tournament);
  const [matches, setMatches] = useState([]);
  const [tournamentGroups] = useState(props.tournamentGroups);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [groupLobbies, setGroupLobbies] = useState([]);
  const [activeModalEditMatchDate, setActiveModalEditMatchDate] = useState(
    false
  );

  const [currentLobby, setCurrentLobby] = useState(null);

  useEffect(() => {
    fetchMatchesPerGroup();
  }, [tournamentGroups]);

  useEffect(() => {
    if (isEmpty(matches)) return;

    groupLobbies_(matches);
  }, [matches]);

  const groupLobbies_ = async (matches) => {
    let matches_ = matches;

    const tournamentGroupsIds = tournamentGroups.map((group) => group.id);

    const tournamentGroupName = tournamentGroups.map((group) => group.name);

    const tournamentGroupNameById = {};

    tournamentGroupsIds.forEach(
      (key, idx) => (tournamentGroupNameById[key] = tournamentGroupName[idx])
    );

    matches_ = matches_.filter((match) =>
      tournamentGroupsIds.includes(match.tournamentGroupId)
    );

    await matchesByDate(matches_, tournamentGroupNameById);

    setLoadingMatches(false);
    setActiveModalEditMatchDate(false);
  };

  const fetchMatchesPerGroup = async () => {
    setLoadingMatches(true);
    await fetchMatches();
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
        forEach(tournamentGroupNameById, (id, name) => {
          if (!matchesGroupByScheduleDate[date][tournamentGroupNameById[name]])
            matchesGroupByScheduleDate[date][
              tournamentGroupNameById[name]
            ] = [];
        });
      });
      const ordered = {};
      const sortedGroupNames = Object.keys(
        matchesGroupByScheduleDate[date]
      ).sort();
      sortedGroupNames.forEach((key) => {
        ordered[key] = matchesGroupByScheduleDate[date][key];
      });
      matchesGroupByScheduleDate[date] = ordered;
    });

    setGroupLobbies(matchesGroupByScheduleDate);
  };

  const fetchMatches = () =>
    firestore
      .collection("matches")
      .where("tournamentId", "==", tournament.id)
      .onSnapshot((snapshot) => {
        setMatches(querySnapshotToArray(snapshot));
      });

  return loadingMatches ? (
    spinLoader()
  ) : (
    <div>
      {activeModalEditMatchDate && (
        <ModalMatchEditContainer
          visible={activeModalEditMatchDate}
          onCancel={() =>
            setActiveModalEditMatchDate(!activeModalEditMatchDate)
          }
        >
          <ModalAdminGroupMatchDateEdit
            matches={currentLobby}
            fetchMatchesPerGroup={fetchMatchesPerGroup}
          />
        </ModalMatchEditContainer>
      )}
      <GroupsContainer>
        {Object.keys(groupLobbies).map((key, index) => {
          return (
            <div key={key} className="group-matches">
              <div className="date">
                <h2>Fecha {index + 1}:</h2>
                <Tooltip title="La fecha se aplicará a todos los encuentros de esta agrupación">
                  Cambiar fechas&nbsp;
                  <Icon
                    onClick={() => {
                      const currentLobbies = matches.filter(
                        (match) =>
                          match.scheduleDate === index + 1 &&
                          match.isClosed === false &&
                          moment().isBefore(match.finishAt.toDate())
                      );
                      if (isEmpty(currentLobbies)) {
                        message.success(
                          "Ya culminaron los partidos de esta fase."
                        );
                        return;
                      }
                      console.log(currentLobbies);
                      setCurrentLobby(currentLobbies);
                      setActiveModalEditMatchDate(true);
                    }}
                    style={{
                      color: "gray",
                      fontSize: "16px",
                      alignSelf: "right",
                      marginTop: "0",
                    }}
                    type="calendar"
                  />
                </Tooltip>
              </div>
              <div className="list-of-groups">
                {map(groupLobbies[key], (val, groupName) => {
                  return (
                    <div className="groups" key={`${key}-${groupName}`}>
                      <div className="group-name">
                        <h3>{groupName.toUpperCase()}</h3>
                      </div>
                      <div className="games-list">
                        <h4>Partidos:</h4>
                        <List
                          itemLayout="vertical"
                          size="small"
                          dataSource={orderBy(
                            groupLobbies[key][groupName],
                            [(match_) => match_.createAt.toDate()],
                            ["asc"]
                          )}
                          renderItem={(match) => (
                            <List.Item
                              style={{ display: "flex" }}
                              key={match.id}
                              actions={[
                                <Tooltip title={"Editar fecha"}>
                                  <Icon
                                    onClick={() => {
                                      setCurrentLobby([match]);
                                      setActiveModalEditMatchDate(true);
                                    }}
                                    style={{
                                      color: "gray",
                                      fontSize: "16px",
                                      alignSelf: "right",
                                      marginTop: "0",
                                    }}
                                    type="calendar"
                                  />
                                </Tooltip>,
                                <Tooltip title={"Editar score"}>
                                  <Icon
                                    type="edit"
                                    style={{
                                      color: "gray",
                                      fontSize: "16px",
                                      alignSelf: "right",
                                      marginTop: "0",
                                    }}
                                    onClick={() =>
                                      history.push(
                                        `/admin/matches-history/${match.id}/edit`
                                      )
                                    }
                                  />
                                </Tooltip>,
                                !match.isClosed &&
                                  moment().isBefore(match.finishAt.toDate()) &&
                                  moment().isAfter(match.createAt.toDate()) &&
                                  !match.isCanceled && (
                                    <Tooltip title={"Unirse al match"}>
                                      <Icon
                                        type="play-circle"
                                        style={{
                                          color: "gray",
                                          fontSize: "16px",
                                          alignSelf: "right",
                                          marginTop: "0",
                                        }}
                                        onClick={() =>
                                          history.push(
                                            `/notifications/matches/${match.id}`
                                          )
                                        }
                                      />
                                    </Tooltip>
                                  ),
                              ]}
                            >
                              <div
                                key={match.id}
                                style={{ width: "100%" }}
                                className="team-name"
                                onClick={() => console.log(match)}
                              >
                                <p>
                                  {tournament.rule.totalPlayers > 1
                                    ? `${match.challengerTeamName} vs ${match.challengedTeamName}`
                                    : `${match.challenger[0].nickname.toUpperCase()} vs ${match.challenged[0].nickname.toUpperCase()}`}
                                  <b>
                                    [
                                    {match.isClosed
                                      ? `${get(
                                          match,
                                          "challengerPoints",
                                          []
                                        ).reduce((a, b) => a + b, 0)}-${get(
                                          match,
                                          "challengedPoints",
                                          []
                                        ).reduce((a, b) => a + b, 0)}`
                                      : `POR DISPUTAR`}
                                    ]
                                  </b>
                                  <label style={{ fontSize: "9px" }}>
                                    {moment(match.createAt.toDate()).format(
                                      "DD/MM/YYYY hh:mm:ss"
                                    )}
                                  </label>
                                </p>
                              </div>
                            </List.Item>
                          )}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </GroupsContainer>
    </div>
  );
};

const ModalMatchEditContainer = styled(Modal)`
  padding-bottom: 0;
  top: 5rem;

  .ant-modal-content {
    background-blend-mode: multiply;
    background: ${(props) => props.theme.basic.gray};
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 100% 33%;
    border-radius: 9px;

    .ant-modal-close {
      display: none;
      padding-bottom: 1rem;
      color: #ffffff;
      font-size: 20px;
    }

    .ant-modal-footer {
      display: none;
    }
  }
`;

const GroupsContainer = styled.div`
  .list-of-groups {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 10px;

    .groups {
      border: 1px solid gray;
      border-radius: 10px;
      padding: 10px 10px;

      .games-list {
        .team-name {
          display: flex;
          align-items: center;

          p {
            margin-bottom: 0;
          }

          p:before {
            content: "»";
            margin-right: 10px;
          }
        }
      }
    }
  }

  .group-matches {
    .date {
      display: flex;
      align-items: center;
      margin: 20px 0;

      h2 {
        color: #00008b;
        margin-right: 10px;
      }
    }
  }
`;

const List = styled(ListAntd)`
  .ant-list-item {
    .ant-list-item-action {
      cursor: pointer;
      margin-top: 0;
      top: 0;
    }
  }
`;
