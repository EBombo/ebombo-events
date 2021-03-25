import React, {lazy, Suspense, useState} from "react";
import styled from "styled-components";
import {config} from "../firebase";
import {mediaQuery} from "../styles/constants";
import {spinLoader} from "../utils";
import {foreignPaymentMethods} from "./common/DataList";
import {LevelYourOpponent} from "./tips";
import {TipUserPay} from "./tips/TipUserPay";
import {TipPaymentsDeposits} from "./tips/TipPaymentsDeposits";
import {TipEvidence} from "./tips/TipEvidence";
import {TipDropouts} from "./tips/TipDropouts";
import {Characteristics} from "./Characteristics";
import {useHistory, useLocation} from "react-router";
import {useGlobal} from "reactn";

const TermConditions = lazy(() => import("./term-conditions"));

export const Footer = (props) => {
  const [activeModalTyC, setActiveModalTyC] = useState(false);
  const history = useHistory();
  const [socialNetworks] = useGlobal("socialNetworks");
  const location = useLocation();

  return (
    <Container>
      <Suspense fallback={spinLoader()}>
        <TermConditions
          setActiveModalTyC={setActiveModalTyC}
          activeModalTyC={activeModalTyC}
        />
      </Suspense>
      {!location.pathname.includes("/events") && (
        <>
          <div className="container-tips">
            <h3>
              <img src={`${config.storageUrl}/resources/star.svg`} alt="" />
              TIPS PARA NUEVOS
            </h3>
            <div className="tips">
              <LevelYourOpponent isMobileStyled={true} />
              <TipUserPay />
              <TipPaymentsDeposits />
              <TipDropouts />
              <TipEvidence />
            </div>
          </div>
          <div className="container-characteristics">
            <h3>
              <img src={`${config.storageUrl}/resources/thunder.svg`} alt="" />
              CARÁCTERISTICAS
            </h3>
            <div className="characteristics">
              <Characteristics />
            </div>
          </div>
        </>
      )}
      <div className="container-services">
        <h3>NUESTROS SERVICIOS</h3>
        <div className="services">
          <div
            className="bombo"
            onClick={() => window.open("https://bombo.pe", "_blank")}
          >
            <ServiceContainer
              src={`${config.storageUrl}/resources/fantasy-background.svg`}
            >
              <div className="service-company">
                <img
                  src={`${config.storageUrl}/resources/bombo-fantasy.svg`}
                  alt=""
                />
              </div>
            </ServiceContainer>
            <h4>Fantasy de Fútbol</h4>
          </div>
          <div className="business" onClick={() => history.push("/events")}>
            <ServiceContainer
              src={`${config.storageUrl}/resources/business-background.jpg`}
            >
              <div className="service-company">
                <img
                  src={`${config.storageUrl}/resources/bombo-business.svg`}
                  alt=""
                />
              </div>
            </ServiceContainer>
            <h4>Eventos Coorporativos</h4>
          </div>
        </div>
      </div>
      <div className="container-info">
        <div className="payments">
          {foreignPaymentMethods.map((paymentMethod, index) => (
            <div key={index}>
              <img src={paymentMethod.svgUrl} alt="" />
            </div>
          ))}
        </div>
        <div className="container-images">
          <img src={`${config.storageUrl}/resources/ebombo-white.svg`} alt="" />
          <img src={`${config.storageUrl}/resources/startupperu.svg`} alt="" />
        </div>
        <div className="description">
          Ebombo no está ligada, vinculada, afiliada o patrocinada por Apple
          Inc, Konami, Electronic Arts, Activision Blizzard, Take-Two
          Interactive, Microsoft, Xbox, Sony, Playstation, Super Cell, Valve,
          Garena, Riot y Epic Games. Todo el contenido, títulos y nombres son de
          las empresas y organizaciones mencionadas
        </div>
        <div
          className="terms"
          onClick={() => setActiveModalTyC(!activeModalTyC)}
        >
          Términos y condiciones
        </div>
      </div>

      <div className="social-medias">
        <div className="images-container">
          {socialNetworks.map((socialNetwork) => (
            <img
              src={`${
                config.storageUrl
              }/resources/${socialNetwork.name.toLowerCase()}-white.svg`}
              alt=""
              key={`${socialNetwork.name}`}
              onClick={() => window.open(socialNetwork.url, "_blank")}
            />
          ))}
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background-color: ${(props) => props.theme.basic.blackLighten};

  .container-tips,
  .container-characteristics,
  .container-services {
    padding: 1rem;
    border-top: 2px solid ${(props) => props.theme.basic.primaryDark};

    h3 {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.basic.primary};
      font-weight: bold;
      font-size: 11px;
      line-height: 14px;

      img {
        margin-right: 5px;
      }

      ${mediaQuery.afterTablet} {
        font-size: 12px;
        line-height: 15px;
      }
    }
  }

  .container-services {
    .services {
      margin-top: 0.5rem;
      display: flex;
      align-items: center;

      .bombo,
      .business {
        margin-right: 10px;
        cursor: pointer;

        h4 {
          font-weight: 600;
          font-size: 11px;
          line-height: 14px;
          text-align: center;
          color: ${(props) => props.theme.basic.whiteDarken};
          margin-top: 5px;
        }
      }
    }
  }

  .container-tips {
    width: 100%;
    overflow: hidden;

    .tips {
      width: 100%;
      max-width: 100%;
      display: -webkit-inline-box;
      overflow-x: scroll;

      ::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .container-characteristics {
    border-top: 1px solid ${(props) => props.theme.basic.whiteDarken};

    .characteristics {
      width: 100%;
      overflow: hidden;
    }
  }

  .container-info {
    padding: 1rem;
    border-top: 2px solid ${(props) => props.theme.basic.primaryDark};

    .payments {
      display: flex;
      align-items: center;

      img {
        margin-right: 10px;
      }
    }

    .container-images {
      display: flex;
      align-items: center;

      img {
        width: 90px;
      }

      margin-bottom: 0.5rem;
    }

    .description {
      color: ${(props) => props.theme.basic.whiteDarken};
      font-size: 9px;
      line-height: 10px;
      margin-bottom: 0.5rem;
    }

    .terms {
      color: ${(props) => props.theme.basic.whiteDarken};
      font-size: 12px;
      line-height: 14px;
      cursor: pointer;
    }
  }

  .social-medias {
    width: 100%;
    border-top: 1px solid ${(props) => props.theme.basic.whiteDarken};
    padding: 1rem;

    .images-container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      img {
        cursor: pointer;
        margin: 0 5px;
        height: 17px;
      }
    }
  }
`;

const ServiceContainer = styled.div`
  background-image: url("${(props) => props.src}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${(props) => (props.size ? props.size : "100% 100%")};
  height: 90px;
  width: 150px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
  }

  .service-company {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    img {
      width: 94px;
    }
  }
`;
