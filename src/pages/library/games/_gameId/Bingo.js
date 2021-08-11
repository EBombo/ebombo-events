import React, { useState, useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery, Tablet, Desktop } from "../../../../constants";
import { Anchor } from "../../../../components/form";

export const Bingo = (props) => {
  return (
    <BingoContainer>
      <div className="subtitle">
        <div className="name">Crear bingo 1 - 75</div>
        <Desktop>
          <Anchor variant="primary" onClick={() => console.log("preview")}>
            Vista Previa
          </Anchor>
        </Desktop>
      </div>
      <Tablet>
          tablet
      </Tablet>
      <Desktop>
          desktop
      </Desktop>
    </BingoContainer>
  );
};

const BingoContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.gray};

  .subtitle {
    background: ${(props) => props.theme.basic.primary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    
    .name {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
    }
  }

  ${mediaQuery.afterTablet} {
    max-width: 950px;
  }
`;
