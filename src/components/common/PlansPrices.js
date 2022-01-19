import React from "reactn";
import styled from "styled-components";
import { getCurrencySymbol } from "../../components/common/DataList";
import { ButtonAnt } from "../../components/form/Button";

// data-aos="zoom-in"
export const PlansPrices = (props) => (
  <PlansPricesStyled data-aos-duration="1000">
    {[...props.plans].map((plan, index) => (
      <PlanPriceContent
        plan={plan}
        color={plan.metadata.color}
        background={plan.metadata.background}
        key={`plan-${index}`}
      >
        <div className="plan free">
          {plan.metadata.recommended === "true" && <div className="header">Recomendado</div>}

          <div className="name">{plan.name}</div>

          <div className="price">
            {plan.name === "Exclusivo"
              ? plan.description
              : `${getCurrencySymbol[plan.currentPrice.currency]} ${plan.currentPrice.amount}`}
          </div>

          <div className="time">por mes</div>
          <div className="divider" />
          <div className="users">{plan.metadata.users} usuarios</div>
          <div className="games">{plan.metadata.games} juegos</div>

          <ButtonAnt
            className="btn-register"
            disabled={plan.name === "Gratis" || props.isLoading}
            onClick={() => props.onSelectedPlan?.(plan)}
          >
            {props.selectPlanLabel ?? "Registrarme"}
          </ButtonAnt>
        </div>
      </PlanPriceContent>
    ))}
  </PlansPricesStyled>
);

const PlansPricesStyled = styled.div`
  width: 100%;
  max-width: 1350px;
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  align-items: center;
  margin: 1rem auto;
  overflow: auto;
  padding: 0 0 2rem 0;
`;

const PlanPriceContent = styled.div`
  width: ${(props) => (props.plan.metadata?.recommended === "true" ? "280px" : "234px")};
  height: ${(props) => (props.plan.metadata?.recommended === "true" ? "431px" : "377px")};
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
    font-size: ${(props) => (props.plan.name === "Exclusivo" ? "26px" : "50px")};
    line-height: ${(props) => (props.plan.name === "Exclusivo" ? "31px" : "60px")};
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
    box-shadow: none;
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

    &:enabled {
      background: ${(props) => props.background};
    }
    &:disabled {
      background: ${(props) => props.theme.basic.grayLighten};
    }
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
