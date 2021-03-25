import React, {useEffect, useGlobal, useState} from "reactn";
import {Upload} from "../../../../../../../components";
import {ModalContainer} from "../../../../../../../components/common/ModalContainer";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import reduce from "lodash/reduce";
import orderBy from "lodash/orderBy";
import {config} from "../../../../../../../firebase";
import {UserImageProfile} from "../../../../../../../components/users/UserImageProfile";
import styled from "styled-components";
import {Icon} from "../../../../../../../components/common/Icons";
import {useErrorHandler} from "react-error-boundary";
import {mediaQuery} from "../../../../../../../styles/constants";
import {ModalUpdatePointsBattleRoyale} from "./ModalUpdatePointsBattleRoyale";
import {MatchHeadersBattleRoyale} from "./MatchHeadersBattleRoyale";
import {useOwnFetch} from "../../../../../../../utils/useFetch/useFetch";

export const ContainerTableStatisticsBattleRoyale = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleModalPoints, setIsVisibleModalPoints] = useState(false);
  const [viewTeam, setViewTeam] = useState([]);
  const [currentTeam, setCurrentTeam] = useState({});
  const [currentScore, setCurrentScore] = useState({});
  const [indexMatch, setIndexMatch] = useState(0);
  const [loadingScore, setLoadingScore] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    const myTeam = defaultTo(props.tournamentTeams, []).find(
      (team) => team.playerIds[0] === get(authUser, "id")
    );

    if (!myTeam) return setCurrentTeam({});

    setCurrentTeam(myTeam);
    setIndexMatch(get(myTeam, "score", []).length);
  }, [props.tournamentTeams, authUser]);

  const saveScore = async () => {
    setLoadingScore(true);
    try {
      await ownFetch(
        `${config.serverUrl}/tournament-teams/${get(currentTeam, "id")}/score`,
        "PUT",
        {
          score: currentScore,
          indexMatch,
        }
      );
    } catch (error) {
      handleError({ ...error, action: "saveScore" });
    }
    setLoadingScore(false);
    setIsVisibleModalPoints(false);
  };

  const modalPoints = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleModalPoints}
      onCancel={() => setIsVisibleModalPoints(false)}
    >
      <ModalUpdatePointsBattleRoyale
        {...props}
        currentScore={currentScore}
        currentTeam={currentTeam}
        setCurrentScore={setCurrentScore}
        indexMatch={indexMatch}
        saveScore={saveScore}
        loadingScore={loadingScore}
        setIsVisibleModalPoints={setIsVisibleModalPoints}
      />
    </ModalContainer>
  );

  const reduceScoreWithOutPosition = (score) =>
    reduce({ ...score, position: 0 }, (sum, value) => sum + value, 0);

  const totalScore = (score) =>
    score.reduce((sum, score_) => sum + reduceScoreWithOutPosition(score_), 0);

  const pointPerPosition = (position) => {
    if (position < 1 || position > 40) return 0;
    if (position === 1) return 15;
    if (position <= 10) return 10;
    if (position <= 20) return 8;
    if (position <= 30) return 6;
    if (position <= 40) return 4;
  };

  const reducePointsPerPosition = (score) =>
    score.reduce(
      (sum, score) => sum + pointPerPosition(get(score, "position", 0)),
      0
    );

  const saveTeamImage = async (teamImageUrls, team_) => {
    try {
      await ownFetch(
        `${config.serverUrl}/tournament-teams/${team_.id}/evidences`,
        "PUT",
        { teamImageUrls }
      );
    } catch (error) {
      handleError({ ...error, action: "saveTeamImage" });
    }
  };

  return (
    <div style={{ overflow: "auto" }}>
      <ContainerTableCss>
        {isVisibleModalPoints && modalPoints()}
        {!isEmpty(currentTeam) && (
          <MatchHeadersBattleRoyale
            {...props}
            listMatches={props.listMatches}
            setIndexMatch={setIndexMatch}
            setCurrentScore={setCurrentScore}
            setIsVisibleModalPoints={setIsVisibleModalPoints}
            currentTeam={currentTeam}
          />
        )}
        <div className="title">Equipos</div>
        <div className="table">
          <div className="header big">
            <div>Puesto</div>
            <div>Equipos</div>
            <div>Total Puntos</div>
            <div>Total Bajas</div>
            <div>Total Pts</div>
          </div>
          {orderBy(
            get(props, "tournamentTeams", []),
            [
              (team) =>
                totalScore(get(team, "score", [0])) +
                reducePointsPerPosition(get(team, "score", [])),
            ],
            ["desc"]
          ).map((team, index) => (
            <React.Fragment key={`key-b-r-${team.id}`}>
              <div className="body big border-bottom">
                <div>{index + 1}</div>
                <div
                  className={`team no-wrap ${
                    get(team, "playerIds", []).includes(
                      get(authUser, "id", null)
                    ) && "my-team"
                  }`}
                  onClick={() =>
                    viewTeam.includes(team.id)
                      ? setViewTeam(
                          viewTeam.filter((teamId) => teamId !== team.id)
                        )
                      : setViewTeam([...viewTeam, team.id])
                  }
                >
                  <UserImageProfile
                    size={"medium"}
                    url={
                      props.tournament.rule.totalPlayers === 1
                        ? team.players[0].profileImageUrlThumb
                          ? team.players[0].profileImageUrlThumb
                          : `${config.storageUrl}/resources/perfil-icon.svg`
                        : team.teamImageUrlThumb
                        ? team.teamImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                    }
                  />
                  <div className="no-wrap">
                    {props.tournament.rule.totalPlayers > 1
                      ? team.name
                      : team.players[0].nickname}
                  </div>
                  {viewTeam.includes(team.id) ? (
                    <Icon type="caret-up" />
                  ) : (
                    <Icon type="caret-down" />
                  )}
                </div>
                <div>{reducePointsPerPosition(get(team, "score", []))}</div>
                <div>{totalScore(get(team, "score", [0]))}</div>
                <div>
                  +
                  {totalScore(get(team, "score", [0])) +
                    reducePointsPerPosition(get(team, "score", []))}
                </div>
              </div>
              {viewTeam.includes(team.id) ? (
                isEmpty(team.score) ? (
                  <div className="match-empty">
                    No ha jugado ninguna partida por el momento
                  </div>
                ) : (
                  <div className="sub-content">
                    <div className="header small">
                      <div>Partida</div>
                      <div>Jugador</div>
                      <div>Puesto</div>
                      <div>Bajas</div>
                      <div>Total Bajas</div>
                    </div>
                    {get(team, "score", []).map((score, index_) => (
                      <div
                        className="body small border-bottom"
                        key={`key-score-${index_}`}
                      >
                        <div className="match-number">
                          <div>{index_ + 1}</div>
                          {get(authUser, "isAdmin", false) && (
                            <div
                              onClick={() => {
                                setCurrentTeam(team);
                                setIndexMatch(index_);
                                console.log("score->", score);
                                setCurrentScore(score);
                                setIsVisibleModalPoints(true);
                              }}
                              style={{ cursor: "pointer" }}
                            >
                              [EDITAR]
                            </div>
                          )}
                          {get(team, "playerIds[0]", []).includes(
                            get(authUser, "id")
                          ) &&
                            !get(
                              team,
                              `pointsUrl${index_ + 1}` &&
                                !get(authUser, "isAdmin")
                            ) && (
                              <UploadCss>
                                <Upload
                                  isImage={true}
                                  listType="picture-card"
                                  accept="image/*"
                                  bucket="tournamentTeams"
                                  filePath={`tournamentTeams/${team.id}`}
                                  fileName={`points${index_ + 1}`}
                                  name={`pointsUrl${index_ + 1}`}
                                  document={team}
                                  afterUpload={(team_) =>
                                    saveTeamImage(team_, team)
                                  }
                                  sizeResized="300x300"
                                />
                              </UploadCss>
                            )}
                        </div>
                        <div className="users">
                          {team.players.map((user) => (
                            <div
                              key={`key-user-player-${user.id}`}
                              className={`user no-wrap ${
                                get(team, "playerIds[0]") === get(user, "id")
                                  ? "captain"
                                  : ""
                              }`}
                            >
                              <UserImageProfile
                                url={get(
                                  user,
                                  "profileImageUrlThumb",
                                    `${config.storageUrl}/resources/perfil-icon.svg`
                                )}
                              />
                              <div>{user.nickname}</div>
                            </div>
                          ))}
                        </div>
                        <div>
                          {get(score, "position", 0)} [
                          {pointPerPosition(get(score, "position", 0))}pts]
                        </div>
                        <div className="score">
                          {team.players.map((user) => (
                            <div
                              className="no-wrap"
                              key={`key-user-score-${user.id}`}
                            >
                              {get(score, `[${user.id}]`, 0)}
                            </div>
                          ))}
                        </div>
                        <div>+{reduceScoreWithOutPosition(score)}</div>
                      </div>
                    ))}
                  </div>
                )
              ) : null}
            </React.Fragment>
          ))}
        </div>
      </ContainerTableCss>
    </div>
  );
};

