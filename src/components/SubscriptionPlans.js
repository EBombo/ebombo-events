import React from "reactn";
import styled from "styled-components";
import { PlansPrices } from "./common/PlansPrices";
import { Switch } from "./form";
import { useStripePlans } from "../hooks/useStripePlans";

export const SubscriptionPlans = (props) => {
  const { plans } = useStripePlans();

  return (
    <SubscriptionPlansContainer>
      <div className="title">{props.title}</div>
      <div className="flex justify-center gap-4 text-base font-bold text-black text-xl whitespace-nowrap">
        <span>Pago anual</span>
        <Switch size="small" checked={props?.isMonthly} onChange={() => props?.setIsMonthly((oldValue) => !oldValue)} />
        <span>Pago mensual</span>
      </div>

      <PlansPrices
        isMonthly={props?.isMonthly}
        isLoading={props.isLoadingCheckoutPlan ?? false}
        plans={plans}
        selectPlanLabel={props.selectPlanLabel ?? "Escoger"}
        {...props}
      />
    </SubscriptionPlansContainer>
  );
};

const SubscriptionPlansContainer = styled.div`
  .title {
    text-align: center;
    font-size: 24px;
    color: ${(props) => props.theme.basic.black};
  }
`;
