import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import { TabsStatistics } from "./TabsStatistics";
import { CardAdvertising } from "./CardAdvertising";
import { mediaQuery } from "../../../../../../../styles/constants";
import styled from "styled-components";
import { useHistory, useParams } from "react-router";
import { snapshotToArray, spinLoader } from "../../../../../../../utils";
import { config, firestore } from "../../../../../../../firebase";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import moment from "moment";
import { ItemCardTournament } from "../../../../../../../components/tournaments/ItemCardTournament";
import { Inscription } from "./Inscription";
import { ContainerTableStatisticsBattleRoyale } from "./ContainerTableStatisticsBattleRoyale";
import { useErrorHandler } from "react-error-boundary";
import { HeaderBattleRoyale } from "./HeaderBattleRoyale";
import { useOwnFetch } from "../../../../../../../utils/useFetch/useFetch";

export const Tournament = (props) => {
  const history = useHistory();
  const { tournamentId } = useParams();

  const [authUser] = useGlobal("user");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [, setIsVisibleModalUserAccount] = useGlobal(
    "isVisibleModalUserAccount"
  );
  const [, setCurrentTournament] = useGlobal("currentTournament");
  const [isVisiblePasswordModal, setIsVisiblePasswordModal] = useGlobal(
    "isVisiblePasswordModal"
  );

  const [loadingInscription, setLoadingInscription] = useState(false);
  const [loadingTournament, setLoadingTournament] = useState(true);

  const [isVisibleInscriptions, setIsVisibleInscriptions] = useState(false);

  const [tournament, setTournament] = useState(null);
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [requiredUserAccount, setRequiredUserAccount] = useState(null);
  const [tournamentGroups, setTournamentGroups] = useState([]);

  const [open, setOpen] = useState(false);

  const [timer, setTimer] = useState(moment().format("hh:mm:ss"));
  let unSubScribeTournament = useRef(null);
  let unSubScribeTournamentTeams = useRef(null);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    if (!authUser || !tournament || open) return;
    setOpen(true);
    eventTournament(tournament.id, authUser.id);
  }, [authUser, tournament]);

  const eventTournament = async (tournamentId_, userId_) => {
    try {
      if (window.location.origin.includes("localhost")) return;

      await ownFetch(
        `${config.serverUrl}/events/tournaments/${tournamentId_}/users/${userId_}/action/open`,
        "POST"
      );
    } catch (error) {
      handleError({ ...error, action: "eventTournament" });
    }
  };

  useEffect(() => {
    !isEmpty(unSubScribeTournament.current) && unSubScribeTournament.current();
    !isEmpty(unSubScribeTournamentTeams.current) &&
      unSubScribeTournamentTeams.current();

    unSubScribeTournament.current = fetchTournament();
    unSubScribeTournamentTeams.current = fetchTournamentTeams();
    const timerInterval = setInterval(
      () => setTimer(moment().format("hh:mm:ss")),
      1000
    );

    return () => {
      !isEmpty(unSubScribeTournament.current) &&
        unSubScribeTournament.current();
      !isEmpty(unSubScribeTournamentTeams.current) &&
        unSubScribeTournamentTeams.current();
      console.log("limpiando timer");
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    if (isEmpty(tournament)) return;
    const requiredUserAccount_ = props.findRequiredUserAccount(
      tournament.game.id,
      tournament.console.id
    );
    setRequiredUserAccount(requiredUserAccount_);
  }, [tournament]);

  useEffect(() => {
    const unSub = fetchGroups();
    return () => unSub();
  }, []);

  useEffect(() => {
    if (
      !tournament ||
      isEmpty(tournament.password) ||
      get(tournament, "playerIds").includes(get(authUser, "id"))
    )
      return;

    let localTournaments = defaultTo(
      JSON.parse(localStorage.getItem("tournaments")),
      []
    );

    const localTournament = localTournaments.some(
      (localTournament) =>
        localTournament.id === tournament.id &&
        localTournament.password === tournament.password
    );

    if (!localTournament) {
      setCurrentTournament(tournament);
      setIsVisiblePasswordModal(true);
    }
  }, [tournament, isVisiblePasswordModal]);

  const fetchGroups = () =>
    firestore
      .collection("tournamentGroups")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .orderBy("createAt", "asc")
      .onSnapshot((snapshot) => setTournamentGroups(snapshotToArray(snapshot)));

  const userInscription = async (data = null) => {
    try {
      if (!authUser) return setIsVisibleLoginModal(true);

      if (
        !get(
          authUser,
          `userAccounts.${get(requiredUserAccount, "id", null)}`,
          null
        )
      )
        return setIsVisibleModalUserAccount(true);

      if (!get(authUser, "phoneNumber")) {
        props.showNotification(
          "Complete sus datos",
          "Por favor complete su número de teléfonico."
        );
        return history.push(`/users/${authUser.id}/edit`);
      }

      const entryCost = +get(tournament, "entryCost", 0);

      if (+get(authUser, "money", 0) < entryCost)
        return props.showNotification(
          "Dinero insufiente",
          "Para poder inscribirte al torneo debes recargar."
        );

      setLoadingInscription(true);

      await ownFetch(
        `${config.serverUrl}/tournaments/${tournamentId}/users/${get(
          authUser,
          "id"
        )}`,
        "POST",
        data
      );
    } catch (error) {
      handleError({ ...error, action: "userInscription" });
    }
    setLoadingInscription(false);
  };

  const fetchTournament = () =>
    firestore.doc(`tournaments/${tournamentId}`).onSnapshot((snapShot) => {
      if (!snapShot.exists) return history.goBack();
      setTournament(snapShot.data());
      setIsVisibleInscriptions(snapShot.data().rule.totalPlayers === 1);
      setLoadingTournament(false);
    });

  const fetchTournamentTeams = () =>
    firestore
      .collection("tournamentTeams")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .onSnapshot((snapShot) => setTournamentTeams(snapshotToArray(snapShot)));

  if (loadingTournament) return spinLoader();

  return (
    <>
      <Container>
        <div className="left-container">
          <ItemCardTournament tournament={tournament} completeView update />
          <Inscription
            {...props}
            requiredUserAccount={requiredUserAccount}
            isVisibleInscriptions={isVisibleInscriptions}
            loadingInscription={loadingInscription}
            timer={timer}
            tournament={tournament}
            tournamentTeams={tournamentTeams}
            userInscription={userInscription}
          />

          <div className="statistics-container">
            {tournament.tournamentType.includes("battle") ? (
              <>
                <HeaderBattleRoyale
                  {...props}
                  timer={timer}
                  tournamentTeams={tournamentTeams}
                />
                <ContainerTableStatisticsBattleRoyale
                  tournament={tournament}
                  tournamentTeams={tournamentTeams}
                  listMatches
                />
              </>
            ) : (
              <TabsStatistics
                tournament={tournament}
                tournamentTeams={tournamentTeams}
                tournamentGroups={tournamentGroups}
                key={`key-tree-${defaultTo(tournamentGroups, []).length}`}
                requiredUserAccount={requiredUserAccount}
              />
            )}
          </div>
        </div>
        <div className="right-container">
          <CardAdvertising
            backgroundImage={get(
              tournament,
              "tournamentPlublicityUrlThumb",
              ""
            )}
          />
        </div>
      </Container>
    </>
  );
};

const Container = styled.section`
  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 3fr 1fr;

    .right-container {
      background: ${(props) => props.theme.basic.blackDarken};
      min-height: 100vh;
    }
  }
`;
