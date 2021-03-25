import React, { useEffect, useGlobal, useState } from "reactn";
import styled, { ThemeProvider } from "styled-components";
import { Desktop, Tablet } from "../../../../../../../styles/utils";
import { firestore } from "../../../../../../../firebase";
import defaultTo from "lodash/defaultTo";
import isEmpty from "lodash/isEmpty";
import { useHistory, useParams } from "react-router";
import { snapshotToArray, spinLoader } from "../../../../../../../utils";
import { BannerGame } from "../../../../../../../components/common/BannerGame";
import { LeagueDescription } from "./LeagueDescription";
import { LeagueContent } from "./LeagueContent";
import { darkTheme } from "../../../../../../../styles/theme";
import get from "lodash/get";

export const League = (props) => {
  const history = useHistory();
  const { leagueId } = useParams();

  const [authUser] = useGlobal("user");
  const [, setCurrentTournament] = useGlobal("currentTournament");
  const [isVisiblePasswordModal, setIsVisiblePasswordModal] = useGlobal(
    "isVisiblePasswordModal"
  );

  const [league, setLeague] = useState({});
  const [leagueGroups, setLeagueGroups] = useState([]);
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [loadingLeague, setLoadingLeague] = useState(true);
  const [loadingLeagueGroups, setLoadingLeagueGroups] = useState(true);
  const [, setLoadingLeagueTeams] = useState(true);

  useEffect(() => {
    const unSub = fetchLeague();
    return () => unSub && unSub();
  }, [leagueId]);

  useEffect(() => {
    const unSub = fetchLeagueGroups();
    return () => unSub && unSub();
  }, [leagueId]);

  useEffect(() => {
    const unSub = fetchLeagueTeams();
    return () => unSub && unSub();
  }, [leagueId]);

  useEffect(() => {
    if (
      !league ||
      isEmpty(league.password) ||
      get(league, "playerIds").includes(get(authUser, "id"))
    )
      return;

    let localTournaments = defaultTo(
      JSON.parse(localStorage.getItem("tournaments")),
      []
    );

    const localTournament = localTournaments.some(
      (localTournament) =>
        localTournament.id === league.id &&
        localTournament.password === league.password
    );

    if (!localTournament) {
      setCurrentTournament(league);
      setIsVisiblePasswordModal(true);
    }
  }, [league, isVisiblePasswordModal]);

  const fetchLeague = () =>
    firestore
      .collection("tournaments")
      .doc(leagueId)
      .onSnapshot((snapshot) => {
        if (!snapshot.exists) return history.push("/");
        setLeague(snapshot.data());
        setLoadingLeague(false);
      });

  const fetchLeagueGroups = () =>
    firestore
      .collection("tournamentGroups")
      .where("tournamentId", "==", leagueId)
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setLeagueGroups(snapshotToArray(snapshot));
        setLoadingLeagueGroups(false);
      });

  const fetchLeagueTeams = () =>
    firestore
      .collection("tournamentTeams")
      .where("tournamentId", "==", leagueId)
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setLeagueTeams(snapshotToArray(snapshot));
        setLoadingLeagueTeams(false);
      });

  return loadingLeague || loadingLeagueGroups ? (
    spinLoader()
  ) : (
    <ThemeProvider
      theme={{ basic: { ...darkTheme.basic, ...darkTheme.ripley } }}
    >
      <Desktop>
        <ContainerLeagueDesktop>
          <div className="banner-container">
            <BannerGame
              image={
                league.tournamentBannerUrl
                  ? league.tournamentBannerUrl
                  : league.game.historyImageDskUrlThumb
              }
            />
            <div className="league-info">
              <h2>{league.name}</h2>
              <img src={league.tournamentPlublicityUrl} alt="" />
            </div>
          </div>
          <div className="description">
            <LeagueDescription isLeague requirements={league.requirements} />
          </div>
          <div className="content">
            {!isEmpty(leagueTeams) && (
              <LeagueContent
                league={league}
                leagueGroups={leagueGroups}
                leagueTeams={leagueTeams}
                {...props}
              />
            )}
          </div>
        </ContainerLeagueDesktop>
      </Desktop>

      <Tablet>
        <ContainerLeagueMobile>
          <div className="banner-container">
            <BannerGame
              image={
                league.tournamentBannerUrl
                  ? league.tournamentBannerUrl
                  : league.game.historyImageDskUrlThumb
              }
            />
            <div className="league-info">
              <h2>{league.name}</h2>
              <img src={league.tournamentPlublicityUrl} alt="" />
            </div>
          </div>
          <div className="content">
            <LeagueContent
              league={league}
              leagueGroups={leagueGroups}
              leagueTeams={leagueTeams}
              {...props}
            />
          </div>
        </ContainerLeagueMobile>
      </Tablet>
    </ThemeProvider>
  );
};

const ContainerLeagueDesktop = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 10rem repeat(2, auto);
  color: ${(props) => props.theme.basic.white};
  background: ${(props) => props.theme.basic.blackLighten};
  min-height: 100vh;

  .banner-container {
    grid-column: span 2;
    position: relative;
    height: 10rem;

    .league-info {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      top: 0;
      left: 0;
      padding: 0 40px;

      h2 {
        font-weight: 600;
        font-size: 17px;
        line-height: 21px;
        color: ${(props) => props.theme.basic.white};
      }
    }
  }

  .description {
    grid-column: 3/4;
    grid-row: span 3;
    background: ${(props) => props.theme.basic.default};
  }

  .content {
    background: ${(props) => props.theme.basic.blackLighten};
    grid-column: span 2;
    grid-row: span 2;
  }
`;

const ContainerLeagueMobile = styled.section`
  min-height: 100vh;
  background: ${(props) => props.theme.basic.blackLighten};
  color: ${(props) => props.theme.basic.white};

  .content {
    background: ${(props) => props.theme.basic.blackLighten};
  }

  .banner-container {
    position: relative;
    height: 10rem;

    .league-info {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      top: 0;
      left: 0;
      padding: 0 10px;

      h2 {
        font-weight: 600;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.white};
      }

      img {
        height: 50%;
      }
    }
`;
