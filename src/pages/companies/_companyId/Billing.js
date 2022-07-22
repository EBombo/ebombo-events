import React, { useEffect, useGlobal, useState, useRef, useMemo } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../constants";
import { PanelBox } from "../../../components/common/PanelBox";
import { getCurrencySymbol, PlanIntervals } from "../../../components/common/DataList";
import { Anchor, ButtonAnt } from "../../../components/form";
import { useRouter } from "next/router";
import { snapshotToArray } from "../../../utils";
import { config, firestore } from "../../../firebase";
import { CurrentPlanCard } from "./billing/CurrentPlanCard";
import { PlansTable } from "../../../pages/subscriptions/PlansTable";
import { useSendError, useTranslation } from "../../../hooks";
import { formatAmount, sendToCheckout } from "../../../stripe";
import { useFetch } from "../../../hooks/useFetch";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { darkTheme } from "../../../theme";

export const Billing = (props) => {
  const router = useRouter();
  const { companyId } = router.query;

  const { t, locale } = useTranslation("pages.billing");

  const plansTableEl = useRef(null);

  const { sendError } = useSendError();

  const { Fetch } = useFetch();

  const [authUser] = useGlobal("user");

  const [activePlan, setActivePlan] = useState(null);
  const [subscription, setSubscription] = useState();
  const [isLoadingPlan, setIsLoadingPlan] = useState(false);
  const [isLoadingCheckoutPlan, setIsLoadingCheckoutPlan] = useState(false);

  const [updateSubscriptionData, setUpdateSubscriptionData] = useState(null);
  const [previewSubscriptionUpdateResponse, setPreviewSubscriptionUpdateResponse] = useState(null);
  const [isLoadingUpdateSubscription, setIsLoadingUpdateSubscription] = useState(false);
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

  const previewSubscriptionUpdate = async (plan, price) => {
    try {
      setIsLoadingUpdateSubscription(true);

      const customerQuery = await firestore
        .doc(`customers/${authUser.id}`)
        .get();

      const customer = customerQuery.data();

      const { response, error } = await Fetch(`${config.serverUrl}/api/subscriptions/${subscription.id}/review`, "POST", {
        priceId: price.id,
        customerId: customer?.stripeId,
      });

      if (error) throw error;

      setPreviewSubscriptionUpdateResponse(response);

    } catch (err) {
      props.showNotification("Error", err?.message || err?.error, "error");
      sendError(err);
    }

    setIsLoadingUpdateSubscription(false);
  };

  const updateSubscription = async (plan, price) => {
    try {
      setIsLoadingUpdateSubscription(true);

      await Fetch(`${config.serverUrl}/api/subscriptions/${plan.id}`, "PUT", {
        priceId: price.id,
      });

      setIsLoadingUpdateSubscription(false);
    } catch (err) {
      props.showNotification("Error", err?.message, "error");
      setIsLoadingUpdateSubscription(false);
      sendError(err);
    }
  };

  const onInitSubscriptionUpdate = async (plan, price) => {
    try {
      setIsVisibleUpdateSubscriptionModal(true);
      setUpdateSubscriptionData({
        plan: plan,
        price: price,
      });

      // Previews the proration when updating subscription.
      await previewSubscriptionUpdate(plan, price);


    } catch (err) {

      sendError(err);
    }
  };

  const confirmUpdateSubscriptionButton = useMemo(() => {
    if (!previewSubscriptionUpdateResponse) return;

    return (<ButtonAnt
      margin="20px auto auto auto"
      variant="contained"
      color="primary"
      size="big"
      onClick={() => { updateSubscription() }}
    >
      {t("confirm")}
    </ButtonAnt>);
  }, [previewSubscriptionUpdateResponse]);

  const onCancelSubscriptionUpdate = () => {
    setIsVisibleUpdateSubscriptionModal(false)

    setUpdateSubscriptionData(null);
    setPreviewSubscriptionUpdateResponse(null);
  };

  return (
    <>
      <ModalContainer
        footer={null}
        closable={false}
        padding={"1rem"}
        top="10%"
        background={darkTheme.basic.whiteLight}
        visible={isVisibleUpdateSubscriptionModal}
      >
        <div className="text-blackDarken">
          <div className="text-xl  text-center">{t("update-subscription-modal-title")}</div>
          
          <div className="text-blackDarken text-center">{t("update-subscription-modal-changing-to")}</div>

          {updateSubscriptionData && (<>
            <div>{updateSubscriptionData.plan.name}</div>

            <div>{getCurrencySymbol[updateSubscriptionData.price.currency]} {updateSubscriptionData.price.amount}</div>
          </>)}

          {previewSubscriptionUpdateResponse && (<>

            <div className="mb-4">
              {previewSubscriptionUpdateResponse.invoice.lines.data.map((lineData, index) => (
                <div key={`line-${index}`}>
                  {lineData.description} 
                  <div className="float-right">
                    {formatAmount(lineData.amount)} {getCurrencySymbol[lineData.currency]}
                  </div>
                </div>
              ))}
            </div>

            <div>
              {t("subtotal")}
              <div className="float-right">
                {getCurrencySymbol[previewSubscriptionUpdateResponse.invoice.currency]} {formatAmount(previewSubscriptionUpdateResponse.invoice.subtotal)}
              </div>
            </div>

            <div className="">
              {t("total")} 
              <div className="float-right">
                {getCurrencySymbol[previewSubscriptionUpdateResponse.invoice.currency]} {formatAmount(previewSubscriptionUpdateResponse.invoice.total)}
              </div>
            </div>

          </>)}

          <div className="flex flex-wrap">
            <ButtonAnt
              margin="20px auto auto auto"
              variant="contained"
              color="default"
              size="big"
              onClick={() => onCancelSubscriptionUpdate()}
            >
              {t("cancel")}
            </ButtonAnt>

            {confirmUpdateSubscriptionButton}
          </div>
        </div>
      </ModalContainer>

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
