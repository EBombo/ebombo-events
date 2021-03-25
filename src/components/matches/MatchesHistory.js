import React, {useEffect, useState} from "reactn";
import moment from "moment";
import {config, firestore} from "../../firebase";
import {snapshotToArray, spinLoader} from "../../utils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import {SpinLoader} from "../../styles";
import {mediaQuery} from "../../styles/constants";
import styled from "styled-components";
import {Modal} from "antd";
import {MatchHistory} from "./MatchHistory";
import {UserImageProfile} from "../users/UserImageProfile";
import {Anchor} from "../common/Anchor";

const typePlayers = [
  { is: "challenger", opposite: "challenged", index: 0 },
  { is: "challenged", opposite: "challenger", index: 1 },
];

export const MatchesHistory = (props) => {
  const [match, setMatch] = useState("");
  const [matchesByUser, setMatchesByUser] = useState([]);
  const [matchesTotal, setMatchesTotal] = useState(0);
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [limit, setLimit] = useState(5);
  const [isVisibleMatchHistory, setIsVisibleMatchHistory] = useState(false);

  useEffect(() => {
    if (!props.user) return;

    initialize();
  }, [props.gameId, limit]);

  const initialize = async () => {
    try {
      setIsLoadingMatches(true);

      await fetchMatchesAsChallenged();
    } catch (error) {
      console.error("Fetch matches", error);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  const fetchMatchesAsChallenged = async () => {
    const matchesByUserQuerySnapShot = await firestore
      .collection("matches")
      .where("playersIds", "array-contains", props.user.id)
      .where("game.id", "==", props.gameId)
      .where("isCanceled", "==", false)
      .where("isClosed", "==", true)
      .orderBy("createAt", "desc")
      .limit(limit)
      .get();

    const matches = snapshotToArray(matchesByUserQuerySnapShot);
    setMatchesByUser(matchesByDate(matches));
    setMatchesTotal(matches.length);
  };

  const matchesByDate = (matches) => {
    const matches_ = matches.map(mapMatch);

    return groupBy(matches_, "date");
  };

  const mapMatch = (match) => ({
    ...match,
    date: moment(match.createAt.toDate()).format("YYYY-MM-DD"),
    isWinnerUser: isWinnerUser(match),
  });

  const isWinnerUser = (match) => {
    const userIsChallenged =
      get(match, "challenged.id", null) === props.user.id;

    const userPoints = userIsChallenged
      ? match.challengedPoints
      : match.challengerPoints;
    const opponentPoints = userIsChallenged
      ? match.challengerPoints
      : match.challengedPoints;

    return userPoints > opponentPoints;
  };

  const hiddenMatchHistory = () => {
    setIsVisibleMatchHistory(false);
    setMatch("");
  };

  return isLoadingMatches ? (
    <ContentLoading>{spinLoader()}</ContentLoading>
  ) : (
    <>
      <Container>
        <Wrapper>
          {isEmpty(matchesByUser) ? (
            <div className="no-matches">No existe partidos...</div>
          ) : (
            map(matchesByUser, (matches, date) => (
              <div key={date}>
                <Scoreboards onClick={() => console.log(matches)}>
                  {matches.map((match) => (
                    <ScoreboardWrapper
                      key={match.id}
                      isWinner={match.isWinnerUser}
                    >
                      <Scoreboard
                        totalPlayers={get(match, "rule.totalPlayers", 1)}
                      >
                        {orderBy(
                          typePlayers,
                          "index",
                          match.challengerIds.includes(props.user.id)
                            ? "asc"
                            : "desc"
                        ).map((typePlayer, indexTeam) => (
                          <React.Fragment key={`key-player-${indexTeam}`}>
                            <div className="player-container">
                              {Array.from(
                                Array(get(match, "rule.totalPlayers", 1)).keys()
                              ).map((_, index) => (
                                <Player
                                  isChallenged={match.challengedIds.includes(
                                    props.user.id
                                  )}
                                  key={`key-user-${index}`}
                                >
                                  <div className="content-items">
                                    <div className="item-img-user">
                                      <UserImageProfile
                                        size={"medium"}
                                        url={get(
                                          match,
                                          `${typePlayer.is}[${index}].profileImageUrlThumb`,
                                          `${config.storageUrl}/resources/perfil-icon.svg`
                                        )}
                                      />
                                    </div>
                                    <div className="information-items">
                                      <div className="information-name">
                                        {match[typePlayer.is][index].nickname}
                                      </div>
                                    </div>
                                  </div>
                                </Player>
                              ))}
                            </div>
                            {indexTeam === 0 && (
                              <div className="score">
                                <label>
                                  {" "}
                                  {get(
                                    match,
                                    `${typePlayer.is}Points`,
                                    []
                                  ).reduce((a, b) => a + b, 0)}{" "}
                                </label>
                                <label> - </label>
                                <label>
                                  {" "}
                                  {get(
                                    match,
                                    `${typePlayer.opposite}Points`,
                                    ""
                                  ).reduce((a, b) => a + b, 0)}{" "}
                                </label>
                              </div>
                            )}
                          </React.Fragment>
                        ))}
                        <div className="date">
                          {moment(date, "YYYY-MM-DD").format("DD/MM/YYYY")}
                        </div>
                      </Scoreboard>
                    </ScoreboardWrapper>
                  ))}
                </Scoreboards>
              </div>
            ))
          )}
          {limit <= matchesTotal && (
            <Anchor type="primary" onClick={() => setLimit(limit + 5)}>
              Ver más
            </Anchor>
          )}
        </Wrapper>
      </Container>
      {isVisibleMatchHistory && (
        <ModalMatchHistory
          footer={null}
          visible={isVisibleMatchHistory}
          onCancel={() => hiddenMatchHistory()}
        >
          <MatchHistory match={match} />
        </ModalMatchHistory>
      )}
    </>
  );
};

const ModalMatchHistory = styled(Modal)`
  top: 10px;

  ${mediaQuery.afterTablet} {
    top: 50px;
  }

  .ant-modal-content {
    margin-bottom: 50px;
  }

  .ant-modal-close {
    color: ${(props) => props.theme.basic.primary};
  }

  .ant-modal-body {
    background: ${(props) => props.theme.basic.blackDarken};
    color: ${(props) => props.theme.basic.white};
    padding: 2rem 1rem;

    ${mediaQuery.afterTablet} {
      padding: 2.5rem 1.5rem;
    }
  }
`;

const Container = styled.div`
  width: 100%;
`;

const Wrapper = styled.div`
  padding: 1.25rem 0.75rem;
  display: grid;
  grid-gap: 1rem;

  ${mediaQuery.afterTablet} {
    padding: 0 1rem;
  }

  .no-matches {
    padding: 1.5rem 0.5rem;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const Scoreboards = styled.div`
  display: grid;
  grid-gap: 2px;
`;

const ScoreboardWrapper = styled.div`
  height: auto;
  width: 100%;
  background: ${(props) => props.theme.basic.blackDarken};
  border-left: 8px solid
    ${(props) =>
      props.isWinner ? props.theme.basic.primary : props.theme.basic.danger};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
`;

const Scoreboard = styled.div`
  display: grid;
  grid-gap: 0.6rem;
  grid-template-columns: auto 65px auto 50px;
  width: 99%;
  min-width: 200px;

  ${mediaQuery.afterTablet} {
    min-width: 370px;
    width: 55%;
    grid-gap: 1rem;
  }

  .player-container {
    ${(props) =>
      props.totalPlayers > 1
        ? `border: 1px solid ${(props) =>
            props.theme.basic.primary}; ;border-radius: 11px;padding: 5px 5px;`
        : ""};
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .player-container:nth-child(1) {
    .content-items {
      display: flex;
      .item-img-user {
        order: 0;
      }
      .information-items {
        order: 1;
      }
    }
  }

  .player-container:nth-child(3) {
    .content-items {
      display: flex;
      .item-img-user {
        order: 1;
      }
      .information-items {
        order: 0;
      }
    }
  }

  .score {
    display: flex;
    justify-content: space-around;
    align-items: center;
    color: ${(props) => props.theme.basic.white};
    font-size: 13px;
    font-weight: bold;
  }

  .date {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    line-height: 12px;
    color: ${(props) => props.theme.basic.white};
  }
`;

const Player = styled.div`
  width: 100%;
  .content-items {
    display: flex;
    justify-content: space-around;
    align-items: center;

    .item-img-user {
      img {
        width: 25px;
        height: 25px;
        border-radius: 50%;
        margin: 0 0.3rem;
        ${mediaQuery.afterTablet} {
          width: 27px;
          height: 27px;
        }
      }
    }
    .information-items {
      .information {
        display: flex;
        flex-direction: column;
        text-align: ${(props) => (props.isChallenged ? "left" : "right")};

        &-name {
          font-size: 11px;
          color: ${(props) => props.theme.basic.white};
          max-width: 50px;
          text-overflow: ellipsis;
          overflow: hidden;

          ${mediaQuery.afterTablet} {
            font-size: 12px;
          }
        }

        &-level {
          font-size: 10px;

          div {
            text-align: ${(props) => (props.isChallenged ? "left" : "right")};
          }

          ${mediaQuery.afterTablet} {
            font-size: 11px;
          }
        }
      }
    }
  }
`;

const ContentLoading = styled(SpinLoader)`
  .spin-loader {
    .spin-version {
      height: 140px !important;
    }
  }
`;
