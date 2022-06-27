import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { PanelBox } from "../../../components/common/PanelBox";
import { PlanIntervals } from "../../../components/common/DataList";
import { Anchor } from "../../../components/form";
import { useRouter } from "next/router";
import { snapshotToArray } from "../../../utils";
import { firestore } from "../../../firebase";
import { CurrentPlanCard } from "./billing/CurrentPlanCard";
import { PlansTable } from "../../../pages/subscriptions/PlansTable";
import { useSendError, useTranslation } from "../../../hooks";
import { sendToCheckout } from "../../../stripe";

export const Billing = (props) => {
  const router = useRouter();
  const { companyId } = router.query;

  const { t } = useTranslation();

  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");

  const [activePlan, setActivePlan] = useState();
  const [subscription, setSubscription] = useState();
  const [isSubscriptionStatusEnabled, setIsSubscriptionStatusEnabled] = useState(false);
  const [isLoadingCheckoutPlan, setIsLoadingCheckoutPlan] = useState(false);

  useEffect(() => {
    const getPlan = async () => {
      const activeSubscriptionsQuery = await firestore
        .collection(`customers/${authUser.id}/subscriptions`)
        .where("status", "==", "active")
        .orderBy("created", "desc")
        .get();

      const activeSubscriptions = snapshotToArray(activeSubscriptionsQuery);

      if (!activeSubscriptions.length) return setActivePlan(null);

      setSubscription(activeSubscriptions[0]);

      return setActivePlan((await activeSubscriptions[0].product.get()).data());
    };

    return getPlan();
  }, []);

  const onSelectedPlan = async (plan, price) => {
    try {
      if (plan.name.includes("Gratis")) return;
      if (plan.name.includes("Exclusivo")) return router.push(`/contact`);

      setIsLoadingCheckoutPlan(true);
      await sendToCheckout(authUser?.id, price?.id);
    } catch (err) {
      props.showNotification("Error", err?.message, "error");
      setIsLoadingCheckoutPlan(false);
      sendError(err);
    }
  };

  return (
    <BillingContainer>
      {isSubscriptionStatusEnabled ? (
        <>
          <div>
            <Anchor variant="primary" onClick={() => setIsSubscriptionStatusEnabled(!isSubscriptionStatusEnabled)}>
              {t("pages.billing.go-back")}
            </Anchor>
          </div>
          <PlansTable
            {...props}
            showCallToActionSection
            currentPlan={activePlan}
            onSelectedPlan={onSelectedPlan}
            isLoadingCheckoutPlan={isLoadingCheckoutPlan}
          />
        </>
      ) : (
        <div className="inner-layout">
          {subscription ? (
            <PanelBox elevated heading="Vision General">
              <div>Plan: {activePlan?.name}</div>
              <>
                <div>
                  <Anchor
                    underlined
                    className="link"
                    url={`/companies/${companyId}/billing?subscriptionId=${subscription?.id}`}
                  >
                    Gestionar Facturas
                  </Anchor>
                </div>
                <div>
                  <Anchor underlined className="link" onClick={() => setIsSubscriptionStatusEnabled(true)}>
                    Administrar suscripción
                  </Anchor>
                </div>
                <div>Ciclo de pago: {PlanIntervals[subscription?.items?.[0]?.plan?.interval]} </div>
              </>
            </PanelBox>
          ) : (
            <div />
          )}
          <CurrentPlanCard
            className="plan-card"
            activePlan={activePlan}
            subscription={subscription}
            setIsSubscriptionStatusView={setIsSubscriptionStatusEnabled}
            {...props}
          />
        </div>
      )}
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
