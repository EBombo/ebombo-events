import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import sortBy from "lodash/sortBy";
import { mediaQuery } from "../../../constants";
import { PanelBox } from "../../../components/common/PanelBox";
import { Anchor } from "../../../components/form";
import { useRouter } from "next/router";
import { snapshotToArray } from "../../../utils";
import { firestore } from "../../../firebase";
import { CurrentPlanCard } from "./billing/CurrentPlanCard";

export const Billing = (props) => {
  const router = useRouter();
  const { userId } = router.query;

  const [activePlan, setActivePlan] = useState();
  const [subscription, setSubscription] = useState();

  const getUserSubscriptions = () => firestore.collection(`customers/${userId}/subscriptions`).where('status', '==', 'active').get();

  useEffect(() => {
    const getPlan = async () => {
      const rawActiveSubscriptions = snapshotToArray(await getUserSubscriptions());
      const activeSubscriptions = [ ...rawActiveSubscriptions.filter((sub) => !sub.canceled_at), ...rawActiveSubscriptions.filter((sub) => sub.canceled_at)] ;
      // sortBy(rawActiveSubscriptions, []);
      if (activeSubscriptions.length === 0) {
        return setActivePlan(null);
      }
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
              <div><Anchor underlined className="link" onClick={() => router.push(`/users/${userId}/billing?subscriptionId=${subscription?.id}`)}>Gestionar Facturas</Anchor></div>
              <div><Anchor underlined className="link" onClick={() => router.push(`/users/${userId}/billing?subscriptionId=${subscription?.id}`)}>Administrar suscripción</Anchor></div>
            </>
          }
          <div>Ciclo de pago: </div>
        </PanelBox>
        <PanelBox className="panel" elevated heading="Licencias y Admins"/>
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
      grid-auto-flow: column;
      gap: 1rem;
    }
  }
`;
