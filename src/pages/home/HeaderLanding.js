import React from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../constants";
import { config } from "../../firebase";
import { ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";

export const HeaderLanding = (props) => {
  return (
    <HeaderLandingContainer>
      <div className="left-container">
        <div className="title">Haz que tus eventos sean todo un éxito.</div>
        <div className="subtitle">Hazlos al estilo Ebombo.</div>
        <div className="description">
          Facilita tus sesiones de integración o crea un momento de relajo entre tus colaboradores con actividades
          divertidas como Bingo, trivia, entre otros.
        </div>
        <div className="companies">
          <Image
            src={`${config.storageUrl}/resources/companies.svg`}
            height={"30px"}
            desktopHeight={"40px"}
            margin={"1rem 0"}
            size={"contain"}
          />
        </div>
      </div>
      <div className="right-container">
        <Image
          src={`${config.storageUrl}/resources/header.png`}
          width={"100%"}
          height={"400px"}
          margin={"0"}
          size={"contain"}
        />
      </div>
    </HeaderLandingContainer>
  );
};

const HeaderLandingContainer = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.secondary};
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column-reverse;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 25px;
    letter-spacing: 0.03em;
    color: ${(props) => props.theme.basic.whiteLight};
    margin: 1rem 0;
  }

  .subtitle {
    font-family: Lato;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.whiteLight};
    margin: 1rem 0;
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.whiteLight};
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    flex-direction: row;
    padding: 2rem;
    justify-content: center;

    .left-container {
      max-width: 485px;
    }

    .title {
      font-size: 40px;
      line-height: 44px;
    }

    .subtitle {
      font-size: 24px;
      line-height: 29px;
    }

    .description {
      font-size: 18px;
      line-height: 22px;
    }
  }
`;
