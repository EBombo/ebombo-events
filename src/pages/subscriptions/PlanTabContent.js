import React from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery } from "../../constants";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { ButtonAnt } from "../../components/form";
import { plans } from "../../components/common/DataList";
import { useRouter } from "next/router";
import { ContactInfo } from "./ContactInfo";

export const PlanTabContent = (props) => {
  const router = useRouter();

  if (props.tab === "online")
    return (
      <PlanContent>
        <Desktop>
          <Image
            src={`${config.storageUrl}/resources/plans-online.png`}
            borderRadius="15px"
            height="300px"
            width="500px"
            size="contain"
          />
        </Desktop>
        <div className="main-container">
          <div className="title">Evento Virtual</div>
          <div className="subtitle">Eventos desde 10 - 10000 colaboradores</div>
          <div className="divider" />
          <div className="description">Realizamos eventos virutales de todo tipo.</div>
          <ButtonAnt color="secondary" onClick={() => router.push({ hash: "contact" })}>
            Contáctanos
          </ButtonAnt>
          <ContactInfo {...props} />
        </div>
      </PlanContent>
    );

  if (props.tab === "onsite")
    return (
      <PlanContent>
        <Desktop>
          <Image
            src={`${config.storageUrl}/resources/plans-face-to-face.png`}
            borderRadius="15px"
            height="300px"
            width="500px"
            size="cover"
          />
        </Desktop>
        <div className="main-container">
          <div className="title">Evento Presencial</div>
          <div className="subtitle">Eventos desde 10 - 10000 colaboradores</div>
          <div className="divider" />
          <div className="description">Realizamos eventos presenciales de todo tipo.</div>
          <ButtonAnt color="secondary" onClick={() => router.push({ hash: "contact" })}>
            Contáctanos
          </ButtonAnt>
          <ContactInfo {...props} />
        </div>
      </PlanContent>
    );

  if (props.tab === "games")
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

              <button className="btn-register" onClick={() => router.push("/register")}>
                Registrarme
              </button>
            </div>
          </PlanPriceContent>
        ))}
      </PlansPrices>
    );
};

const PlanContent = styled.div`
  width: 90%;
  max-width: 1350px;
  margin: 1rem auto;
  border-radius: 8px;
  box-shadow: 6px 7px 30px 15px rgba(0, 0, 0, 0.14);
  background: ${(props) => props.theme.basic.whiteLight};

  ${mediaQuery.afterTablet} {
    width: 100%;
    margin: 2rem auto;
    padding: 10px 0;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 2rem;
  }

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
`;

const PlansPrices = styled.div`
  width: 100%;
  max-width: 1350px;
  margin: 1rem auto;
  display: grid;
  grid-gap: 1rem;
  align-items: center;
  overflow: auto;
  padding: 0 0 2rem 0;

  ${mediaQuery.afterTablet} {
    grid-template-columns: repeat(5, 1fr);
    margin: 2rem auto;
    padding: 20px 0;
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
