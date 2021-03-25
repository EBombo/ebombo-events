import React, { useGlobal, useState, useEffect } from "reactn";
import get from "lodash/get";
import { ButtonBombo } from "../../../../../components";
import styled from "styled-components";
import { mediaQuery } from "../../../../../styles/constants";
import { Desktop, Tablet } from "../../../../../utils";
import { Icon } from "../../../../../components/common/Icons";
import moment from "moment";

export const StepOne = (props) => {
  const [authUser] = useGlobal("user");

  useEffect(() => {
    props.setStep(1);
  }, []);

  const isCaptain = () =>
    get(props, `match.${props.iAm}[0].id`, null) === authUser.id;

  const isPlayTime = () =>
    moment().isBetween(
      get(props["currentMatch"], "createAt").toDate(),
      get(props["currentMatch"], "finishAt").toDate()
    );

  return (
    <Container>
      <div className="description">
        {get(props.stepCurrent, "step-one", "").replace(
          "USER-ACCOUNT",
          get(props.requiredUserAccount, "description", null)
        )}
        <Desktop>
          <br />
          {isPlayTime() ? (
            <>
              Si en{" "}
              <span className="green">
                {get(props, "matchTime", "00:00:00")}
              </span>{" "}
              no se ha ingresado los resultados del encuentro, ebombo le dara el
              triunfo al usuario que los ingresó
            </>
          ) : (
            "Tu partida aun no ha empezado"
          )}
        </Desktop>
      </div>
      <div>
        <ButtonBombo
          margin="0.5rem auto"
          width="100%"
          onClick={() => props.updateMatch(1)}
          disabled={props.loadingSteps || !isCaptain() || !isPlayTime()}
          loading={props.loadingSteps}
        >
          {isCaptain() ? (
            <>
              Añadí a mi oponente a{" "}
              {get(props.requiredUserAccount, "description", null)}
              <Icon type="arrow-right" />
            </>
          ) : (
            `Esperando que los capitanes se añadan`
          )}
        </ButtonBombo>
        <ButtonBombo
          width="100%"
          onClick={() => props.setIsVisibleModalProblem(true)}
        >
          ¿Tienes un problema?
        </ButtonBombo>
      </div>
      <Tablet>
        <div className="description">
          Si en{" "}
          <span className="green">{get(props, "matchTime", "00:00:00")}</span>{" "}
          no se ha ingresado los resultados del encuentro, ebombo le dara el
          triunfo al usuario que los ingresó
        </div>
      </Tablet>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 1rem;

  .description {
    color: ${(props) => props.theme.basic.white};
    font-size: 12px;
    line-height: 18px;
    margin: 0.5rem 0;

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