const UploadCss = styled.div`
  .ant-upload-list-picture-card-container,
  .ant-upload {
    width: 90px;
    height: auto;

    .ant-upload-list-item {
      width: 50px;
      height: 50px;

      div {
        padding: 0 !important;
      }
    }
  }

  button {
    padding: 5px;
  }
`;

const ContainerTableCss = styled.div`
  min-width: 600px;

  .title {
    padding: 10px 0;
    font-size: 1rem;
    font-weight: bold;
    color: ${(props) => props.theme.basic.white};
  }

  .table {
    .match-empty {
      color: ${(props) => props.theme.basic.white};
      text-align: center;
    }

    .sub-content {
      margin-bottom: 10px;
    }

    .header,
    .body {
      display: grid;
      grid-template-columns: 10% 30% 20% 20% 20%;
      color: ${(props) => props.theme.basic.white};
      text-align: center;

      .captain {
        color: ${(props) => props.theme.basic.action} !important;
      }

      .team,
      .user {
        cursor: pointer;
        width: 100%;
        min-width: 50px;
        display: grid;
        grid-template-columns: auto auto auto;
        margin: auto;
        padding: 10px 0;

        div {
          margin: auto 5px;
        }

        .anticon {
          margin: auto;
        }
      }

      .score,
      .users {
        display: grid;
        height: 100%;
      }

      .my-team {
        color: ${(props) => props.theme.basic.action};
      }
    }

    .header {
      background: ${(props) => props.theme.basic.blackDarken};
    }

    .body {
      background: ${(props) => props.theme.basic.blackLighten};

      div,
      i {
        margin: auto;
      }
    }

    .big {
      font-size: 0.9rem;
      font-weight: bold;
      padding: 10px 0;
    }

    .small {
      padding: 10px 0;
      font-size: 0.7rem;
      margin: 0 50px;

      ${mediaQuery.afterTablet} {
        margin: 0 10vw;
      }
    }

    .match-number {
      margin-top: 10px !important;
    }

    .border-bottom {
      border-bottom: 1px solid ${(props) => props.theme.basic.blackDarken};
    }
  }
`;
