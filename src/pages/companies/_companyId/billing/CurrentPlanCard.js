import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../../../components/form";
import { StripeCustomerPortalLink } from "../../../../components/StripeCustomerPortalLink";

export const CurrentPlanCard = (props) => {
  return (
    <PlanCardStyled className="relative">
      <div className="status-label">
        <span className="dot">&bull; </span>
        {props.subscription?.status ?? "Free"}
      </div>
      <div className="subheading">Plan Actual</div>
      <div className="heading">{props.activePlan ? props.activePlan.name : "Free"}</div>

      {!props.activePlan || props.subscription?.canceled_at ? (
        <>
          <div className="no-plan-label">¿Aún no tienes un plan?</div>
          <ButtonAnt
            block
            color="secondary"
            className="button-see-plans"
            onClick={() => {
              props.setIsSubscriptionStatusView?.(true);
            }}
          >
            Ver planes
          </ButtonAnt>
        </>
      ) : (
        <StripeCustomerPortalLink
          anchorWrapperClassName="absolute bottom-0 left-0 right-0 py-2 px-4 rounded-b-lg bg-secondary text-white"
          anchorClassName="text-white underline"
        >
          Cambiar los detalles de pago
        </StripeCustomerPortalLink>
      )}
    </PlanCardStyled>
  );
};

const PlanCardStyled = styled.div`
  background: ${(props) => props.theme.basic.primary};
  border-radius: 5px;
  padding: 1rem 1rem 3rem 1rem;
  margin: 1rem 0;

  .status-label {
    float: right;
    padding: 0.25rem 0.5rem;
    background: ${(props) => props.theme.basic.secondary};
    color: ${(props) => props.theme.basic.white};
    border-radius: 2px;
    text-transform: capitalize;

    .dot {
      color: ${(props) => props.theme.basic.success};
      font-size: 24px;
      position: relative;
      top: 3px;
      line-height: 1px;
    }
  }

  .heading {
    color: ${(props) => props.theme.basic.white};
    font-size: 14px;
    margin-bottom: 12px;
  }

  .subheading {
    color: ${(props) => props.theme.basic.white};
    font-size: 14px;
    opacity: 0.7;
  }
  .no-plan-label {
    color: ${(props) => props.theme.basic.secondary};
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 12px;
  }
`;
