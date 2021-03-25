import React from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../../../../components/common/ModalContainer";
import { config } from "../../../../../firebase";
import { ButtonBombo } from "../../../../../components";
import { darkTheme } from "../../../../../styles/theme";
import { mediaQuery } from "../../../../../styles/constants";

export const ModalProblem = (props) => (
  <ModalContainer
    footer={null}
    visible={props.isVisibleModalProblem}
    onCancel={() => props.setIsVisibleModalProblem(false)}
  >
    <ProblemContainer>
      <div className="title">¿Tienes un problema?</div>
      <div className="buttons-container">
        <ButtonBombo
          width="100%"
          onClick={() => window.open(config.wspUrl, "_blank")}
        >
          Escríbenos al Whatsapp
        </ButtonBombo>
        <ButtonBombo
          background={darkTheme.basic.danger}
          color={darkTheme.basic.blackDarken}
          width="100%"
          bgColorEvents={`${darkTheme.basic.danger}CC`}
          colorEvents={darkTheme.basic.blackDarken}
          onClick={() => props.userCancelMatch("cancel")}
          loading={props.loadingCancelMatch}
          disabled={props.loadingCancelMatch || props.match.tournamentId}
        >
          Solicitar Cancelación
        </ButtonBombo>
      </div>
    </ProblemContainer>
  </ModalContainer>
);

export const ProblemContainer = styled.div`
  text-align: center;
  line-height: 40px;

  .title {
    color: ${(props) => props.theme.basic.white};
    font-size: 1rem;
  }

  .buttons-container {
    display: grid;
    grid-template-rows: repeat(2, 1fr);
    grid-gap: 1rem;
    ${mediaQuery.afterTablet} {
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: 1fr;
    }
  }

  .email {
    color: ${(props) => props.theme.basic.primary};
    font-size: 1.2rem;
  }
`;
