import React, { useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery } from "../../constants";
import { config } from "../../firebase";
import { Anchor, ButtonAnt } from "../../components/form";
import { useRouter } from "next/router";
import { PlansTable } from "./PlansTable";
import { Image } from "../../components/common/Image";
import { plans } from "../../components/common/DataList";

export const Plans = (props) => {
  const router = useRouter();
  const [tab, setTab] = useState("online");

  const contactInfo = () => (
    <ContactContent>
      <div className="info">
        <Image
          src={`${config.storageUrl}/resources/b2bLanding/wsp-icon.svg`}
          width="20px"
          height="20px"
          margin="0 5px 0 0"
          className="icon"
        />
        <div className="info-content">Mateo Suarez Stewart: +51 945 693 597</div>
      </div>
      <div className="info">
        <Image
          src={`${config.storageUrl}/resources/b2bLanding/email.svg`}
          width="20px"
          height="20px"
          margin="0 5px 0 0"
          className="icon"
        />
        <div className="info-content">Mail: mateo@ebombo.com</div>
      </div>
    </ContactContent>
  );

  const tabContent = () => {
    switch (tab) {
      case "online":
        return (
          <PlanContent>
            <Desktop>
              <Image src={`${config.storageUrl}/resources/plan.png`} height="385px" width="519px" size="contain" />
            </Desktop>
            <div className="main-container">
              <div className="title">Evento Virtual</div>
              <div className="subtitle">Eventos desde 10 - 10000 colaboradores</div>
              <div className="divider" />
              <div className="description">Realizamos eventos virutales de todo tipo.</div>
              <ButtonAnt color="secondary">Contáctanos</ButtonAnt>
              {contactInfo()}
            </div>
          </PlanContent>
        );
      case "onsite":
        return (
          <PlanContent>
            <Desktop>
              <Image src={`${config.storageUrl}/resources/plan.png`} height="385px" width="519px" size="contain" />
            </Desktop>
            <div className="main-container">
              <div className="title">Evento Presencial</div>
              <div className="subtitle">Eventos desde 10 - 10000 colaboradores</div>
              <div className="divider" />
              <div className="description">Realizamos eventos presenciales de todo tipo.</div>
              <ButtonAnt color="secondary">Contáctanos</ButtonAnt>
              {contactInfo()}
            </div>
          </PlanContent>
        );
      default:
        return (
          <PlansPrices>
            {plans.map((plan, index) => (
              <PlanPriceContent plan={plan.name} color={plan.color} background={plan.background} key={index}>
                <div className="plan free">
                  {plan.name === "Avanzado" && <div className="header">Recomendado</div>}
                  <div className="name">{plan.name}</div>
                  <div className="price">
                    {plan.name !== "Exclusivo" && "$"} {plan.price}
                  </div>
                  <div className="time">por mes</div>
                  <div className="divider" />
                  <div className="users">{plan.users} usuarios</div>
                  <div className="games">{plan.games} juegos</div>
                  {!router.asPath.includes("/subscriptions") && (
                    <Anchor
                      targe="_self"
                      underlined
                      variant="secondary"
                      fontSize="16px"
                      lineHeight="19px"
                      textAlign="left"
                      margin="0p"
                      onClick={() => router.push("/subscriptions")}
                    >
                      Ver más
                    </Anchor>
                  )}
                  <button className="btn-register" onClick={() => router.push("/register")}>
                    Registrarme
                  </button>
                </div>
              </PlanPriceContent>
            ))}
          </PlansPrices>
        );
    }
  };

  return (
    <>
      <PlansContainer>
        <div className="title">Conoce nuestros planes</div>
        <div className="tabs">
          <div className={`tab ${tab === "online" && "active"}`} onClick={() => setTab("online")}>
            Evento Virtual
          </div>
          <div className={`tab middle-tab ${tab === "onsite" && "active"}`} onClick={() => setTab("onsite")}>
            Evento Presencial
          </div>
          <div className={`tab ${tab === "games" && "active"}`} onClick={() => setTab("games")}>
            Juegos de integración
          </div>
        </div>
        {tabContent()}
      </PlansContainer>
      {router.asPath.includes("/subscriptions") && (
        <TableContainer>
          <PlansTable {...props} />
        </TableContainer>
      )}
    </>
  );
};

