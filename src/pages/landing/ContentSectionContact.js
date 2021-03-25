import React from "reactn";
import styled from "styled-components";
import { config } from "../../firebase";
import { centerFlexBox, mediaQuery } from "../../styles/constants";
import { useHistory } from "react-router";
import { ButtonBombo } from "../../components/common";

export const ContentSectionContact = () => {
  const history = useHistory();

  return (
    <ContainerContentSectionContact>
      <div className="content-contacts">
        <div className="content-left">
          <div className="content-button-wsp">
            <div className="title-button">¿Tienes alguna duda o pregunta?</div>
            <div className="item-button-wsp">
              <ButtonBombo
                type="primary"
                display="flex"
                justifyContent="space-between"
                size="small"
                textAlign="left"
                width="100%"
                fontSize="1rem"
                onClick={() => window.open(config.wspUrl, "_blank")}
              >
                <div>
                  Haz click aquí para <br /> hablarnos por Whatsapp
                </div>
                <img
                  src={`${config.storageUrl}/resources/wsp-icon-dark.svg`}
                  alt="wsp eBombo"
                />
              </ButtonBombo>
            </div>
          </div>
        </div>
        <div className="content-right">
          <div className="content-play-game">
            <div className="title-button">
              <div>¿QUÉ ESTÁS ESPERANDO?</div>
              <div>¡COMIENZA A GANAR!</div>
            </div>
            <ButtonBombo
              type="primary"
              width="100%"
              height="3rem"
              fontSize="1rem"
              onClick={() => history.push("/registration")}
            >
              Regístrate
            </ButtonBombo>
          </div>
        </div>
      </div>
    </ContainerContentSectionContact>
  );
};

const ContainerContentSectionContact = styled.section`
  width: 100%;
  padding: 3rem 1rem;
  background: ${(props) => props.theme.basic.blackDarken};

  ${mediaQuery.afterTablet} {
    padding: 4rem 2.5rem 0 2.5rem;
  }

  .content-contacts {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .content-left {
      ${centerFlexBox()};
      margin: 0;

      ${mediaQuery.afterTablet} {
        margin: 1rem;
      }

      .content-button-wsp {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        ${mediaQuery.afterTablet} {
          width: auto;
        }

        .title-button {
          color: ${(props) => props.theme.basic.white};
          font-size: 18px;
          font-weight: 500;
          text-align: center;

          ${mediaQuery.afterTablet} {
            font-weight: 600;
            font-size: 20px;
            line-height: 25px;
            text-align: left;
          }
        }

        .item-button-wsp {
          width: 100%;
          margin-top: 1rem;
        }
      }
    }

    .content-right {
      margin-top: 1rem;

      ${mediaQuery.afterTablet} {
        margin: 1rem;
      }

      .content-play-game {
        width: 100%;

        ${mediaQuery.afterTablet} {
          width: auto;
        }

        .title-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-weight: 800;
          color: ${(props) => props.theme.basic.white};
          margin-bottom: 1rem;
          font-size: 21px;
          text-align: center;

          ${mediaQuery.afterTablet} {
            font-size: 26px;
            line-height: 40px;
          }

          div:last-child {
            color: ${(props) => props.theme.basic.primary};
          }
        }

        .item-button-play {
          width: 80%;
          height: 50px;
          color: ${(props) => props.theme.basic.action};
          background: ${(props) => props.theme.basic.blackDarken};
          font-weight: bold;
          font-size: 19px;
          ${centerFlexBox()};
          border-radius: 11px;
          border: 1px solid ${(props) => props.theme.basic.action};
          cursor: pointer;
          margin: auto;

          ${mediaQuery.afterTablet} {
            font-size: 26px;
            width: 374px;
            height: 75px;
          }
        }
      }
    }
  }
`;
