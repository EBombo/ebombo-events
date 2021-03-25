import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router";
import { TournamentsContainer } from "./Tournaments";
import { Games } from "../../../../components";
import { TournamentTeamsContainer } from "./TournamentTeams";
import { TournamentMatchesContainer } from "./TournamentMatches";
import isEmpty from "lodash/isEmpty";
import { spinLoader } from "../../../../utils";
import { mediaQuery } from "../../../../styles/constants";
import { Banner } from "../../../../components/banner";

export const Tournaments = (props) => {
  const { gameId, tabId } = useParams();
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const [tournamentTeams] = useGlobal("tournamentTeams");
  const [matches] = useGlobal("matches");
  const [games] = useGlobal("games");
  const [tournamentMatches, setTournamentMatches] = useState([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [tournamentInscriptions, setTournamentInscriptions] = useState([]);

  useEffect(() => {
    const inscriptions_ = tournamentTeams.filter((team) =>
      team.playerIdsAcceptInvitation.includes(authUser.id)
    );
    setTournamentInscriptions(inscriptions_);
    const newMatches = matches.filter((match) => match.tournamentId);
    setTournamentMatches(newMatches);
    setLoadingTournaments(false);
  }, [tournamentTeams, matches]);

  const findGameName = () => {
    if (gameId === "all") return "TODOS";

    return games.find((game) => game.id === gameId).name;
  };

  const bodyContent = () => {
    switch (tabId) {
      case "teams":
        return (
          <Distribution2LeftStyled>
            <DistributionCol>
              <div className="pre-info">
                <div className="title">Inscritos</div>
              </div>
              <TournamentTeamsContainer
                localTournamentTeams={tournamentInscriptions}
                {...props}
              />
            </DistributionCol>
            <div className="right-content" />
          </Distribution2LeftStyled>
        );
      case "matches":
        return (
          <Distribution2LeftStyled>
            <DistributionCol>
              <div className="pre-info">
                <div className="title">Partidos</div>
              </div>
              <TournamentMatchesContainer
                tournamentMatches={tournamentMatches}
                {...props}
              />
            </DistributionCol>
            <div className="right-content" />
          </Distribution2LeftStyled>
        );
      default:
        return (
          <>
            <Distribution2LeftStyled>
              <DistributionCol>
                <Games onClick={onClickGame} allGames />
                <div className="pre-info">
                  <div className="title">Abiertos</div>
                  <div className="game-name">{findGameName()}</div>
                </div>
                <TournamentsContainer {...props} />
              </DistributionCol>
              <div className="right-content">
                <Banner isDesktop />
              </div>
            </Distribution2LeftStyled>
          </>
        );
    }
  };

  const headerContent = () => (
    <div className="tournament-nav">
      <div
        className={`item ${tabId === "open" ? "active" : ""}`}
        onClick={() => onClickTab(`/games/${gameId}/tournaments/open`)}
      >
        Abiertos
      </div>
      <div
        className={`item ${tabId === "teams" ? "active" : ""}`}
        onClick={() => onClickTab(`/games/all/tournaments/teams`)}
      >
        Inscrito
        {!isEmpty(tournamentInscriptions) && (
          <div className="amount">{tournamentInscriptions.length}</div>
        )}
      </div>
      <div
        className={`item ${tabId === "matches" ? "active" : ""}`}
        onClick={() => onClickTab(`/games/all/tournaments/matches`)}
      >
        Partidas
        {!isEmpty(tournamentMatches) && (
          <div className="amount">{tournamentMatches.length}</div>
        )}
      </div>
    </div>
  );

  const onClickTab = (redirect) => history.push(redirect);

  const onClickGame = (game) =>
    history.push(`/games/${game.id}/tournaments/${tabId}`);

  if (loadingTournaments) return spinLoader();

  return (
    <TournamentContainerCss tabId={tabId}>
      {headerContent()}
      {bodyContent()}
    </TournamentContainerCss>
  );
};

const TournamentContainerCss = styled.div`
  width: 100%;
  color: ${(props) => props.theme.basic.white};

  .tournament-nav {
    display: flex;
    align-items: center;
    width: 100%;
    background: ${(props) => props.theme.basic.blackDarken};
    border-bottom: 2px solid ${(props) => props.theme.basic.primaryDark};

    .item {
      height: 100%;
      padding: 0.6rem 0.5rem;
      color: ${(props) => props.theme.colorGrey.grey};
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      cursor: pointer;
      position: relative;

      ${mediaQuery.afterTablet} {
        padding: 0.6rem 1rem;
      }
      .amount {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 9px;
        top: 3px;
        right: -4px;
        margin: 0;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        background: ${(props) => props.theme.basic.primary};
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }

    .item:hover {
      color: ${(props) => props.theme.basic.white};
    }

    .active {
      color: ${(props) => props.theme.basic.white};
      &:after {
        position: absolute;
        content: "";
        border-bottom: 2px solid ${(props) => props.theme.basic.white};
        width: 100%;
        transform: translateX(-50%);
        bottom: -2px;
        left: 50%;
      }
    }
  }
`;

const DistributionCol = styled.div`
  background: ${(props) =>
    props.background ? props.background : "transparent"};
  ${(props) => (props.color ? `color:${props.color};` : "")};
  overflow-y: hidden;
  ${(props) => !isNaN(props.visible) && !props.visible && "display:none;"};

  ${mediaQuery.afterTablet} {
    overflow-y: auto;
    margin: 0;
  }

  margin: 0;
  height: 100%;
  width: 100%;

  .pre-info {
    padding: 0.5rem;
    border-bottom: 0.3px solid ${(props) => props.theme.basic.whiteDarken};

    .title {
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.primary};
      margin-bottom: 1rem;
    }

    .game-name {
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.whiteDarken};
    }
  }
`;

export const Distribution2LeftStyled = styled.div`
  color: ${(props) => props.theme.basic.white};
  height: 100%;
  width: 100%;
  padding-bottom: ${(props) => (props.footerBar ? props.footerBar : "0px")};

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 2fr 1fr;
    min-height: 100vh;
    width: 100%;
    padding: 0;

    .right-content {
      background: ${(props) => props.theme.basic.blackDarken};
    }
  }
`;
