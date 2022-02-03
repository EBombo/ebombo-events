import React, { useEffect, useState } from "reactn";
import { firestore } from "../firebase";
import { freePlan } from "../components/common/DataList";
import { snapshotToArray } from "../utils";

export const useStripePlans = (props) => {
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
          ...p
        }));

        plan.currentPrice = {
          id: activePrices?.[0]?.id,
          amount: activePrices?.[0]?.unit_amount ? activePrices[0].unit_amount / 100 : "-",
          currency: activePrices?.[0]?.currency,
        };

        return plan;
      });

      const plans_ = await Promise.all(plansPromises);

      setPlans([freePlan, ...(plans_)]);
    };

    return fetchPlans();
  }, []);

  return { plans };
};
