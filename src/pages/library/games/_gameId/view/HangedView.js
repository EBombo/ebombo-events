import React from "reactn";
import { useRouter } from "next/router";
import styled from "styled-components";
import get from "lodash/get";
import { Tablet } from "../../../../../constants";
import { ButtonAnt } from "../../../../../components/form";

export const HangedView = (props) => {
  const router = useRouter();
  const { adminGameId, folderId } = router.query;

  return (
    <HangedViewContainer>
      <div className="subtitle">Ahorcado</div>
      <div className="specifications">
        <div>
          <div className="description">Nombre:</div>
          <div className="value">{get(props.game, "name", "")}</div>

          <div className="description">Frases:</div>
          {get(props.game, "phrases", []).map((phrase, i) => (
            <div key={`phrase-${i}`} className="value">
              {phrase}
            </div>
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

const ToolTipContent = styled.div`
  background: ${(props) => props.theme.basic.whiteLight};
  box-sizing: border-box;
  color: ${(props) => props.theme.basic.grayLight};

  .option {
    display: flex;
    align-items: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    padding: 0.5rem;
    cursor: pointer;
  }
`;