const PlansContainer = styled.div`
  width: 100%;
  padding: 1rem;
  background: ${(props) => props.theme.basic.whiteLighten};

  .more-info {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-subs {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 23px;
      color: ${(props) => props.theme.basic.secondary};
      background: none;
      border: none;
    }
  }

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.secondary};
    text-align: center;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    align-items: center;
    background: transparent;
    border: 2px solid ${(props) => props.theme.basic.primary};
    box-sizing: border-box;
    border-radius: 8px;
    margin: 1rem auto;
    max-width: 1100px;

    .tab {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.primary};
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .middle-tab {
      border-left: 2px solid ${(props) => props.theme.basic.primary};
      border-right: 2px solid ${(props) => props.theme.basic.primary};
    }

    .active {
      color: ${(props) => props.theme.basic.whiteLight};
      background: ${(props) => props.theme.basic.primary};
    }
  }
  
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;

    .title {
      font-size: 34px;
      line-height: 41px;
    }

    .tabs {
      margin: 2rem auto;
      border: 4px solid ${(props) => props.theme.basic.primary};
      .tab {
        font-size: 24px;
        line-height: 28px;
      }

      .middle-tab {
        border-left: 4px solid ${(props) => props.theme.basic.primary};
        border-right: 4px solid ${(props) => props.theme.basic.primary};
      }
    }
  }
`;

const TableContainer = styled.div`
  width: 100%;
  overflow: auto;
  margin: 0 auto;
`;

const PlanContent = styled.div`
  width: 100%;
  max-width: 1350px;
  background: ${(props) => props.theme.basic.whiteLight};
  box-shadow: 6px 7px 30px 15px rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  margin: 1rem auto;

  .main-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-top: 2rem;

    .title {
      margin-top: 2rem;
    }

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 29px;
      color: ${(props) => props.theme.basic.grayLighten};
      margin: 1rem;
      text-align: center;
    }

    .divider {
      margin: 1rem auto;
      height: 2px;
      background: ${(props) => props.theme.basic.gray};
      width: 50%;
    }

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0.03em;
      margin-bottom: 2rem;
      text-align: center;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  ${mediaQuery.afterTablet} {
    margin: 2rem auto;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
  }
`;

const ContactContent = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  margin: 2rem auto 1rem auto;

  .info {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 0.5rem 0;

    .info-content {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  ${mediaQuery.afterTablet} {
    flex-direction: row;

    .info {
      margin: 0;
    }
  }
`;

const PlansPrices = styled.div`
  width: 100%;
  max-width: 1350px;
  margin: 1rem auto;
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  overflow: auto;

  ${mediaQuery.afterTablet} {
    grid-template-columns: repeat(5, 1fr);
    margin: 2rem auto;
  }
`;

const PlanPriceContent = styled.div`
  width: ${(props) => (props.plan === "Avanzado" ? "280px" : "234px")};
  height: ${(props) => (props.plan === "Avanzado" ? "431px" : "377px")};
  background: ${(props) => props.theme.basic.whiteLight};
  box-shadow: -7px 5px 30px -2px rgba(0, 0, 0, 0.14);
  border-radius: 8px;
  margin: auto;

  .header {
    width: 100%;
    padding: 0.5rem;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
    color: ${(props) => props.theme.basic.grayLight};
    border-bottom: 2px solid ${(props) => props.theme.basic.gray};
  }

  .plan {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }

  .name {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 24px;
    line-height: 29px;
    color: ${(props) => props.color};
    text-align: center;
    margin: 1rem auto;
  }

  .price {
    font-family: Lato;
    font-style: normal;
    font-weight: 800;
    font-size: ${(props) => (props.plan === "Exclusivo" ? "26px" : "50px")};
    line-height: ${(props) => (props.plan === "Exclusivo" ? "31px" : "60px")};
    color: ${(props) => props.color};
    margin: 1rem auto;
  }

  .divider {
    height: 2px;
    background: ${(props) => props.theme.basic.gray};
    width: 90%;
    margin: 1rem auto;
  }

  .btn-register {
    height: 45px;
    background: ${(props) => props.background};
    border: none;
    cursor: pointer;
    width: 90%;
    margin: 0.5rem auto;
    border-radius: 8px;
    font-family: Lato;
    font-style: normal;
    font-weight: 800;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.whiteLight};
  }

  .time,
  .users,
  .games {
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
    color: ${(props) => props.theme.basic.grayLight};
    text-align: left;
    width: 90%;
    margin: 5px 0;
  }

  .time {
    text-align: center;
  }
`;
