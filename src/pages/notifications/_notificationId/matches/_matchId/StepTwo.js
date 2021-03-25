import React, { useEffect, useGlobal, useState } from "reactn";
import get from "lodash/get";
import { ButtonBombo } from "../../../../../components";
import styled from "styled-components";
import { mediaQuery } from "../../../../../styles/constants";
import { ModalProblem } from "./ModalProblem";
import { Desktop, Tablet } from "../../../../../utils";
import { Icon } from "../../../../../components/common/Icons";

export const StepTwo = (props) => {
  const [authUser] = useGlobal("user");

  useEffect(() => {
    props.setStep(2);
  }, []);

  const isCaptain = () =>
    get(props, `match.${props.iAm}[0].id`, null) === authUser.id;

  return (
    <Container>
      <div className="description">
        <div
          dangerouslySetInnerHTML={{
            __html: get(props.stepCurrent, "step-two", "").replace(
              /\r?\n/g,
              "<br />"
            ),
          }}
        />
        {get(props, "match.game.name", "")
          .toLowerCase()
          .includes("fortnite") && (
          <span>
            Coloque el código de la isla en el juego
            <SpamContainer>
              {" "}
              {get(props, "match.rule.roomNumber", "")}
            </SpamContainer>
          </span>
        )}
        <Desktop>
          <br />
          Si en{" "}
          <span className="green">
            {get(props, "matchTime", "00:00:00")}
          </span>{" "}
          no se ha ingresado los resultados del encuentro, ebombo le dara el
          triunfo al usuario que los ingresó
        </Desktop>
      </div>
      <div>
        <ButtonBombo
          margin="0.5rem auto"
          width="100%"
          onClick={() => props.updateMatch(2)}
          disabled={props.loadingSteps || !isCaptain()}
          loading={props.loadingSteps}
        >
          {isCaptain() ? (
            <>
              Mi oponente ha entrado a la sesión <Icon type="arrow-right" />
            </>
          ) : (
            `Esperando que los capitanes confirmen`
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

export const SpamContainer = styled.span`
  background-color: ${(props) => props.theme.basic.default};
  margin: 10px;
  padding: 4px 5px;
  border-radius: 4px;
`;
