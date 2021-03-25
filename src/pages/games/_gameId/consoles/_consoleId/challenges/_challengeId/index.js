import React, {useEffect, useGlobal, useRef, useState} from "reactn";
import styled from "styled-components";
import {Desktop, spinLoader, Tablet} from "../../../../../../../utils";
import {BackButton, EBomboRules, EventInfo, GameRules, Games, GeneralInfo,} from "../../../../../../../components";
import {useHistory, useParams} from "react-router";
import defaultTo from "lodash/defaultTo";
import {Chat} from "../../../../../../../components/chat/Chat";
import isEmpty from "lodash/isEmpty";
import {config, firestore} from "../../../../../../../firebase";
import {ChallengerContainer} from "./ChallengerInfo";
import {WaitingChallenged} from "./WaitingChallenged";
import get from "lodash/get";
import {ChallengeCreate} from "./ChallengeCreate";
import {showMoney} from "../../../../../../../utils/showMoney";
import moment from "moment";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../../../../../../utils/useFetch/useFetch";
import {darkTheme} from "../../../../../../../styles/theme";

export const ChallengeContainer = (props) => {
  const history = useHistory();

  const { challengeId } = useParams();
  const [authUser] = useGlobal("user");
  const [, setIsVisibleModalUserAccount] = useGlobal(
    "isVisibleModalUserAccount"
  );
  const [matches] = useGlobal("matches");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");

  const [challenge, setChallenge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCreateMatch, setLoadingCreateMatch] = useState(false);
  const [rejectingChallenge, setRejectingChallenge] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  let unSubScribeChallenge = useRef(null);

  useEffect(() => {
    if (challengeId === "new") return;

    !isEmpty(unSubScribeChallenge.current) && unSubScribeChallenge.current();
    unSubScribeChallenge.current = isEmpty(challenge) ? fetchChallenge() : null;
    return () =>
      !isEmpty(unSubScribeChallenge.current) && unSubScribeChallenge.current();
  }, [challengeId]);

  useEffect(() => {
    if (!challenge) return;

    if (
      !challenge.isClosed &&
      challenge.challengedReady &&
      moment(challenge.createAt.toDate()).add(30, "minutes").isAfter(new Date())
    ) {
      history.push(`/notifications/matches/${challenge.matchId}`);
    }

    if (challenge.deleted === true) history.push("/");
  }, [challenge]);

  const fetchChallenge = () =>
    firestore.doc(`challenges/${challengeId}`).onSnapshot((snapShot) => {
      if (!snapShot.exists) return history.push("/");
      setChallenge(snapShot.data());
      setIsLoading(false);
    });

  const updateChallenge = async (challenge, action = null) => {
    try {
      if (!authUser) return setIsVisibleLoginModal(true);

      const requiredUserAccount = props.findRequiredUserAccount(
        challenge.game.id,
        challenge.console.id
      );

      if (!get(authUser, `userAccounts.${get(requiredUserAccount, "id")}`))
        return setIsVisibleModalUserAccount(true);

      if (
        get(challenge, "realMoney", true) &&
        showMoney(authUser) < challenge.gameEntryCost
      )
        return props.showNotification(
          "Dinero insufiente",
          "Para retar a un jugador debes recargar"
        );

      if (
        !get(challenge, "realMoney", true) &&
        get(authUser, "ebCoins", 0) < challenge.gameEntryCost
      )
        return props.showNotification(
          "Dinero jugable insufiente.",
          "Dinero jugable insuficiente para unirte a la partida."
        );

      if (
        !isEmpty(
          matches.filter(
            (match) =>
              !match.tournamentId &&
              moment(match.createAt.toDate()).isBefore(new Date())
          )
        )
      )
        return props.showNotification(
          "Partida en juego.",
          "Solo puede jugar una partida a la vez."
        );

      setLoadingCreateMatch(true);

      const response = await ownFetch(
        `${config.serverUrl}/challenges/${challenge.id}/users/${authUser.id}${
          !isEmpty(action) ? `/${action}` : ""
        }`,
        "GET"
      );

      defaultTo(action, "").includes("challengedReady") &&
        history.push(`/notifications/matches/${response.matchId}`);
    } catch (error) {
      handleError({ ...error, action: "updateChallenge" });
    }
    setLoadingCreateMatch(false);
  };

  const deleteChallenge = async (challenge, userId) => {
    setRejectingChallenge(true);
    try {
      await ownFetch(
        `${config.serverUrl}/challenges/${challenge.id}/users/${userId}/cancel`,
        "GET"
      );

      history.push("/notifications/received");
    } catch (error) {
      handleError({ ...error, action: "deleteChallenge" });
    }
    setRejectingChallenge(false);
  };

  const onClickGame = (game) =>
    history.push(
      `/games/${game.id}/consoles/${game.consoleIds[0]}/challenges/new`
    );

  if (challengeId === "new")
    return (
      <>
        <Desktop>
          <Games onClick={onClickGame} isDesktop>
            <ChallengeCreate {...props} />
          </Games>
        </Desktop>
        <Tablet>
          <ChallengeCreate onClickGame={onClickGame} {...props} />
        </Tablet>
      </>
    );

  return isLoading ? (
    spinLoader()
  ) : (
    <>
      <Desktop>
        <ContainerDesktop>
          <div className="challenge-info">
            <div className="back-button">
              <BackButton />
            </div>
            <div className="grid-container">
              <ChallengerContainer challenge={challenge} {...props} />
              <WaitingChallenged
                loadingCreateMatch={loadingCreateMatch}
                challenge={challenge}
                updateChallenge={updateChallenge}
                deleteChallenge={deleteChallenge}
                rejectingChallenge={rejectingChallenge}
                {...props}
              />
            </div>
            <div>
              <EventInfo challenge={challenge} {...props} />
              <GeneralInfo />
            </div>
            <div className="game-rules">
              <GameRules
                gameId={get(challenge, "game.id", "-")}
                background={darkTheme.basic.blackLighten}
              />
            </div>
            <div className="ebombo-rules">
              <EBomboRules />
            </div>
          </div>
          <div className="chat-container">
            <Chat chatId={defaultTo(challengeId, "public")} />
          </div>
        </ContainerDesktop>
      </Desktop>
      <Tablet>
        <ContainerTablet>
          <div className="back-button">
            <BackButton />
          </div>
          <div className="challenge-container">
            <ChallengerContainer challenge={challenge} {...props} />
            <WaitingChallenged
              loadingCreateMatch={loadingCreateMatch}
              challenge={challenge}
              updateChallenge={updateChallenge}
              deleteChallenge={deleteChallenge}
              rejectingChallenge={rejectingChallenge}
              {...props}
            />
            <div className="challenge-container">
              <EventInfo challenge={challenge} {...props} />
            </div>
            <div className="game-rules">
              <GameRules
                gameId={get(challenge, "game.id", "-")}
                background={darkTheme.basic.blackLighten}
              />
            </div>
            <div className="ebombo-rules">
              <EBomboRules />
            </div>
          </div>
          <div className="chat-container">
            <Chat chatId={defaultTo(challengeId, "public")} />
          </div>
          <GeneralInfo />
        </ContainerTablet>
      </Tablet>
    </>
  );
};

const ContainerDesktop = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 4fr 2fr;
  height: 100vh;

  .back-button {
    padding: 2rem 2rem 0 2rem;
  }

  .challenge-info {
    overflow-y: auto;

    .grid-container {
      display: grid;
      grid-template-columns: repeat(2, 1fr);

      align-items: center;
      padding-bottom: 1rem !important;
    }

    .game-rules,
    .ebombo-rules {
      padding: 1rem;
      border-radius: 5px;
      color: ${(props) => props.theme.basic.white};
    }
  }

  .chat-container {
    background: ${(props) => props.theme.basic.blackDarken};
  }
`;

const ContainerTablet = styled.div`
  width: 100%;

  .back-button {
    padding: 1rem 1rem 0 1rem;
  }

  .chat-container {
    background: ${(props) => props.theme.basic.default};
  }

  .game-rules,
  .ebombo-rules {
    padding: 0.5rem;
    border-radius: 5px;
    color: ${(props) => props.theme.basic.white};
  }
`;
