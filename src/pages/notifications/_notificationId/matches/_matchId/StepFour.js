import React, { useEffect, useGlobal } from "reactn";
import get from "lodash/get";
import styled from "styled-components";
import includes from "lodash/includes";
import { ButtonBombo } from "../../../../../components";
import { ModalAcceptResult } from "./ModalAcceptResult";
import { Icon } from "../../../../../components/common/Icons";
import { mediaQuery } from "../../../../../styles/constants";

export const StepFour = (props) => {
  const [authUser] = useGlobal("user");

  useEffect(() => {
    props.setStep(2);
  }, []);

  const userMatchStatus = () =>
    props.iAm === "challenger"
      ? reducePoints(props.match.challengerPoints) >
        reducePoints(props.match.challengedPoints)
        ? "Sí, he ganado"
        : reducePoints(props.match.challengerPoints) ===
          reducePoints(props.match.challengedPoints)
        ? "Sí, he empatado"
        : "Sí, he perdido"
      : reducePoints(props.match.challengedPoints) >
        reducePoints(props.match.challengerPoints)
      ? "Sí, he ganado"
      : reducePoints(props.match.challengerPoints) ===
        reducePoints(props.match.challengedPoints)
      ? "Sí, he empatado"
      : "Sí, he perdido";

  const reducePoints = (points) => points.reduce((a, b) => a + b, 0);

  const stepSuccess = (challenger, challenged) =>
    includes(props.match[challenger], authUser.id) ||
    includes(props.match[challenged], authUser.id);

  const isCaptain = () =>
    get(props, `match.${props.iAm}[0].id`, null) === authUser.id;

  return (
    <Container>
      {props.isVisibleModalResult && (
        <ModalAcceptResult
          userMatchStatus={userMatchStatus}
          gameId={props.match.game.id}
          stepSuccess={stepSuccess}
          isCaptain={isCaptain}
          {...props}
        />
      )}
      <div className="description">
        <div className="result">
          <div className="circle" />
          <p>Por favor confirma los resultados</p>
        </div>
        <br />
        Tu rival ingresó los resultados, confirma si son correctos, si no los
        apruebas en{" "}
        <span className="green">
          {get(props, "matchTime", "00:00:00")}
        </span>{" "}
        serán aceptados <span className="green">automáticamente</span>
      </div>
      <div>
        <ButtonBombo
          margin="0.5rem auto"
          width="100%"
          onClick={() => props.setIsVisibleModalResult(true)}
          disabled={!isCaptain()}
        >
          {isCaptain() ? (
            <>
              Ver resultados <Icon type="arrow-right" />
            </>
          ) : (
            "Capitan tiene que confirmar resultados"
          )}
        </ButtonBombo>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 1rem;

  .result {
    display: flex;
  }

  .circle {
    margin: auto 5px;
    width: 10px;
    height: 10px;
    border-radius: 5px;
    border: 1px solid ${(props) => props.theme.basic.white};
  }

  .description {
    color: ${(props) => props.theme.basic.white};
    font-size: 12px;
    line-height: 18px;
    margin: 0.5rem 0;

    p {
      display: flex;
      align-items: center;
      color: #939393;
      font-size: 13px;
      line-height: 19px;
      margin: 0;

      .li {
        margin: auto 5px;
        width: 10px;
        height: 10px;
        border-radius: 5px;
        border: 1px solid ${(props) => props.theme.basic.white};
      }
    }

    .green {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  ${mediaQuery.afterTablet} {
    width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    padding: 0 2rem;
  }
`;
