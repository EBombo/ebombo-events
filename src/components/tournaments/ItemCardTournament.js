import React, {useEffect, useGlobal, useState} from "reactn";
import {ModalAwards} from "../index";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";
import {useHistory, useParams} from "react-router";
import moment from "moment";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {Icon} from "../common/Icons";
import {gaTournament, spinLoader} from "../../utils";
import {ModalContainer} from "../common/ModalContainer";
import {firestore} from "../../firebase";
import {Anchor} from "../common/Anchor";
import {GameConsole} from "../common/GameConsole";

export const ItemCardTournament = (props) => {
  const { tournamentId } = useParams();
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const [totalAwardAmount, setTotalAwardAmount] = useState(0);
  const [isVisibleAwardsModal, setIsVisibleAwardsModal] = useState(false);
  const [settings] = useGlobal("settings");
  const [currency] = useGlobal("currentCurrency");
  const [, setCurrentTournament] = useGlobal("currentTournament");
  const [isVisibleTournamentRules, setIsVisibleTournamentRules] = useState(
    false
  );
  const [tournament, setTournament] = useState(props.tournament || null);
  const [isLoading, setIsLoading] = useState(!props.tournament);

  useEffect(() => {
    props.update && fetchTournament();
  }, []);

  useEffect(() => {
    if (tournament) {
      let commission = +get(settings, "commission", 15) / 100;

      if (!tournament.realMoney) commission = 0;

      const awardPercentage = +(1 - commission).toFixed(2);

      const amount =
        get(tournament, "awardType", "") === "variable"
          ? +(
              +get(tournament, "entryCost", 0) *
              +get(tournament, "countTournamentTeams", 0) *
              awardPercentage
            )
          : get(tournament, "fixedAwards", [])
              .filter((award) => award.awardType !== "ebCoins")
              .reduce((sum, a) => sum + a.amount, 0);

      setTotalAwardAmount(+amount.toFixed(2));
    }
  }, [tournament]);

  const fetchTournament = () =>
    firestore
      .doc(`tournaments/${props.tournament.id}`)
      .onSnapshot((snapShot) => {
        if (!snapShot.exists) return history.goBack();
        setTournament(snapShot.data());
        setIsLoading(false);
      });

  const redirectTournament = () => {
    if (tournamentId) return setIsVisibleTournamentRules(true);

    setCurrentTournament(tournament);

    authUser &&
      gaTournament(`2 Starting Tournament Clicked ${tournament.name}`);

    if (!isEmpty(tournament.password)) return;

    history.push(
      `/games/${tournament.game.id}/consoles/${tournament.console.id}/tournaments/${tournament.id}`
    );
  };

  const playingMoney = () => {
    if (get(tournament, "awardType") === "variable") return;

    const amount_ = get(tournament, "fixedAwards", [])
      .filter((award) => award.awardType === "ebCoins")
      .reduce((sum, a) => sum + +get(a, "amount", 0), 0);

    if (amount_) return `${amount_}K`;
  };

  const verifyAwards = () =>
    get(tournament, "fixedAwards", []).some(
      (award) => award.awardType === "ebCoins"
    ) &&
    get(tournament, "fixedAwards", []).some(
      (award) => award.awardType === "money" || award.awardType === "credit"
    );

  const realMoney = () => {
    if (get(tournament, "awardType") === "variable")
      return `${currency}${totalAwardAmount}`;

    const amount_ = get(tournament, "fixedAwards", [])
      .filter((award) => award.awardType !== "ebCoins")
      .reduce((sum, a) => sum + +get(a, "amount", 0), 0);

    if (amount_) return `${currency} ${amount_}`;

    return "Por Definir";
  };

  if (isLoading) return spinLoader();

  return (
    <>
      {isVisibleAwardsModal && (
        <ModalContainer
          visible={isVisibleAwardsModal}
          onCancel={() => setIsVisibleAwardsModal(!isVisibleAwardsModal)}
          footer={null}
        >
          <ModalAwards
            tournament={tournament}
            totalAward={totalAwardAmount}
            setIsVisibleAwardsModal={setIsVisibleAwardsModal}
          />
        </ModalContainer>
      )}
      {isVisibleTournamentRules && (
        <ModalContainer
          visible={isVisibleTournamentRules}
          setIsVisibleModal={setIsVisibleTournamentRules}
          onCancel={() => setIsVisibleTournamentRules(false)}
          footer={null}
        >
          <ContainerRequirementsGeneral>
            <div className="item-title">Requisitos generales:</div>
            <div className="requeriments">
              {get(tournament, "requirements", "")}
            </div>
          </ContainerRequirementsGeneral>
        </ModalContainer>
      )}
      {props.completeView && (
        <TournamentComplete>
          <BannerContainer tournament={tournament}>
            <div className="rules">
              <Anchor
                type="primary"
                fontSize="11px"
                textAlign="left"
                onClick={() => setIsVisibleTournamentRules(true)}
              >
                <Icon type="info-circle" className="icon" />
                Ver Reglas
              </Anchor>
            </div>
          </BannerContainer>
          <div className="first-content">
            <div className="tournament-name">{tournament.name}</div>
            <div className="tournament-status">
              {moment().isBefore(tournament.startDate.toDate())
                ? "Abierto"
                : moment().isBefore(tournament.endDate.toDate())
                ? "En juego"
                : "Culminado"}
            </div>
          </div>
          <div className="second-content">
            <div className="tournament-game">
              <div className="game-name">{tournament.game.name}</div>
              <GameConsole gameConsole={tournament.console} />
            </div>
            <div className="tournament-award">
              <div className="subtitle">Premio</div>
              <div className="award">
                <InfoIcon
                  type="info-circle"
                  onClick={() => setIsVisibleAwardsModal(true)}
                />
                {realMoney()}
                {!get(tournament, "awardType") === "variable" &&
                  verifyAwards() &&
                  "/"}
                {playingMoney()}
              </div>
            </div>
          </div>
          <div className="third-content">
            <div className="teams">
              Inscritos:{" "}
              <span key={tournament.countTournamentTeams}>
                {get(tournament, "countTournamentTeams", 0)}/
                {get(tournament, "playersLimit", 0)}
              </span>
            </div>
            <div className="entry-cost">
              Entrada:{" "}
              <span>
                {get(tournament, "realMoney", true)
                  ? get(tournament, "entryCost", 0) === 0
                    ? "Gratis"
                    : `${currency}${get(tournament, "entryCost", 0)}`
                  : `${get(tournament, "entryCost", 0)}K`}
              </span>
            </div>
          </div>
          <div className="fourth-content">
            <div className="left-side">
              <span className="subtitle">Reglas:</span>
              <div className="rule">
                <Icon type="info-circle" />
                {get(tournament, "rule.name", "")}
              </div>
              <span className="subtitle">Tipo de torneo:</span>
              <div className="tournament-type">
                {tournament.tournamentType === "groupko"
                  ? "Grupos + Eliminación directa"
                  : tournament.tournamentType === "knock-out"
                  ? "Eliminación directa"
                  : "Grupos"}
              </div>
            </div>
            <div className="right-side">
              <span>Cierre de inscripciones</span>
              <div className="info">
                {moment(tournament.inscriptionDate.toDate()).format(
                  "DD MMM hh:mm a"
                )}
              </div>
              <span>Inicio del torneo</span>
              <div className="info">
                {moment(get(tournament, "startDate", "").toDate()).format(
                  "DD MMM hh:mm a"
                )}
              </div>
            </div>
          </div>
        </TournamentComplete>
      )}
      {!props.completeView && (
        <div style={{ position: "relative" }}>
          <ContainerItemCardTournament
            tournament={tournament}
            isMobile={props.isMobile}
          >
            <div className="first-section">
              <div className="name">{get(tournament, "name", "")}</div>
              <Anchor
                type="primary"
                onClick={() => redirectTournament()}
                textAlign="left"
              >
                Ver Torneo
              </Anchor>
            </div>
            <div className="second-section">
              <div className="rules">
                <Anchor
                  type="primary"
                  onClick={() => setIsVisibleTournamentRules(true)}
                  fontSize="11px"
                  textAlign="left"
                >
                  <Icon type="info-circle" className="icon" />
                  Ver Reglas
                </Anchor>
              </div>
            </div>
            <div className="third-section">
              <div className="first-content">
                <div className="game-name">
                  {get(tournament, "game.name", "")}
                </div>
                <div className="rule-name">
                  {get(tournament, "rule.name", "")}
                </div>
                <div className="money-container">
                  <div className="entry-cost">
                    Entrada:{" "}
                    <span>
                      {get(tournament, "realMoney", true)
                        ? get(tournament, "entryCost", 0) === 0
                          ? "Gratis"
                          : `${currency}${get(tournament, "entryCost", 0)}`
                        : `${get(tournament, "entryCost", 0)}K`}
                    </span>
                  </div>
                  <div className="divider">
                    <Line />
                  </div>
                  <div className="price">
                    Premio:{" "}
                    <span>
                      {realMoney()}
                      {!get(tournament, "awardType") === "variable" &&
                        verifyAwards() &&
                        "/"}
                      {playingMoney()}
                      <InfoIcon
                        type="info-circle"
                        onClick={() => setIsVisibleAwardsModal(true)}
                      />
                    </span>
                  </div>
                </div>
                <div className="dates">
                  <div className="start-date">
                    <div className="subtitle">Inicio del torneo</div>
                    <div className="info">
                      {moment(get(tournament, "startDate", "").toDate()).format(
                        "DD MMM hh:mm a"
                      )}
                    </div>
                  </div>
                  <div className="close-date">
                    <div className="subtitle">Cierre de inscripciones</div>
                    <div className="info">
                      {moment(tournament.inscriptionDate.toDate()).format(
                        "DD MMM hh:mm a"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="second-content">
                <div className="status">
                  {moment().isBefore(tournament.startDate.toDate())
                    ? "Abierto"
                    : moment().isBefore(tournament.endDate.toDate())
                    ? "En juego"
                    : "Culminado"}
                </div>
                <div className="inscriptions">
                  {get(
                    tournament,
                    "countTournamentTeams",
                    get(tournament, "countTournamentUsers", 0)
                  )}
                  /{get(tournament, "playersLimit", 0)} equipos
                </div>
                <GameConsole gameConsole={get(tournament, "console", "")} />
              </div>
            </div>
          </ContainerItemCardTournament>
        </div>
      )}
    </>
  );
};

const Line = styled.div`
  height: 100%;
  width: 1px;
  background: ${(props) => props.theme.basic.grayLighten};
`;

const ContainerItemCardTournament = styled.section`
  width: 100%;
  height: auto;
  align-items: center;
  margin: 1rem 0;

  ${mediaQuery.afterMobile} {
    max-width: 375px;
    margin: 1rem auto;
  }

  .first-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px;

    .name {
      font-weight: bold;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.whiteDarken};
    }
    a {
      padding-right: 10px;
    }
  }

  .second-section {
    position: relative;
    width: 100%;
    height: 120px;
    background: url(${(props) =>
      props.tournament.tournamentBannerUrlThumb
        ? props.tournament.tournamentBannerUrlThumb
        : props.tournament.game.homeImageDskUrlThumb});
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border-top: 2px solid
      ${(props) =>
        props.tournament.game.color
          ? `${props.tournament.game.color}80`
          : props.theme.basic.whiteDarken};
    border-bottom: 2px solid
      ${(props) =>
        props.tournament.game.color
          ? `${props.tournament.game.color}80`
          : props.theme.basic.whiteDarken};

    .rules {
      width: 100%;
      height: 100%;
      padding: 0.5rem;
      background: linear-gradient(
        0deg,
        transparent 0%,
        transparent,
        0%,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0.5) 100%
      );
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      .icon {
        margin-right: 5px;
      }
    }
  }

  .third-section {
    padding: 0.5rem;
    background: ${(props) => props.theme.basic.blackDarken};
    border-bottom: 2px solid ${(props) => props.theme.basic.primary}80;
    display: grid;
    grid-template-columns: 2fr 1fr;
    min-height: 125px;

    .first-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;

      .game-name {
        font-weight: 600;
        font-size: 11px;
        line-height: 14px;
        color: ${(props) => props.tournament.game.color};
      }

      .rule-name {
        font-weight: 600;
        font-size: 11px;
        line-height: 14px;
        color: ${(props) => props.theme.basic.white};
      }

      .money-container {
        display: flex;
        align-items: center;

        .entry-cost {
          font-weight: 500;
          font-size: 10px;
          line-height: 12px;
          color: ${(props) => props.theme.basic.grayLighten};
          margin-right: 10px;

          span {
            font-size: 12px;
            line-height: 14px;
            color: ${(props) => props.theme.basic.white};
          }
        }

        .price {
          font-weight: 500;
          font-size: 10px;
          line-height: 12px;
          color: ${(props) => props.theme.basic.grayLighten};
          margin-left: 10px;

          span {
            font-size: 14px;
            line-height: 16px;
            color: ${(props) => props.theme.basic.primary};
          }
        }

        .divider {
          width: 10px;
          height: 100%;
          display: flex;
          justify-content: center;
        }
      }

      .dates {
        display: flex;

        .start-date {
          margin-right: 10px;
        }

        .start-date,
        .close-date {
          .subtitle {
            font-weight: 500;
            font-size: 10px;
            line-height: 12px;
            color: ${(props) => props.theme.basic.primary};
          }

          .info {
            font-weight: 500;
            font-size: 11px;
            line-height: 13px;
            color: ${(props) => props.theme.basic.white};
            margin-bottom: 0.5rem;
          }
        }
      }
    }

    .second-content {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-end;

      .status {
        padding-right: 5px;
        font-size: 11px;
        line-height: 13px;
        color: ${(props) => props.theme.basic.primary};
        display: flex;
        align-items: center;
      }

      .status::before {
        content: "";
        display: inline-block;
        width: 4px;
        height: 4px;
        -moz-border-radius: 2px;
        -webkit-border-radius: 2px;
        border-radius: 2px;
        background-color: ${(props) => props.theme.basic.primary};
        margin-right: 5px;
      }

      .inscriptions {
        font-weight: bold;
        font-size: 11px;
        line-height: 14px;
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
`;

const InfoIcon = styled(Icon)`
  font-size: 12px;
  color: ${(props) => props.theme.basic.primary};
  margin-left: 5px;
`;

const ContainerRequirementsGeneral = styled.div`
  color: ${(props) => props.theme.basic.white};
  margin: 1rem 0;

  .item-title {
    font-weight: 600;
    font-size: 14px;
    text-align: left;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.basic.primary};
  }

  .requeriments {
    white-space: pre-line;
  }
`;

const TournamentComplete = styled.div`
  width: 100%;

  .first-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

    .tournament-name {
      font-weight: bold;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.whiteDarken};

      ${mediaQuery.afterTablet} {
        font-size: 15px;
        line-height: 19px;
      }
    }

    .tournament-status {
      font-weight: 600;
      font-size: 8px;
      line-height: 10px;
      color: ${(props) => props.theme.basic.primary};
      display: flex;
      align-items: center;

      ${mediaQuery.afterTablet} {
        font-size: 11px;
        line-height: 14px;
      }
    }

    .tournament-status::before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 2px;
      background-color: ${(props) => props.theme.basic.primary};
      margin-right: 5px;
    }
  }

  .second-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

    .tournament-game {
      display: flex;
      flex-direction: column;

      .game-name {
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.action};
      }
    }

    .tournament-award {
      display: flex;
      flex-direction: column;
      align-items: center;

      .subtitle {
        font-size: 12px;
        line-height: 15px;
        color: ${(props) => props.theme.basic.white};
      }

      .award {
        display: flex;
        align-items: center;
        font-weight: 500;
        font-size: 20px;
        line-height: 25px;
        color: ${(props) => props.theme.basic.primary};

        span {
          margin-right: 5px;
        }
      }
    }
  }

  .third-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

    .teams {
      font-size: 11px;
      line-height: 14px;
      color: ${(props) => props.theme.basic.white};

      span {
        font-weight: 600;
      }
    }

    .entry-cost {
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.white};

      span {
        font-weight: 600;
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }

  .fourth-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

    .left-side {
      display: flex;
      flex-direction: column;

      .subtitle {
        font-weight: 500;
        font-size: 9px;
        line-height: 11px;
        color: ${(props) => props.theme.basic.grayLighten};
      }

      .rule,
      .tournament-type {
        font-weight: 500;
        font-size: 11px;
        line-height: 14px;
        color: ${(props) => props.theme.basic.white};

        span {
          color: ${(props) => props.theme.basic.primary};
          margin-right: 5px;
        }
      }

      .rule {
        margin-bottom: 0.5rem;
      }
    }

    .right-side {
      display: flex;
      flex-direction: column;
      align-items: flex-end;

      span {
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;
        color: ${(props) => props.theme.basic.primary};
      }

      .info {
        font-weight: 500;
        font-size: 11px;
        line-height: 14px;
        color: ${(props) => props.theme.basic.white};
      }
    }
  }
`;

const BannerContainer = styled.div`
  width: 100%;
  height: 125px;
  background: url(${(props) =>
    props.tournament.tournamentBannerUrlThumb
      ? props.tournament.tournamentBannerUrlThumb
      : props.tournament.game.homeImageDskUrlThumb});
  background-size: cover;
  background-repeat: no-repeat;
  border-bottom: 2px solid ${(props) => props.theme.basic.primary}80;

  ${mediaQuery.afterTablet} {
    height: 200px;
  }

  .rules {
    width: 100%;
    height: 100%;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    .icon {
      margin-right: 5px;
    }

    ${mediaQuery.afterTablet} {
      padding: 1rem;
    }
  }
`;
