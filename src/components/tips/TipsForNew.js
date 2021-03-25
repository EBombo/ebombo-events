import React from "react";
import styled from "styled-components";
import {config} from "../../firebase";

export const TipsForNew = () => {
  return (
    <Container>
      <div className="tip">
        <div className="title">
          Depósitos{" "}
          <img
            src={`${config.storageUrl}/resources/dollar-sign.png`}
            alt={""}
          />
        </div>
        <div className="content">
          El depósito mínimo por la página es 9 USD y el depósito por Yape o
          Plin el que tú desees.
        </div>
      </div>
      <div className="tip">
        <div className="title">¿Cómo encontrar a tu oponente?</div>
        <div className="content">
          Selecciona el juego, la consola y las reglas del encuentro y hacer
          click en el botón Buscar Partida para encontrar a tu rival o haz click
          en el nombre de algún usuario en el chat y manda una invitación.
        </div>
      </div>
      <div className="tip">
        <div className="title">
          Evidencia{" "}
          <img src={`${config.storageUrl}/resources/camera.png`} alt={""} />
        </div>
        <div className="content">
          Recomendamos ver los videos de como pueden mostrarnos evidencia antes
          de jugar en caso ocurra un incidente (en todos los juegos queda
          evidencia de quien gano, asi que no se preocupe)
        </div>
      </div>
      <div className="tip">
        <div className="title">Abandonos</div>
        <div className="content">
          Si un jugador abandona la partida, el encuentro seguirá y se tomarán
          como válidos los resultados ingresados por el usuario que permaneció
          en el encuentro cuando el tiempo haya finalizado.
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 0.8rem;
  color: ${(props) => props.theme.basic.white};

  .tip {
    .title {
      font-weight: 600;
      margin-bottom: 0.3rem;
      font-size: 14px;
      text-align: left;
    }

    .content {
      font-size: 11.3px;
    }
  }
`;
