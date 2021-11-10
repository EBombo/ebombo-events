import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { Image } from "../../../components/common/Image";

export const GameInfoSection = (props) => (
  <GameInfoSectionStyled>
    <div>
      <div className="body-container">
        <div className="image-container">
          <Image src={props.infoGame.imageUrl} width="100%" height="100%"/>
        </div>
        <div className="description">
          <h1>{props.infoGame.title}</h1>
          <p>{props.infoGame.description}</p>
        </div>
      </div>
    </div>
  </GameInfoSectionStyled>
);

const GameInfoSectionStyled = styled.section`
  .body-container {
    padding-bottom: 64px;

    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: 70% auto;
      max-width: 900px;
      margin: 0 auto;
    }
  }
  .image-container {
    margin: 0 1rem;
    box-shadow: 0px 1.375px 8.9375px rgba(0, 0, 0, 0.25);
    padding: 14px;
  }
  .description {
    margin: 0 28px;
    h1 {
      margin: 36px auto;
      color: ${props => props.theme.basic.secondary};
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 28px;
      line-height: 29px;
      text-align: center;
      letter-spacing: 0.03em;
      ${mediaQuery.afterTablet} {
        text-align: left;
      }
    }
    p {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 15px;
      text-align: center;
      letter-spacing: 0.03em;
      ${mediaQuery.afterTablet} {
        text-align: left;
      }
    }
  }
`;
