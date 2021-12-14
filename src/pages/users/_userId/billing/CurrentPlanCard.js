import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { ButtonAnt } from "../../../../components/form";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { darkTheme } from "../../../../theme";
import { sendToCheckout } from "../../../../stripe";
import { SubscriptionPlans } from "./SubscriptionPlans";

export const CurrentPlanCard = (props) => {
  const router = useRouter();
  const {userId} = router.query;

  const [isVisibleSeePlans, setIsVisibleSeePlans] = useState(false);
  const [isLoadingCheckoutPlan, setIsLoadingCheckoutPlan] = useState(false);

  return (
    <PlanCardStyled>
      <ModalContainer
        background={darkTheme.basic.gray}
        footer={null}
        visible={isVisibleSeePlans}
        closable={true}
        onCancel={() => setIsVisibleSeePlans(false)}
        width="100%"
      >
        <SubscriptionPlans
          isLoadingCheckoutPlan={isLoadingCheckoutPlan}
          setIsLoadingCheckoutPlan={setIsLoadingCheckoutPlan}
          onSelectedPlan={async (plan) => {
            if (plan.name.includes("Exclusivo")) return;

            setIsLoadingCheckoutPlan(true);
            await sendToCheckout(userId, plan.currentPrice.id);
            setIsLoadingCheckoutPlan(false);
          }}
          {...props} 
        />
      </ModalContainer>

      <div className="status-label"><span className="dot">&bull;</span>{ props.subscription?.status }</div>
      <div className="subheading">Plan Actual</div>
      <div className="heading">{props.activePlan ? props.activePlan.name : 'Free'}</div>

      {(!props.activePlan || props.subscription?.canceled_at) && (
        <>
          <div className="no-plan-label">¿Aún no tienes un plan?</div>
          <ButtonAnt block color="secondary" className="button-see-plans" onClick={() => {setIsVisibleSeePlans(true)}}>Ver planes</ButtonAnt>
        </>
      )}
    </PlanCardStyled>
  );
};

const PlanCardStyled = styled.div`
  background: ${(props) => props.theme.basic.primary};
  border-radius: 5px;
  padding: 1rem;
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
