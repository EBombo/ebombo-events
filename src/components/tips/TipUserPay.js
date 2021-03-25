import React from "react";
import {Tip as Container, TipDescription, TipTittle} from "./TipStyle";
import {config} from "../../firebase";

export const TipUserPay = () => (
  <Container>
    <TipTittle>
      Juega Seguro
      <img src={`${config.storageUrl}/resources/shield.svg`} alt="" />
    </TipTittle>
    <TipDescription>
      Ebombo se asegura que recibas tu dinero en caso de forma segura.
      Colectamos el dinero antes que la partida empiece. Una vez finalizada le
      entregamos el dinero al ganador del encuentro siempre y cuando los dos
      jugadores esten de acuerdo.
    </TipDescription>
  </Container>
);
