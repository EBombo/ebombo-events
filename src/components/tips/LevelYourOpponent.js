import {LEVELS} from "../common/DataList";
import React from "react";
import styled from "styled-components";
import {Tip as Container, TipDescription, TipTittle} from "./TipStyle";
import {config} from "../../firebase";

export const LevelYourOpponent = () => (
  <Container>
    <TipTittle>Nivel de tu rival
        <img src={`${config.storageUrl}/resources/medal.svg`} alt=""/>
    </TipTittle>
    <TipDescription>
      Los jugadores obtienen su nivel en base a las victorias y derrotas que
      obtengan en la página web de ebombo. Mientras más victorias obtenga la
      persona, su nivel será mayor.
    </TipDescription>
    <div className="levels">
      {LEVELS.map((level) => (
        <Level key={level.number} color={level.color}>
          Level {level.number}
        </Level>
      ))}
    </div>
  </Container>
);

const Level = styled.div`
  cursor: pointer;
  padding: 5px 18px;
  color: ${(props) => props.color};
  margin: 0.75rem 1.6rem;
  display: inline-block;
`;
