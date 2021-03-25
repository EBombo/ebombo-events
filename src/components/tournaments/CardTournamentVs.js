import React, {useEffect, useState} from "reactn";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {ButtonBombo, CardCustom} from "../common";
import {mediaQuery} from "../../styles/constants";
import {useHistory} from "react-router";
import styled from "styled-components";
import moment from "moment";
import {config, firestore} from "../../firebase";
import {UserImageProfile} from "../users/UserImageProfile";
import {Icon} from "../common/Icons";
import {darkTheme} from "../../styles/theme";

export const CardTournamentVs = (props) => {
  const history = useHistory();

  const [tournamentMatch] = useState(props.tournamentMatch);
  const [tournament, setTournament] = useState(props.tournament);

  useEffect(() => {
    if (!isEmpty(tournament)) return;
    fetchTournament();
  }, []);

  useEffect(() => {
    tournamentMatch &&
      console.log(
        "tournamentMatch->",
        moment(tournamentMatch.createAt.toDate()).format(
          "DD/MM/YYYY HH:mm:ss a"
        )
      );
  }, [tournamentMatch]);

  const fetchTournament = async () => {
    const tournamentsRef = await firestore
      .doc("tournaments/" + get(tournamentMatch, "tournamentId", null))
      .get();

    setTournament(tournamentsRef.data());
  };

  return isEmpty(tournamentMatch) || isEmpty(tournament) ? null : (
    <CardCustom border="none" padding="0">
      <ContentCardTournamentVs loser={props.loser}>
        <div className="item-left">
          <img src={get(tournamentMatch, "game.iconUrlThumb")} alt="-" />
        </div>
        <div className="item-center">
          <div className="item-title">
            <div className="title">
              <span>{get(tournament, "name", "FIFA INDIVIDUAL")}</span>
            </div>
            <div className="item">
              <span>
                <Icon type="info-circle" />
                Reglas:
              </span>
              {get(tournament, "rule.name", "Generales")}
            </div>
          </div>
          <div className="item-description">
            <div className="item">
              <span>{get(tournament, "game.name", "-")}</span>
            </div>
            <div className="item">
              <span>{get(tournament, "console.name", "-")}</span>
            </div>
          </div>
          {!props.loser && (
            <div className="item-dates">
              <div className="item-date-start">
                {moment(tournamentMatch.createAt.toDate()).format(
                  "dddd D, hh:mm a"
                )}
              </div>
              <div className="item-date-expire">
                Expira:{" "}
                {moment(tournamentMatch.finishAt.toDate()).format("dddd D,")}
                &nbsp;
                <span className="text-danger">
                  {moment(tournamentMatch.finishAt.toDate()).format("hh:mm a")}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="item-right">
          <div className="item-detail">
            {props.loser ? (
              <div className="items-loser">
                <div className="item-text">Has sido eliminado</div>
                <img
                  src={`${config.storageUrl}/resources/icon-face-sad.svg`}
                  alt="sad eBombo"
                />
              </div>
            ) : (
              <>
                <div className="item">
                  <div className="img-item">
                    <UserImageProfile
                      size={"medium-tournament"}
                      url={
                        tournamentMatch.rule.totalPlayers > 1
                          ? get(
                              tournamentMatch,
                              "challengerTeamImageUrlThumb",
                              `${config.storageUrl}/resources/perfil-icon.svg`
                            )
                          : get(
                              tournamentMatch,
                              "challenger[0].profileImageUrlThumb",
                              `${config.storageUrl}/resources/perfil-icon.svg`
                            )
                      }
                    />
                  </div>
                  <div className="text-item">
                    {tournamentMatch.rule.totalPlayers > 1
                      ? get(
                          tournamentMatch,
                          "challengerTeamName",
                          `${config.storageUrl}/resources/perfil-icon.svg`
                        )
                      : get(
                          tournamentMatch,
                          "challenger[0].nickname",
                          `${config.storageUrl}/resources/perfil-icon.svg`
                        )}
                  </div>
                </div>
                <div className="item">
                  <div className="text-item">VS</div>
                </div>
                <div className="item">
                  <div className="img-item">
                    <UserImageProfile
                      size={"medium-tournament"}
                      url={
                        tournamentMatch.rule.totalPlayers > 1
                          ? get(
                              tournamentMatch,
                              "challengedTeamImageUrlThumb",
                              `${config.storageUrl}/resources/perfil-icon.svg`
                            )
                          : get(
                              tournamentMatch,
                              "challenged[0].profileImageUrlThumb",
                              `${config.storageUrl}/resources/perfil-icon.svg`
                            )
                      }
                    />
                  </div>
                  <div className="text-item">
                    {tournamentMatch.rule.totalPlayers > 1
                      ? get(
                          tournamentMatch,
                          "challengedTeamName",
                          `${config.storageUrl}/resources/perfil-icon.svg`
                        )
                      : get(
                          tournamentMatch,
                          "challenged[0].nickname",
                          `${config.storageUrl}/resources/perfil-icon.svg`
                        )}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="item-btn-enter">
            {props.loser && props.setGoToTournament ? (
              <ButtonBombo
                border={`1px solid ${darkTheme.basic.danger}`}
                color={darkTheme.basic.danger}
                padding=".1rem .8rem"
                fontWeight="600"
                fontSize="12px"
                width="100%"
                onClick={() => props.setGoToTournament(false)}
                margin="0"
              >
                Salir
              </ButtonBombo>
            ) : (
              <ButtonBombo
                background={darkTheme.basic.primary}
                bgColorEvents={darkTheme.basic.primary}
                colorEvents={darkTheme.basic.black}
                border={`1px solid ${darkTheme.basic.primary}`}
                disabled={
                  moment().isBefore(tournamentMatch.createAt.toDate()) ||
                  moment().isAfter(
                    moment(tournamentMatch.finishAt.toDate()).add(1, "hours")
                  )
                }
                color={darkTheme.basic.black}
                padding=".1rem .8rem"
                fontWeight="bold"
                fontSize="16px"
                width="100%"
                margin="0"
                onClick={() =>
                  history.push(`/notifications/matches/${tournamentMatch.id}`)
                }
              >
                Entrar
              </ButtonBombo>
            )}
          </div>
        </div>
      </ContentCardTournamentVs>
    </CardCustom>
  );
};

const ContentCardTournamentVs = styled.section`
  display: grid;
  grid-template-columns: 7% 55% 38%;
  .item-left {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    background: ${(props) => props.theme.basic.danger};
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 80%;
      height: auto;
      filter: grayscale(1) brightness(0);
    }
  }
  .item-center {
    padding: 0.7rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    .item-title {
      .title {
        color: ${(props) => props.theme.basic.primary};
        font-size: 15px;
        font-weight: 700;
        text-align: left;
      }
      .item {
        display: flex;
        flex-wrap: wrap;
        color: ${(props) => props.theme.basic.white};
        font-size: 10px;
        img {
          width: auto;
          height: 10px;
          margin-right: 2px;
        }
        span {
          color: ${(props) => props.theme.basic.primary};
          display: flex;
          align-items: center;
        }
      }
    }
    .item-description {
      padding: 0.4rem 0;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        color: ${(props) => props.theme.basic.white};
        font-size: 12px;
        font-weight: 600;
      }
      .item:last-child {
        font-weight: 300;
      }
    }
    .item-dates {
      font-size: 10px;
      .item-date-start {
        color: ${(props) => props.theme.basic.primary};
      }
      .item-date-expire {
        color: ${(props) => props.theme.basic.white};
        .text-danger {
          color: ${(props) => props.theme.basic.danger};
        }
      }
    }
  }
  .item-right {
    padding: 0.7rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .item-detail {
      display: grid;
      grid-template-columns: ${(props) =>
        props.loser ? "none" : "45% 10% 45%"};
      margin-bottom: 0.5rem;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        .img-item {
          img {
            ${mediaQuery.afterTablet} {
              width: 45px;
              height: 45px;
            }
          }
        }

        .img-player {
          width: 50px;
          height: 50px;
          margin: auto;
          display: flex;
          border-radius: 50px;
          object-fit: cover;
        }
      }
      .text-item {
        font-weight: 600;
        font-size: 10px;
        ${mediaQuery.afterTablet} {
          font-size: 11px;
        }
      }
    }
    .item:nth-child(2) .tex-item {
      font-size: 12px;
      ${mediaQuery.afterTablet} {
        font-size: 17px;
      }
    }
    .items-loser {
      display: flex;
      justify-content: center;
      align-items: center;
      .item-text {
        color: ${(props) => props.theme.basic.danger};
        font-size: 11px;
      }
      img {
        width: 35px;
        height: auto;
        margin-left: 1rem;
      }
    }
  }
  .item-btn-enter {
    padding: 0.2rem 0;
    display: flex;
    justify-content: flex-end;
  }
`;
