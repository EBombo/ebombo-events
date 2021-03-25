import React from "react";
import styled from "styled-components";
import {btnPrimaryGeneral, centerFlexBox, fontWeightFont, mediaQuery,} from "../../styles/constants";
import {useHistory} from "react-router";
import {config} from "../../firebase";

export const StartToPlay = (props) => {
  const history = useHistory();

  return (
      <Container>
        <ContainerWhatsapp>
          <div className="whatsapp-wrapper">
            <div className="whatsapp-title">¿Tienes alguna duda o pregunta?</div>
            <div
            className="whatsapp-button"
            onClick={() => window.open(config.wspUrl, "_blank")}
          >
              <div className="text">
                Haz click aquí para hablarnos por Whatsapp
              </div>
              <div className="icon">
                <img
                    className="img"
                    src={`${config.storageUrl}/resources/wsp-icon.svg`}
                />
              </div>
          </div>
        </div>
      </ContainerWhatsapp>
      <ContainerStartToPlay>
        <div className="play-wrapper">
          <div className="play-title">¿QUÉ ESTÁS ESPERANDO?</div>
          <div className="play-title-green">¡COMIENZA A GANAR!</div>
        </div>
        <button className="play-button" onClick={() => history.push("/vs")}>
          Empezar a jugar
        </button>
      </ContainerStartToPlay>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 4rem;

  ${mediaQuery.afterTablet} {
    grid-template-columns: auto 1fr;
    grid-gap: 0;
  }
`;

const ContainerWhatsapp = styled.div`
  ${centerFlexBox()};
  width: 100%;

  .whatsapp {
    &-title {
      font-size: 18px;
      line-height: 1.7rem;
      text-align: center;
      color: ${(props) => props.theme.basic.white};
      padding-bottom: 16px;
    }

    &-button {
      display: grid !important;
      grid-template-columns: 1fr auto;
      cursor: pointer;
      ${(props) =>
        btnPrimaryGeneral(
          "1.7rem",
          "normal",
          "auto",
          "100%",
          "auto",
          props.theme.basic.primary,
          "transparent"
        )};
      border-radius: 13px;
      border: 2px solid ${(props) => props.theme.basic.primary} !important;

      .text {
        font-size: 1rem;
        line-height: 25px;
        text-align: left;
        padding: 10px 18px;
        font-weight: normal;
      }

      .icon {
        padding: 10px 18px;

        .img {
          height: 55px !important;
          width: auto !important;
        }
      }
    }
  }
`;

const ContainerStartToPlay = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  grid-template-columns: 1fr;

  ${mediaQuery.afterTablet} {
    grid-template-columns: 1fr auto;
  }

  .play {
    &-wrapper {
      text-align: center;
    }

    &-title,
    &-title-green {
      font-weight: 800;
      font-size: 25px;
      color: ${(props) => props.theme.basic.white};
      margin: 0.5rem 0;
    }

    &-title-green {
      color: ${(props) => props.theme.basic.primary};
    }

    &-button {
      cursor: pointer;
      ${(props) =>
        btnPrimaryGeneral(
          "1.5rem",
          "600",
          "1rem auto",
          "auto",
          "70px",
          props.theme.basic.action,
          props.theme.basic.blackDarken
        )};
      padding: 0.5rem 3rem;
      border-radius: 13px;
      border: 2px solid ${(props) => props.theme.basic.action} !important;
      ${fontWeightFont(600)};
    }
  }
`;
