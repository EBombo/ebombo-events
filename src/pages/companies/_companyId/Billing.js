import React, { useEffect, useGlobal, useState, useRef, useMemo } from "reactn";
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
import { UpdateSubscriptionModal } from "./billing/UpdateSubscriptionModal";

export const Billing = (props) => {
  const router = useRouter();
  const { companyId } = router.query;

  const { t, locale } = useTranslation("pages.billing");

  const plansTableEl = useRef(null);

  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");

  const [activePlan, setActivePlan] = useState(null);
  const [subscription, setSubscription] = useState();
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLoadingCheckoutPlan, setIsLoadingCheckoutPlan] = useState(false);

  const [updateSubscriptionData, setUpdateSubscriptionData] = useState(null);

  const [isVisibleUpdateSubscriptionModal, setIsVisibleUpdateSubscriptionModal] = useState(false);

  useEffect(() => {
    const getPlan = async () => {
      setIsLoadingPlan(true);

      const activeSubscriptionsQuery = await firestore
        .collection(`customers/${authUser.id}/subscriptions`)
        .where("status", "==", "active")
        .orderBy("created", "desc")
        .get();

      const activeSubscriptions = snapshotToArray(activeSubscriptionsQuery);

      if (!activeSubscriptions.length) return setIsLoadingPlan(false);

      const subscription_ = activeSubscriptions[0];

      const product = (await subscription_.product.get()).data();

      setSubscription(subscription_);

      setActivePlan(product);
      return setIsLoadingPlan(false);
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

  const onInitSubscriptionUpdate = async (plan, price) => {
    setUpdateSubscriptionData({
      plan: plan,
      price: price,
    });
    setIsVisibleUpdateSubscriptionModal(true);
  };

  return (
    <>
      <UpdateSubscriptionModal
        subscription={subscription}
        updateSubscriptionData={updateSubscriptionData}
        isVisibleUpdateSubscriptionModal={isVisibleUpdateSubscriptionModal}
        setIsVisibleUpdateSubscriptionModal={setIsVisibleUpdateSubscriptionModal}
        setUpdateSubscriptionData={setUpdateSubscriptionData}
        {...props}
      />

      <BillingContainer>
        <div className="inner-layout">
          <CurrentPlanCard
            className="plan-card"
            isLoadingPlan={isLoadingPlan}
            activePlan={activePlan}
            subscription={subscription}
            onClickSeePlans={() => {
              if (typeof window === "undefined") return;

              plansTableEl.current.scrollIntoView({
                behavior: "smooth",
              });
            }}
            {...props}
          />

          {subscription ? (
            <PanelBox elevated heading={t("general-vision")}>
              <div>Plan: {activePlan?.name}</div>
              <>
                <div className="mb-5">
                  <Anchor
                    key={locale}
                    underlined
                    className="link"
                    url={`/companies/${companyId}/billing?subscriptionId=${subscription?.id}`}
                  >
                    {t("manage-invoices")}
                  </Anchor>
                </div>
                <div>
                  {t("payment-cycle")}: {PlanIntervals[subscription?.items?.[0]?.plan?.interval]}{" "}
                </div>
              </>
            </PanelBox>
          ) : (
            <div />
          )}
          <div className="col-start-1 col-end-3" ref={plansTableEl}>
            <PlansTable
              {...props}
              showCallToActionSection
              currentPlan={activePlan}
              currentSubscription={subscription}
              onSelectedPlan={onSelectedPlan}
              onInitSubscriptionUpdate={onInitSubscriptionUpdate}
              isLoadingCheckoutPlan={isLoadingCheckoutPlan}
            />
          </div>
        </div>
      </BillingContainer>
    </>
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
      grid-template-rows: auto 1fr;
      gap: 1rem;
    }
  }
`;
