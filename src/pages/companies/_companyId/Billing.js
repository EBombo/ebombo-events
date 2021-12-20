import React, { useState, useEffect, useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { PanelBox } from "../../../components/common/PanelBox";
import { PlanIntervals } from "../../../components/common/DataList";
import { Anchor } from "../../../components/form";
import { useRouter } from "next/router";
import { snapshotToArray } from "../../../utils";
import { firestore } from "../../../firebase";
import { CurrentPlanCard } from "./billing/CurrentPlanCard";

export const Billing = (props) => {
  const router = useRouter();
  const { companyId } = router.query;

  const [authUser] = useGlobal("user");

  const [activePlan, setActivePlan] = useState();
  const [subscription, setSubscription] = useState();

  useEffect(() => {
    const getPlan = async () => {
      const activeSubscriptionsQuery = await firestore
        .collection(`customers/${authUser.id}/subscriptions`)
        .where('status', '==', 'active')
        .orderBy('created', 'desc').get();

      const activeSubscriptions = snapshotToArray(activeSubscriptionsQuery);

      if (!activeSubscriptions.length) return setActivePlan(null);

      setSubscription(activeSubscriptions[0]);

      return setActivePlan((await activeSubscriptions[0].product.get()).data());
    };

    return getPlan();
  }, []);

  return (
    <BillingContainer>
      <div className="inner-layout">
        <PanelBox elevated heading="Vision General">
          <div>Plan: {activePlan?.name}</div>
          { subscription && 
            <>
              <div>
                <Anchor
                  underlined
                  className="link"
                  onClick={() => router.push(`/companies/${companyId}/billing?subscriptionId=${subscription?.id}`)}
                >
                  Gestionar Facturas
                </Anchor>
              </div>
              <div>
                <Anchor
                  underlined
                  className="link"
                  onClick={() => router.push(`/companies/${companyId}/billing?subscriptionId=${subscription?.id}`)}
                >
                  Administrar suscripción
                </Anchor>
              </div>
              <div>Ciclo de pago: { PlanIntervals[subscription?.items?.[0]?.plan?.interval] } </div>
            </>
          }
        </PanelBox>
        <CurrentPlanCard className="plan-card" activePlan={activePlan} subscription={subscription} {...props} />
      </div>
    </BillingContainer>
  );
};

const BillingContainer = styled.div`
  margin: 0.5rem;

  .link {
    color: ${(props) => props.theme.basic.primary};
  }

  ${mediaQuery.afterTablet} {
    margin: 1rem;
  }

  .inner-layout {
    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 1rem;
    }
  }
`;