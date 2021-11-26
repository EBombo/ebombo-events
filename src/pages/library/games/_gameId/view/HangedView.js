import React, { useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { Tablet } from "../../../../../constants";
import { ButtonAnt } from "../../../../../components/form";

export const HangedView = (props) => {
  return (
    <HangedViewContainer>
      <div className="subtitle">Ahorcado</div>
      <div className="specifications">
        <div>
          <div className="description">Nombre:</div>
          <div className="value">{get(props.game, "name", "")}</div>

          <div className="description">Frases:</div>
          {get(props.game, "phrases", []).map((phrase) => (
            <div className="value">{phrase}</div>
          ))}
        </div>
      </div>
      <Tablet>
        <div className="btn-container">
          <ButtonAnt onClick={props.createTokenToPlay}>Jugar</ButtonAnt>
        </div>
      </Tablet>
    </HangedViewContainer>
  );
};

const HangedViewContainer = styled.div`
  .value {
    display: flex;
    align-items: center;
    padding: 0 0 0.5rem 0;
    font-family: Lato;
    font-style: normal;
    font-size: 13px;
    line-height: 16px;
    color: ${(props) => props.theme.basic.grayLight};
  }
`;
