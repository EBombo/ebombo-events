import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { PlansPrices } from "./common/PlansPrices";
import { firestore } from "../firebase";
import { snapshotToArray } from "../utils";
import { freePlan } from "../components/common/DataList";

export const SubscriptionPlans = (props) => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (plans.length) return;

    const fetchPlans = async () => {
      const plans = snapshotToArray(await firestore.collection("products").get());

      const plansPromises = plans.map(async (plan) => {
        const AllActivePricesQuery = await firestore
          .collection(`products/${plan.id}/prices`)
          .where("active", "==", true)
          .get();

        const activePrices = snapshotToArray(AllActivePricesQuery);

        plan.currentPrice = {
          id: activePrices?.[0]?.id,
          amount: activePrices?.[0]?.unit_amount ? activePrices[0].unit_amount / 100 : "-",
          currency: activePrices?.[0]?.currency,
        };

        return plan;
      });
      setPlans([freePlan, ...(await Promise.all(plansPromises))]);
    };

    return fetchPlans();
  }, []);

  return (
    <SubscriptionPlansContainer>
      <div className="title">Conoce nuestros planes</div>
      <PlansPrices isLoading={props.isLoadingCheckoutPlan} plans={plans} selectPlanLabel="Escoger" {...props} />
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
