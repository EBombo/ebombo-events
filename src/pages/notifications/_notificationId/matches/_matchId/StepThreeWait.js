import React from "reactn";
import get from "lodash/get";
import styled from "styled-components";
import { mediaQuery } from "../../../../../styles/constants";

export const StepThreeWait = (props) => (
  <Container>
    <div className="description">
      <p>
        <div className="li" />
        Esperando confirmación del rival
      </p>
      <br />
      Acabas de ingresar los resultados, si tu rival no los aprueba en
      <br />
      <span className="green">{get(props, "matchTime", "00:00:00")}</span> serán
      validados <span className="green">automáticamente</span>
    </div>
  </Container>
);

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 1rem;
  ${mediaQuery.afterTablet} {
    padding: 0 2rem;
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
`;
