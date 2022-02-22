import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";

const ourGamesData = [
  [
    `${config.storageUrl}/resources/games/bingo.jpeg`,
    `${config.storageUrl}/resources/games/trivia.jpeg`,
    `${config.storageUrl}/resources/games/ahorcado.jpeg`,
  ],
  [
    `${config.storageUrl}/resources/games/charada.jpeg`,
    `${config.storageUrl}/resources/games/letras.jpeg`,
    `${config.storageUrl}/resources/games/tuti.jpeg`,
  ],
  [`${config.storageUrl}/resources/games/adivina.jpeg`, `${config.storageUrl}/resources/games/ruleta.jpeg`],
];

export const OurGames = (props) => {
  return (
    <OurGamesContainer ref={props.refProp}>
      <div className="title">Algunas de las 20+ actividades que ofrecemos.</div>

      {ourGamesData.map((images, index) => (
        <OurGamesStyled key={`our-game-${index}`} images={images?.length}>
          {images.map((image) => (
            <Image
              key={image}
              src={image}
              width="321px"
              height="128px"
              margin="10px"
              borderRadius="20px"
              data-aos="fade-up"
              data-aos-delay={`${index}00`}
            />
          ))}
        </OurGamesStyled>
      ))}
    </OurGamesContainer>
  );
};

const OurGamesStyled = styled.div`
  display: grid;
  justify-content: center;

  ${mediaQuery.afterTablet} {
    grid-template-columns: repeat(${(props) => props.images ?? 0}, auto);
    max-width: 900px;
    margin: 0 auto;
  }
`;

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

  ${mediaQuery.afterTablet} {
    padding: 4rem;

    .title {
      font-size: 34px;
      line-height: 41px;
      margin: 2rem auto;
    }
  }
`;
