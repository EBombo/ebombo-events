import React, { useEffect, useState, useRef } from "reactn";
import { snapshotToArray, spinLoader } from "../../../utils";
import { firestore } from "../../../firebase";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { List, Tooltip } from "antd";
import styled from "styled-components";
import { Levels } from "../../../components";
import moment from "moment";
import { useAcl } from "../../../acl";
import { Anchor } from "../../../components/common/Anchor";

export const AdminMatchesHistory = (props) => {
  const { Acl } = useAcl();

  const [matchesHistory, setMatchesHistory] = useState([]);
  const [isLoadingMatchesHistory, setIsLoadingMatchesHistory] = useState(true);
  const [limit, setLimit] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const matchesRef = useRef(null);

  useEffect(() => {
    initialize();
  }, [limit]);

  const initialize = () => {
    !isEmpty(matchesRef.current) && matchesRef.current();
    matchesRef.current = fetchMatchesHistory();

    setIsLoadingMatchesHistory(false);
  };

  const fetchMatchesHistory = () =>
    firestore
      .collection("matches")
      .where("isCanceled", "==", false)
      .orderBy("createAt", "desc")
      .limit(limit)
      .onSnapshot((snapShot) => {
        setMatchesHistory(snapshotToArray(snapShot));
        setIsLoadingMore(false);
      });

  const onClickMore = () => {
    setIsLoadingMore(true);
    setLimit(limit + 20);
  };

  const listPlayers = (players, playersPoints) =>
    players.map((player, index) => (
      <div key={`key-list-players-${index}`}>
        {player.nickname + " - " + get(playersPoints, `[${index}]`, 0)}
      </div>
    ));

  const matchStatus = (matchHistory) => {
    if (matchHistory.isCanceled)
      return <span className="status-danger">Patida cancelada</span>;

    if (
      matchHistory.isClosed ||
      (matchHistory.challengedAcceptResult &&
        matchHistory.challengerAcceptResult)
    )
      return <span className="status-success-finalized">Finalizado</span>;

    return <span className="status-danger">Tiempo concluiyo</span>;
  };

  return isLoadingMatchesHistory ? (
    spinLoader()
  ) : (
    <React.Fragment>
      <h2>Historial de partidos</h2>
      <br />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={matchesHistory}
        renderItem={(matchHistory) => (
          <List.Item>
            <MatchHistory>
              <Information>
                <div className="time">
                  Inicio:{" "}
                  {moment(matchHistory.createAt.toDate()).format(
                    "DD MMM YYYY hh:mm A"
                  )}
                  <Acl name="/admin/matches-history/:matchHistoryId">
                    <div
                      className="time-details"
                      onClick={() => {
                        const url =
                          !matchHistory.challengedAcceptResult ||
                          !matchHistory.challengerAcceptResult
                            ? `/admin/claims/${matchHistory.id}`
                            : `/admin/matches-history/${matchHistory.id}`;
                        window.open(
                          `http://${window.location.host}${url}`,
                          "_blank"
                        );
                      }}
                    >
                      {" "}
                      [Ver partido]
                    </div>
                  </Acl>
                  {!matchHistory.isClosed &&
                    moment().isBefore(matchHistory.finishAt.toDate()) &&
                    !matchHistory.isCanceled && (
                      <Acl name="/admin/vs/games/:gameId/consoles/:consoleId/lobbies/:lobbyId">
                        <div
                          className="time-details"
                          onClick={() =>
                            window.open(
                              `http://${window.location.host}/notifications/matches/${matchHistory.id}`,
                              "_blank"
                            )
                          }
                        >
                          {" "}
                          [Unirse al Lobby]
                        </div>
                      </Acl>
                    )}
                </div>
                <label>
                  Fin:{" "}
                  {moment(matchHistory.finishAt.toDate()).format(
                    "DD MMM YYYY hh:mm A"
                  )}
                </label>
                {matchHistory.tournamentId && (
                  <label
                    onClick={() =>
                      window.open(
                        `http://${window.location.host}/admin/games/${matchHistory.tournament.game.id}/tournaments/${matchHistory.tournament.id}`,
                        "_blank"
                      )
                    }
                  >
                    Torneo: <b>{get(matchHistory, "tournament.name", "-")}</b>
                  </label>
                )}
                <label>
                  Juego: <span>{get(matchHistory, "game.name", "-")}</span>
                </label>
                <label>
                  Regla: <span>{get(matchHistory, "rule.name", "-")}</span>
                </label>
                {!matchHistory.tournamentId && (
                  <label>
                    Entrada:{" "}
                    <span>{get(matchHistory, "gameEntryCost", "-")}</span>
                  </label>
                )}
                <label>
                  Estado:{" "}
                  <span>
                    {!matchHistory.isClosed &&
                    moment().isBefore(matchHistory.finishAt.toDate()) &&
                    !matchHistory.isCanceled ? (
                      <span className="status-success">En juego</span>
                    ) : (
                      matchStatus(matchHistory)
                    )}
                  </span>
                </label>
              </Information>
              <Scoreboard>
                <Tooltip
                  title={
                    <div>
                      {listPlayers(
                        matchHistory.challenged,
                        matchHistory.challengedPoints
                      )}
                    </div>
                  }
                >
                  <Player isChallenged={true}>
                    <label className="information">
                      <Levels
                        gamesStatistics={get(
                          matchHistory,
                          "challenged[0].gamesStatistics",
                          []
                        )}
                        gameId={get(matchHistory, "game.id", "")}
                        style={{ textAlign: "left", fontSize: "0.7rem" }}
                      />
                      <label
                        className="information-name"
                        style={{ color: "blue" }}
                        onClick={() =>
                          window.open(
                            `http://${window.location.host}/admin/users/${matchHistory.challenged[0].id}`,
                            "_blank"
                          )
                        }
                      >
                        {matchHistory.challenged[0].nickname}
                        <br />
                        {matchHistory.challenged[0].email}
                        <br />
                        {(matchHistory.isClosed ||
                          moment().isAfter(matchHistory.finishAt.toDate())) &&
                        !matchHistory.isCanceled ? (
                          matchHistory.challengedAcceptResult ? (
                            <span className="accept-result">
                              Acepto resultado
                            </span>
                          ) : (
                            <span className="no-accept">No acepto result.</span>
                          )
                        ) : (
                          ""
                        )}
                      </label>
                    </label>
                  </Player>
                </Tooltip>
                <div className="score">
                  <label>
                    {" "}
                    {get(matchHistory, "challengedPoints", []).reduce(
                      (a, b) => a + b,
                      0
                    )}{" "}
                  </label>
                  <label> - </label>
                  <label>
                    {" "}
                    {get(matchHistory, "challengerPoints", []).reduce(
                      (a, b) => a + b,
                      0
                    )}{" "}
                  </label>
                </div>
                <Tooltip
                  title={
                    <div>
                      {listPlayers(
                        matchHistory.challenger,
                        matchHistory.challengerPoints
                      )}
                    </div>
                  }
                >
                  <Player isChallenged={false}>
                    <label className="information">
                      <Levels
                        gamesStatistics={get(
                          matchHistory,
                          "challenger[0].gamesStatistics",
                          []
                        )}
                        gameId={get(matchHistory, "game.id", "")}
                        style={{ textAlign: "right", fontSize: "0.7rem" }}
                      />

                      <label
                        className="information-name"
                        style={{ color: "blue" }}
                        onClick={() =>
                          window.open(
                            `http://${window.location.host}/admin/users/${matchHistory.challenger[0].id}`,
                            "_blank"
                          )
                        }
                      >
                        {matchHistory.challenger[0].nickname}
                        <br />
                        {matchHistory.challenger[0].email}
                        <br />
                        {(matchHistory.isClosed ||
                          moment().isAfter(matchHistory.finishAt.toDate())) &&
                        !matchHistory.isCanceled ? (
                          matchHistory.challengerAcceptResult ? (
                            <span className="accept-result">
                              Acepto resultado
                            </span>
                          ) : (
                            <span className="no-accept">No acepto result.</span>
                          )
                        ) : (
                          ""
                        )}
                      </label>
                    </label>
                  </Player>
                </Tooltip>
              </Scoreboard>
            </MatchHistory>
          </List.Item>
        )}
      />
      <br />
      {limit <= matchesHistory.length && (
        <WrapperButton>
          <Anchor type="primary" loading={isLoadingMore} onClick={onClickMore}>
            Ver más
          </Anchor>
        </WrapperButton>
      )}
    </React.Fragment>
  );
};

