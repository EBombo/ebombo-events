import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";

const ourGamesData = [
  `${config.storageUrl}/resources/games/bingo.png`,
  `${config.storageUrl}/resources/games/hanged.png`,
  `${config.storageUrl}/resources/games/letras.png`,
  `${config.storageUrl}/resources/games/trivia.png`,
  `${config.storageUrl}/resources/games/charada.png`,
  `${config.storageUrl}/resources/games/tuttifrutti.png`,
];

export const OurGames = (props) => {
  return (
    <OurGamesContainer ref={props.refProp}>
      <div className="title">Algunos de los 20+ juegos que ofrecemos</div>

      <div className="our-games">
        {ourGamesData.map((image, index) => (
          <Image key={`our-game-${index}`} src={image} width="321px" height="128px" borderRadius="40px" />
        ))}
      </div>
    </OurGamesContainer>
  );
};

const OurGamesContainer = styled.section`
  width: 100%;
  padding: 2rem 1rem;
  background: ${(props) => props.theme.basic.primary};

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 34px;
    line-height: 41px;
    text-align: center;
    letter-spacing: 0.03em;
    margin: 1rem 0;
    color: ${(props) => props.theme.basic.white};
  }

  .our-games {
    display: grid;
    gap: 3rem;
    justify-content: center;

    ${mediaQuery.afterTablet} {
      grid-template-columns: repeat(3, auto);
      max-width: 900px;
      margin: 0 auto;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 4rem;

    .title {
      font-size: 34px;
      line-height: 41px;
      margin: 2rem auto;
    }
  }
`;
