import React, {useGlobal} from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import {mediaQuery} from "../../styles/constants";
import {useErrorHandler} from "react-error-boundary";

export const StepsHeader = (props) => {
  const [authUser] = useGlobal("user");

  const handleError = useErrorHandler();

  const statusMatch = () => {
    if (
      (props.currentMatch.hasClaim && !props.currentMatch.isClosed) ||
      props.currentMatch[`${props.iAm}Points`]
    )
      return null;

    if (
      get(props, `currentMatch.${props.iAm}AcceptInvitation`, []).length !==
        props.totalPlayers() ||
      get(props, `currentMatch.${props.opponentIs}AcceptInvitation`, [])
        .length !== props.totalPlayers()
    )
      if (!get(props, "currentMatch.tournamentId")) return "0";

    if (isEmpty(props.currentMatch)) return 1;

    if (props.currentMatch.claim) return null;

    if (
      !props.currentMatch.challengerAcceptInvitation ||
      !props.currentMatch.challengedAcceptInvitation
    )
      return null;

    if (!props.currentMatch[`${props.iAm}AddOpponent`]) return 1;

    if (!props.currentMatch[`${props.iAm}Entered`]) return 2;

    if (
      props.currentMatch[`${props.iAm}Entered`] &&
      !props.currentMatch[`${props.iAm}Points`]
    )
      return 3;

    if (
      props.iAm === "challenger" &&
      !get(props, "currentMatch.challengerAcceptResult", []).includes(
        authUser.id
      )
    )
      return null;

    if (
      !props.iAm === "challenger" &&
      !get(props, "currentMatch.challengedAcceptResult", []).includes(
        authUser.id
      )
    )
      return null;

    if (
      !props.currentMatch.challengerAcceptResult ||
      !props.currentMatch.challengedAcceptResult
    )
      return null;

    return 4;
  };

  return statusMatch() ? (
    <Steps>
      <div className="steps-container">
        <div className="li" />
        <div className="title">Paso {+statusMatch()}/4</div>
        <div className="steps">
          <div className={`step ${statusMatch() > 0 ? "primary" : ""}`} />
          <div className={`step ${statusMatch() > 1 ? "primary" : ""}`} />
          <div className={`step ${statusMatch() > 2 ? "primary" : ""}`} />
          <div className={`step ${statusMatch() > 3 ? "primary" : ""}`} />
        </div>
      </div>
    </Steps>
  ) : null;
};

const Steps = styled.div`
  color: ${(props) => props.theme.basic.white};
  text-align: center;
  padding: 1rem;
  ${mediaQuery.afterTablet} {
    padding: 0 2rem;
  }
  .go-back-steps {
    text-align: left;
    cursor: pointer;
  }

  .steps-container {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .li {
      margin: auto 5px;
      width: 10px;
      height: 10px;
      border-radius: 5px;
      border: 1px solid ${(props) => props.theme.basic.white};
    }

    .title {
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) => props.theme.basic.action};
    }

    .steps {
      display: flex;
      justify-content: center;

      .step {
        background: ${(props) => props.theme.basic.white};
        height: 10px;
        width: 10px;
        border-radius: 10px;
        margin: 10px;
      }

      .primary {
        background: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
