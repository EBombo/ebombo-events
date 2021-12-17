import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { Image } from "../../../components/common/Image";

export const GameInfoSection = (props) => (
  <GameInfoSectionStyled>
    <div>
      <div className="body-container">
        <div className="image-container">
          <Image src={props.infoGame.imageUrl} width="100%" height="100%" />
        </div>
        <div className="content">
          <h1 className="title">{props.infoGame.title}</h1>
          <p className="description">{props.infoGame.description}</p>
        </div>
      </div>
    </div>
  </GameInfoSectionStyled>
);

const GameInfoSectionStyled = styled.section`
  background: ${(props) => props.theme.basic.whiteLighten};
  color: ${(props) => props.theme.basic.black};

  ${mediaQuery.afterTablet} {
    .body-container {
      .description {
        grid-column: 1 / 2;
        grid-row: 1 / 2;
      }
    }
    .body-container {
      .image-container {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
        align-self: center;
      }
    }
  }

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

  .content {
    margin: 0 28px;

    .title {
      margin: 36px auto;
      color: ${(props) => props.theme.basic.secondary};
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

    .description {
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
