import React, { useEffect, useGlobal } from "reactn";
import get from "lodash/get";
import { ButtonBombo } from "../../../../../components";
import styled from "styled-components";
import { mediaQuery } from "../../../../../styles/constants";
import { ModalUpdatePoints } from "./ModalUpdatePoints";
import { Desktop, Tablet } from "../../../../../utils";
import { Icon } from "../../../../../components/common/Icons";

export const StepThree = (props) => {
  const [authUser] = useGlobal("user");

  useEffect(() => {
    props.setStep(3);
  }, []);

  const isCaptain = () =>
    get(props, `match.${props.iAm}[0].id`, null) === authUser.id;

  return (
    <Container>
      {props.isVisibleModalPoints && <ModalUpdatePoints {...props} />}
      <div className="description">
        {get(props.stepCurrent, "step-three", "").replace(
          "USER-ACCOUNT",
          get(props.requiredUserAccount, "description", null)
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
          onClick={() => props.setIsVisibleModalPoints(true)}
          disabled={props.loadingSteps || !isCaptain()}
          loading={props.loadingSteps}
        >
          {isCaptain() ? (
            <>
              Ingresar resultados <Icon type="arrow-right" />
            </>
          ) : (
            "Esperando que los capitanes ingresen el resultado"
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
