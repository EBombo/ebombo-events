import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { Image } from "../../components/common/Image";

const ourGamesData = ["https://via.placeholder.com/274x130", "https://via.placeholder.com/274x130","https://via.placeholder.com/274x130"];

export const OurGames = (props) => {
  return (
    <OurGamesContainer ref={props.refProp}>
      <div className="title">Nuestros juegos</div>

      <div className="our-games">
        {ourGamesData.map((image, index) => <Image key={`our-game-${index}`} src={image} />)}
      </div>
    </OurGamesContainer>
  );
};

const OurGamesContainer = styled.section`
  width: 100%;
  padding: 1rem 0 2rem 0;
  background: ${(props) => props.theme.basic.whiteLight};

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    text-align: center;
    letter-spacing: 0.03em;
    margin: 1rem 0;
    color: ${(props) => props.theme.basic.secondary};
  }

  .our-games {
    display: grid;
    grid-template-columns: 200px;
    gap: 3rem;
    justify-content: center;

    ${mediaQuery.afterTablet} {
      grid-template-columns: repeat(3, auto);
      max-width: 900px;
      margin: 0 auto;
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem 0 4rem 0;

    .title {
      font-size: 34px;
      line-height: 41px;
      margin: 2rem 0 4rem 0;
    }
  }
`;

