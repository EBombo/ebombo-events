import React from "react";
import {Tip as Container, TipDescription, TipTittle} from "./TipStyle";
import {config} from "../../firebase";

export const TipDropouts = () => (
  <Container>
    <TipTittle>Abandonos por parte del rival <img src={`${config.storageUrl}/resources/double-check.svg`} alt="" /></TipTittle>
    <TipDescription>
      Si un jugador abandona la partida, el encuentro seguirá y se tomarán cómo
      válidos los resultados ingresados por el usuario que permanecio en el
      encuentro.
    </TipDescription>
  </Container>
);