const MatchHistory = styled.div`
  width: 100%;
  color: #000000;
  font-size: 0.8rem;
  display: grid;
  grid-template-columns: 1fr 1fr 0.5fr;
  grid-gap: 1rem;
  align-items: center;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;

  label {
    color: gray;
    margin-bottom: 0.2rem;

    .status-success {
      color: ${(props) => props.theme.basic.primary};
      font-weight: bold;
    }

    .status-success-finalized {
      color: ${(props) => props.theme.socialNetworkColor.face};
      font-weight: bold;
    }

    .status-danger {
      color: ${(props) => props.theme.basic.danger};
      font-weight: bold;
    }
  }

  .time {
    display: flex;
    font-weight: 500;

    .time-details {
      cursor: pointer;
      color: black;
      font-weight: 700;
      margin: 0 10px;
    }
  }
`;

const Scoreboard = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: 1fr 65px 1fr;

  .score {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .text-level {
    background: #333;
    width: auto;
    padding: 3px 5px;
    margin: 3px 0;
    border-radius: 5px;
  }
`;

const Player = styled.div`
  width: 100%;

  .information {
    display: flex;
    flex-direction: column;
    text-align: ${(props) => (props.isChallenged ? "left" : "right")};

    .information-name {
      .accept {
        color: ${(props) => props.theme.basic.primary};
        font-weight: bold;
      }

      .accept-result {
        color: ${(props) => props.theme.socialNetworkColor.face};
        font-weight: bold;
      }

      .no-accept {
        color: ${(props) => props.theme.basic.danger};
        font-weight: bold;
      }
    }
  }
`;

const WrapperButton = styled.div`
  width: 100%;
  text-align: center;

  button {
    font-size: 1rem;
  }
`;
