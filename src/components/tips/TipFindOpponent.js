import React from "react";
import styled from "styled-components";
import {Tip as Container, TipDescription, TipTittle} from "./TipStyle";

export const TipFindOpponent = () => (
  <Container>
    <TipTittle>¿Cómo encontrar a tu oponente?</TipTittle>
    <Description className="description">
      <span className="subtitle">-Crea una sala:</span> Selecciona el juego, la
      consola y las reglas del encuentro y crea tu sala. Los oponentes verán tu
      sala en la página de inicio y podrán decidir si jugar o no.
      <br />
      <span className="subtitle">-Encuentra una sala:</span> Encuentra una sala
      ya creada por otro usuario y entra para jugar.
      <br />
      <span className="subtitle">-Usa el chat:</span> Coordina por el chat de
      cada juego e invita a un usuario a jugar haciéndole click a su nombre de
      usuario.
    </Description>
  </Container>
);

const Description = styled(TipDescription)`
  .subtitle {
    color: ${(props) => props.theme.basic.primary};
    font-weight: bold;
  }
`;
