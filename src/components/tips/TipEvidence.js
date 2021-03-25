import React from "react";
import {config} from "../../firebase";
import {Tip as Container, TipDescription, TipTittle} from "./TipStyle";

export const TipEvidence = () => (
  <Container>
    <TipTittle>
      Evidencia
      <img src={`${config.storageUrl}/resources/camera.svg`} alt="" />
    </TipTittle>
    <TipDescription>
      Recomendamos ver los videos de como pueden mostrarnos evidencia antes de
      jugar en caso ocurra un incidente (en todos los juegos queda evidencia de
      quien gano, asi que no se preocupe) De igual solo el 2%-3% de los
      encuentros tienen problemas.
    </TipDescription>
  </Container>
);
