import React, { useEffect, useState } from "reactn";
import { firestore } from "../firebase";
import { freePlan, plansInOrder } from "../components/common/DataList";
import { snapshotToArray } from "../utils";
import map from "lodash/map";

const sortPlans = (plans) => {
  // Order plans based on plansInOrder from DataList.
  let orderedPlans = map(plansInOrder, (orderPlanName) =>
    plans.filter((p) => p.name?.toLowerCase().includes(orderPlanName?.toLowerCase()))?.[0]
  );

  // This filter removes possible undefined items on orderedPlans list.
  orderedPlans = orderedPlans.filter((plan) => !!plan);

  return orderedPlans;
};

export const useStripePlans = (props) => {
  const [isLoadingPlans, setIsLoadingPlans] = useState(false);
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

        plan.prices = activePrices.map((p) => ({
          id: p.id,
          amount: p.unit_amount / 100,
          currency: p.currency,
          ...p,
        }));

        plan.currentPrice = {
          id: activePrices?.[0]?.id,
          amount: activePrices?.[0]?.unit_amount ? activePrices[0].unit_amount / 100 : "-",
          currency: activePrices?.[0]?.currency,
        };

        return plan;
      });

      const plans_ = await Promise.all(plansPromises);

      const sortedPlans = sortPlans([freePlan, ...plans_]);

      setPlans(sortedPlans);

      setIsLoadingPlans(false);
    };

    setIsLoadingPlans(true);
    return fetchPlans();
  }, []);

  return { plans, isLoadingPlans };
};
