import React, { useEffect, useGlobal, useState } from "reactn";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import styled from "styled-components";
import { useHistory, useParams } from "react-router";
import { StepsHeader } from "../../../../../components";
import { StepOne } from "./StepOne";
import { StepTwo } from "./StepTwo";
import { StepThree } from "./StepThree";
import { StepThreeWait } from "./StepThreeWait";
import { StepFour } from "./StepFour";
import { StepClaim } from "./StepClaim";
import { stepsGames } from "../../../../../components/common/DataList";
import { config } from "../../../../../firebase";
import { CardMatchContainer } from "./CardMatch";
import { WaitingCompleteTeams } from "./WaitingCompleteTeams";
import { mediaQuery } from "../../../../../styles/constants";
import { WaitingChallenger } from "./WaitingChallenger";
import { ModalCancelMatch } from "./ModalCancelMatch";
import moment from "moment";
import { ModalProblem } from "./ModalProblem";
import { PreviewTeamsMatch } from "./PreviewTeamsMatch";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../utils/useFetch/useFetch";

export const Steps = (props) => {
  const history = useHistory();
  const { matchId } = useParams();

  const { match } = props;

  const [authUser] = useGlobal("user");
  const [, setIsVisibleModalUserAccount] = useGlobal(
    "isVisibleModalUserAccount"
  );

  const [iAm, setIAm] = useState(null);
  const [opponentIs, setOpponentIs] = useState(null);
  const [requiredUserAccount, setRequiredUserAccount] = useState(null);
  const [stepCurrent, setStepCurrent] = useState({});

  const [loadingSteps, setLoadingSteps] = useState(false);
  const [loadingCancelMatch, setLoadingCancelMatch] = useState(false);

  const [isVisibleModalPoints, setIsVisibleModalPoints] = useState(false);
  const [isVisibleModalResult, setIsVisibleModalResult] = useState(false);
  const [isVisibleModalCancel, setIsVisibleModalCancel] = useState(true);
  const [isVisibleModalProblem, setIsVisibleModalProblem] = useState(false);
  const [isVisibleClaim, setIsVisibleClaim] = useState(false);

  const [challengerPoints, setChallengerPoints] = useState([]);
  const [challengedPoints, setChallengedPoints] = useState([]);
  const [step, setStep] = useState(0);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    if (isEmpty(props.match)) return;
    if (props.match.isCanceled) return history.push("/");

    if (moment(props.match.finishAt.toDate()).isBefore(new Date())) {
      !props.match.tournamentId && userCancelMatch("directCancel");
      return history.push("/");
    }
  }, [props.matchTime]);

  useEffect(() => {
    if (isVisibleModalPoints) {
      setChallengedPoints(
        Array.apply(null, Array(totalPlayers())).map(() => 0)
      );
      setChallengerPoints(
        Array.apply(null, Array(totalPlayers())).map(() => 0)
      );
    }
  }, [isVisibleModalPoints]);

  useEffect(() => {
    if (!isEmpty(match)) {
      const requiredUserAccount_ = props.findRequiredUserAccount(
        match.game.id,
        match.console.id
      );

      setRequiredUserAccount(requiredUserAccount_);

      get(match, "rule.totalPlayers", 1) > 1
        ? setStepCurrent(stepsGames["multiPlayer"])
        : setStepCurrent(stepsGames["general"]);

      match.challengerPoints &&
        match.challengedPoints &&
        setIsVisibleModalPoints(false);
    }
  }, [match]);

  useEffect(() => {
    const iAm_ = isChallenger() ? "challenger" : "challenged";
    const opponentIs_ = isChallenger() ? "challenged" : "challenger";

    setIAm(iAm_);
    setOpponentIs(opponentIs_);
  }, []);

  const rejectInvitation = async (userId_) => {
    setLoadingSteps(true);
    try {
      await ownFetch(
        `${config.serverUrlMatches}/matches/${matchId}/users/${defaultTo(
          userId_,
          get(authUser, "id", null)
        )}/reject`,
        "GET"
      );
    } catch (error) {
      handleError({ ...error, action: "rejectInvitation" });
    }
    setLoadingSteps(false);
  };

  const updateMatch = async (step, stepType = "") => {
    if (
      !get(
        authUser,
        `userAccounts.${get(requiredUserAccount, "id", null)}`,
        null
      )
    )
      return setIsVisibleModalUserAccount(true);

    setLoadingSteps(true);

    try {
      await ownFetch(
        `${config.serverUrlMatches}/matches/${matchId}`,
        "POST",
        bodyUpdateMatch(step, stepType)
      );
    } catch (error) {
      console.error(error);
      handleError({ ...error, action: "updateMatch" });
    }

    setLoadingSteps(false);
    setIsVisibleModalResult(false);
    setIsVisibleModalPoints(false);
    setIsVisibleClaim(false);
  };

  const bodyUpdateMatch = (step, stepType) => ({
    step,
    stepType,
    userId: authUser.id,
    challengerPoints,
    challengedPoints,
  });

  const isChallenger = () =>
    get(match, "challengerIds", []).includes(authUser.id);

  const totalPlayers = () => get(match, "rule.totalPlayers", 1);

  const setClaim = async (data) => {
    try {
      await ownFetch(
        `${config.serverUrlMatches}/matches/${matchId}`,
        "PUT",
        data
      );
    } catch (error) {
      handleError({ ...error, action: "setClaim" });
    }
  };

  const userCancelMatch = async (action) => {
    setLoadingCancelMatch(true);
    try {
      await ownFetch(
        `${config.serverUrlMatches}/matches/${matchId}/users/${authUser.id}/action/${action}`,
        "GET"
      );
    } catch (error) {
      handleError({ ...error, action: "userCancelMatch" });
    }
    setLoadingCancelMatch(false);
  };

  const statusMatch = () => {
    if (isEmpty(match)) return;

    if (
      !get(match, "playersIds", []).includes(authUser.id) &&
      !authUser.isAdmin
    )
      history.push("/");

    if (props.match.hasClaim && !props.match.isClosed)
      return (
        <StepClaim
          isVisibleClaim={isVisibleClaim}
          setIsVisibleClaim={setIsVisibleClaim}
          isChallenger={isChallenger}
          updateMatch={updateMatch}
          loadingSteps={loadingSteps}
          iAm={iAm}
          {...props}
        />
      );

    if (
      get(props.match, `${iAm}AcceptInvitation`, []).length !==
        totalPlayers() ||
      get(props.match, `${opponentIs}AcceptInvitation`, []).length !==
        totalPlayers()
    ) {
      if (!props.match.tournamentId)
        return (
          <WaitingCompleteTeams
            setIsVisibleModalProblem={setIsVisibleModalProblem}
            requiredUserAccount={requiredUserAccount}
            rejectInvitation={rejectInvitation}
            iAm={iAm}
            stepCurrent={stepCurrent}
            updateMatch={updateMatch}
            loadingSteps={loadingSteps}
            setLoadingSteps={setLoadingSteps}
            loadingCancelMatch={loadingCancelMatch}
            {...props}
          />
        );
    }

    if (
      !match[`${iAm}AddOpponent`] &&
      isEmpty(match.challengerPoints) &&
      isEmpty(match.challengedPoints)
    )
      return (
        <StepOne
          setIsVisibleModalProblem={setIsVisibleModalProblem}
          requiredUserAccount={requiredUserAccount}
          iAm={iAm}
          setStep={setStep}
          stepCurrent={stepCurrent}
          updateMatch={updateMatch}
          loadingSteps={loadingSteps}
          {...props}
        />
      );

    if (
      !match[`${iAm}Entered`] &&
      isEmpty(match.challengerPoints) &&
      isEmpty(match.challengedPoints)
    )
      return (
        <StepTwo
          setIsVisibleModalProblem={setIsVisibleModalProblem}
          requiredUserAccount={requiredUserAccount}
          iAm={iAm}
          setStep={setStep}
          stepCurrent={stepCurrent}
          updateMatch={updateMatch}
          loadingSteps={loadingSteps}
          loadingCancelMatch={loadingCancelMatch}
          {...props}
        />
      );

    if (isEmpty(match.challengerPoints) || isEmpty(match.challengedPoints))
      return (
        <StepThree
          setIsVisibleModalProblem={setIsVisibleModalProblem}
          requiredUserAccount={requiredUserAccount}
          iAm={iAm}
          setStep={setStep}
          stepCurrent={stepCurrent}
          totalPlayers={totalPlayers}
          setIsVisibleModalPoints={setIsVisibleModalPoints}
          isVisibleModalPoints={isVisibleModalPoints}
          setChallengedPoints={setChallengedPoints}
          setChallengerPoints={setChallengerPoints}
          challengedPoints={challengedPoints}
          challengerPoints={challengerPoints}
          updateMatch={updateMatch}
          loadingSteps={loadingSteps}
          loadingCancelMatch={loadingCancelMatch}
          {...props}
        />
      );

    if (
      match[`${iAm}AcceptResult`] &&
      (!match.challengerAcceptResult || !match.challengedAcceptResult)
    )
      return <StepThreeWait {...props} />;

    if (match[`${iAm}AcceptResult`] && match[`${opponentIs}AcceptResult`])
      return get(match, "tournamentId", false)
        ? history.push(
            `/games/${match.tournament.game.id}/consoles/${match.tournament.console.id}/tournaments/${match.tournamentId}`
          )
        : history.push("/");

    return (
      <StepFour
        requiredUserAccount={requiredUserAccount}
        iAm={iAm}
        setStep={setStep}
        stepCurrent={stepCurrent}
        totalPlayers={totalPlayers}
        setIsVisibleModalResult={setIsVisibleModalResult}
        isVisibleModalResult={isVisibleModalResult}
        updateMatch={updateMatch}
        loadingSteps={loadingSteps}
        setClaim={setClaim}
        {...props}
      />
    );
  };

  return (
    <Container>
      {isVisibleModalProblem && (
        <ModalProblem
          userCancelMatch={userCancelMatch}
          loadingCancelMatch={loadingCancelMatch}
          isVisibleModalProblem={isVisibleModalProblem}
          setIsVisibleModalProblem={setIsVisibleModalProblem}
          {...props}
        />
      )}

      {isVisibleModalCancel &&
        (props.match.challengerCancel || props.match.challengedCancel) &&
        !props.match.hasClaim &&
        (get(props, "match.challengedIds[0]", null) === authUser.id ||
          get(props, "match.challengerIds[0]", null) === authUser.id) && (
          <ModalCancelMatch
            isVisibleModalCancel={isVisibleModalCancel}
            setIsVisibleModalCancel={setIsVisibleModalCancel}
            isChallenger={isChallenger}
            opponentIs={opponentIs}
            iAm={iAm}
            loadingCancelMatch={loadingCancelMatch}
            userCancelMatch={userCancelMatch}
            isVisibleClaim={isVisibleClaim}
            setIsVisibleClaim={setIsVisibleClaim}
            {...props}
          />
        )}

      {get(match, "updatePoints", true) ? (
        get(props, "match.challengerReady") ? (
          <>
            {get(match, "playersIds", []).includes(authUser.id) && (
              <StepsHeader
                currentMatch={props.match}
                opponentIs={opponentIs}
                totalPlayers={totalPlayers}
                iAm={iAm}
              />
            )}

            <div className="step-container">{statusMatch()}</div>
          </>
        ) : (
          <WaitingChallenger
            userCancelMatch={userCancelMatch}
            loadingCancelMatch={loadingCancelMatch}
            match={match}
            {...props}
          />
        )
      ) : (
        <div className="score-admin">
          <p>
            <div className="li" />{" "}
            {moment(match.createAt.toDate()).format("LLLL")}
          </p>
          Este es tu siguiente encuentro.
          <br />
          El administrador esta encargado de colocar los resultados del
          encuentro.
          <div className="notification-message" style={{ textAlign: "left" }}>
            Si en <span className="green">{props.matchTime}</span> no se ha
            reportado los resultados al admin, el admin podrá escoger a quién
            darle los resultados
          </div>
        </div>
      )}

      {get(match, "tournamentId") && get(match, "rule.totalPlayers", 1) > 1 && (
        <div>
          <PreviewTeamsMatch {...match} opponentIs={opponentIs} iAm={iAm} />
          <DividerLine />
        </div>
      )}
      <CardMatchContainer
        step={step}
        {...match}
        isChallenger={isChallenger}
        totalPlayers={totalPlayers}
        challenger={get(match, "challenger", null)}
        challenged={get(match, "challenged", null)}
        requiredUserAccount={requiredUserAccount}
        rejectInvitation={rejectInvitation}
        stepCurrent={stepCurrent}
        key={`${match.challenger.length}-${match.challenged.length}-${match.rule.id}`}
      />
    </Container>
  );
};

const DividerLine = styled.div`
  width: 100%;
  border-bottom: 1px solid #404040;
  margin-top: 0.5rem;
`;

const Container = styled.div`
  width: 100%;
  padding: 1rem 0;

  .score-admin {
    padding: 0 1rem;
    font-size: 12px;
    line-height: 15px;
    color: ${(props) => props.theme.basic.white};

    ${mediaQuery.afterTablet} {
      padding: 0 2rem;
    }

    .green {
      color: ${(props) => props.theme.basic.primary};
    }

    p {
      display: flex;
      align-items: center;
      font-size: 13px;
      line-height: 16px;

      .li {
        margin: auto 5px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        border: 1px solid ${(props) => props.theme.basic.white};
      }
    }
  }
`;
