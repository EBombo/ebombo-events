import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";
import {darkTheme} from "../../styles/theme/darkTheme";
import get from "lodash/get";
import {Modal as ModalAntd} from "antd";
import {ButtonBombo, EBomboRules, GameRules} from "../index";

export const MatchDetails = (props) => {
  const [isVisibleGameRules, setIsVisibleGameRules] = useState(false);
  const [isVisibleEBomboRules, setIsVisibleEBomboRules] = useState(false);
  const [currentCurrency] = useGlobal("currentCurrency");

  return (
    <MacthContainer>
      <MatchDetailsContainer>
        <div className="title">Detalles de la partida</div>
        <div className="details">
          <div>
            <div>
              Costo de entrada:{" "}
              <span>
                {get(props, "realMoney", true)
                  ? `${currentCurrency} ${get(props, "gameEntryCost", "-")}`
                  : ` ${get(props, "gameEntryCost", "")}K`}
              </span>
            </div>
          </div>
          <div>
            <div>
              Tipo de juego:{" "}
              <span>
                {get(props, "rule.totalPlayers", 1) > 1
                  ? "EQUIPOS"
                  : "Individual"}
              </span>
            </div>
          </div>
        </div>
        <div className="console">
          Consola: <span>{get(props, "console.name", "-")}</span>
        </div>
        <div className="console">
          Tipos de equipos: <span>{get(props, "rule.name", "-")}</span>
        </div>
        <div className="title">Importante</div>
        <div className="rules">
          Las reglas mencionadas arriba son por defecto y si usted y su oponente
          están de acuerdo de cambiar las reglas pueden discutirlo por el chat,
          de otra manera no se permite un cambio de reglas.
        </div>
      </MatchDetailsContainer>
      <div className="footer">
        <ButtonBombo
          onClick={() => setIsVisibleGameRules(true)}
          margin="2px"
          lineHeight="normal"
          color={darkTheme.basic.primary}
          colorEvents={darkTheme.basic.primary}
          background={darkTheme.basic.blackDarken}
          fontSize=".7rem"
          fontWeight="500"
        >
          Reglas del juego
        </ButtonBombo>
        <ButtonBombo
          onClick={() => setIsVisibleEBomboRules(true)}
          margin="2px"
          lineHeight="normal"
          color={darkTheme.basic.primary}
          colorEvents={darkTheme.basic.primary}
          background={darkTheme.basic.blackDarken}
          fontSize=".7rem"
          fontWeight="500"
        >
          Reglas de ebombo
        </ButtonBombo>
      </div>
      <Modal
        footer={null}
        visible={isVisibleGameRules}
        onCancel={() => setIsVisibleGameRules(false)}
      >
        <GameRules gameId={get(props, "game.id", "-")} />
      </Modal>
      <Modal
        footer={null}
        visible={isVisibleEBomboRules}
        onCancel={() => setIsVisibleEBomboRules(false)}
      >
        <EBomboRules />
      </Modal>
    </MacthContainer>
  );
};

const MacthContainer = styled.div`
  .footer {
    display: flex;
    justify-content: center;

    button {
      width: auto !important;
      padding-left: 15px !important;
      padding-right: 15px !important;
    }
  }
`;

const MatchDetailsContainer = styled.div`
  border: 1px solid ${(props) => props.theme.basic.primary};
  border-radius: 10px;
  padding: 15px;
  margin: 10px;

  .details {
    display: flex;
    justify-content: space-between;
    margin: 10px auto;
  }

  .console {
    margin: 10px auto;
  }

  .details,
  .console {
    span {
      font-weight: bold;
    }
  }

  .title {
    font-weight: bold;
    color: ${(props) => props.theme.basic.primary};
  }
`;

const Modal = styled(ModalAntd)`
  top: 0px !important;

  ${mediaQuery.afterTablet} {
    top: 50px !important;
  }

  .ant-modal-content {
    .ant-modal-body {
      background: ${(props) => props.theme.basic.default};
      color: ${(props) => props.theme.basic.white};
    }

    .ant-modal-close-x {
      color: ${(props) => props.theme.basic.primary};
    }
  }
`;
