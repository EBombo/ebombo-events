import React, { useGlobal } from "reactn";
import get from "lodash/get";
import { ButtonBombo } from "../../../../../components";
import { Icon } from "../../../../../components/common/Icons";
import styled from "styled-components";
import { mediaQuery } from "../../../../../styles/constants";
import { Claim } from "./Claim";
import { ModalContainer } from "../../../../../components/common/ModalContainer";

export const StepClaim = (props) => {
  const [authUser] = useGlobal("user");

  const userMatchStatus = () =>
    props.isChallenger()
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

  const isCaptain = () =>
    get(props, `match.${props.iAm}[0].id`, null) === authUser.id;

  return (
    <Container>
      {props.isVisibleClaim && (
        <ModalClaim
          footer={null}
          visible={props.isVisibleClaim}
          onCancel={() => props.setIsVisibleClaim(false)}
          width={700}
        >
          <Claim
            isChallenger={props.isChallenger}
            updateMatch={props.updateMatch}
            userMatchStatus={userMatchStatus}
            match={props.match}
            matchTime={props.matchTime}
            claimTime={props.claimTime}
            loadingSteps={props.loadingSteps}
          />
        </ModalClaim>
      )}
      <div className="description">
        <p>El encuentro se encuentra en disputa</p>
        <br />
        Sube tu evidencia antes que se agote el tiempo:
        <br />
        <span className="green">{get(props, "claimTime", "00:00:00")}</span>
      </div>
      <div>
        <ButtonBombo
          margin="0.5rem auto"
          width="100%"
          onClick={() => props.setIsVisibleClaim(true)}
          disabled={!isCaptain()}
        >
          {isCaptain() ? (
            <>
              Subir Evidencia
              <Icon type="arrow-right" />
            </>
          ) : (
            `Esperando que los capitanes suban evidencia`
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

  .description {
    color: ${(props) => props.theme.basic.white};
    font-size: 12px;
    line-height: 18px;
    margin: 0.5rem 0;

    p {
      color: #939393;
      font-size: 13px;
      line-height: 19px;
      margin: 0;
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
  }
`;

export const ModalClaim = styled(ModalContainer)`
  .and-modal {
  }

  .ant-modal-body {
    background: ${(props) => props.theme.basic.default};
    color: ${(props) => props.theme.basic.white};
  }
`;
