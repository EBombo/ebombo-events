import React, { useEffect, useGlobal, useState } from "reactn";
import { ButtonAnt } from "../../../../components/form";
import { darkTheme } from "../../../../theme";
import { config, firestore } from "../../../../firebase";
import { useSendError, useTranslation } from "../../../../hooks";
import { amountToString, formatAmount } from "../../../../stripe";
import { useFetch } from "../../../../hooks/useFetch";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import { Image } from "../../../../components/common/Image";
import { timeoutPromise } from "../../../../utils/promised";
import { getCurrencySymbol, stripeDateFormat } from "../../../../components/common/DataList";
import moment from "moment";
import { useRouter } from "next/router";

export const UpdateSubscriptionModal = ({
  subscription,
  isVisibleUpdateSubscriptionModal,
  setIsVisibleUpdateSubscriptionModal,
  updateSubscriptionData,
  setUpdateSubscriptionData,
  ...props}) => {

  const router = useRouter();

  const { t } = useTranslation("components.update-subscription-modal");
  const { t : tError } = useTranslation("errors");

  const { sendError } = useSendError();

  const { Fetch } = useFetch();

  const [authUser] = useGlobal("user");

  const [previewSubscriptionUpdateResponse, setPreviewSubscriptionUpdateResponse] = useState(null);
  const [previewSubscriptionUpdateError, setPreviewSubscriptionUpdateError] = useState(null);
  const [subscriptionUpdateError, setSubscriptionUpdateError] = useState(null);
  const [didSubscriptionUpdate, setDidSubscriptionUpdate] = useState(false);

  const [isLoadingUpdateSubscription, setIsLoadingUpdateSubscription] = useState(false);
  // Hide detailed balance of preview in Update Subscription.
  const [showInvoiceLineItems] = useState(false);

  useEffect(() => {
    if (!isVisibleUpdateSubscriptionModal) return;

    fetchPreviewSubscriptionUpdate();
  }, [isVisibleUpdateSubscriptionModal]);


  const getErrorMessage = (err) => (err?.message || err?.error || err);

  const fetchPreviewSubscriptionUpdate = async () => {
    try {
      // Previews the proration when updating subscription.
      // Fetch customer data to get customer StripeId.
      const customerQuery = await firestore
        .doc(`customers/${authUser.id}`)
        .get();

      const customer = customerQuery.data();

      const { response, error } = await Fetch(`${config.serverUrl}/api/subscriptions/${subscription.id}/review`, "POST", {
        priceId: updateSubscriptionData.price.id,
        customerId: customer?.stripeId,
      });

      if (error) throw error;

      setPreviewSubscriptionUpdateResponse(response);
    } catch (err) {
      props.showNotification("Error", err?.message || err?.error || err, "error");
      setPreviewSubscriptionUpdateError(err);
      sendError(err);
    }
  };

  const updateSubscription = async () => {
    try {
      setIsLoadingUpdateSubscription(true);
      setSubscriptionUpdateError(null);

      // const error = { error: "Test Failed"};
      // const error = null;
      // await timeoutPromise(3000)
      const { error } = await Fetch(`${config.serverUrl}/api/subscriptions/${subscription.id}`, "PUT", {
        priceId: updateSubscriptionData.price.id,
      });

      if (error) throw error;

      // After Successful Update Subscription.
      setDidSubscriptionUpdate(true);
      // Refresh page.
      await timeoutPromise(3000);
      router.reload();
    } catch (err) {
      props.showNotification("Error", err?.message || err?.error || err, "error");
      setSubscriptionUpdateError(err);
      sendError(err);
    }
    setIsLoadingUpdateSubscription(false);
  };

  const onCancelSubscriptionUpdate = () => {
    setIsVisibleUpdateSubscriptionModal(false)
    setDidSubscriptionUpdate(false);

    setUpdateSubscriptionData(null);
    setPreviewSubscriptionUpdateResponse(null);
    setPreviewSubscriptionUpdateError(null);
    setSubscriptionUpdateError(null);
  };

  if (!subscription || !updateSubscriptionData) return (
    <ModalContainer 
      footer={null}
      closable={false}
      padding={"0rem 0rem 2rem 0rem"}
    >
    <div className="text-base text-danger">
      <div>{!subscription && tError("subscription-not-found")}</div>
      <div>{!updateSubscriptionData && tError("plan-not-found")}</div>
    </div>
  </ModalContainer>);

  return (
    <ModalContainer
      footer={null}
      closable={false}
      padding={"0rem 0rem 2rem 0rem"}
      top="10%"
      background={darkTheme.basic.white}
      visible={isVisibleUpdateSubscriptionModal}
    >

      <div className="font-bold text-2xl mb-16 bg-primary text-white pt-8 px-8 pb-8">
        <div className="mb-8 min-h-[30px]">
          <Image
            src={`${config.storageUrl}/resources/ebombo-white.png`}
            height="auto"
            width="70px"
            desktopWidth="100px"
            margin="0"
          />
        </div>
        {t("update-subscription-modal-title")}
      </div>

      <div className={`text-blackDarken px-8 pb-4
        overflow-hidden transition-height duration-300 ease-in-out ${(previewSubscriptionUpdateResponse || previewSubscriptionUpdateError) ? "max-h-[600px]" : "max-h-[200px]"}`
      }>
        <div className="font-bold uppercase mb-4">{t("update-subscription-modal-changing-to")}</div>
        {updateSubscriptionData && (<>
          <div className="font-bold text-xl mb-8">
            {updateSubscriptionData.plan.name}

            <div className="float-right text-base">{getCurrencySymbol[updateSubscriptionData.price.currency]} {amountToString(updateSubscriptionData.price.amount)}</div>
          </div>
        </>)}

        {!previewSubscriptionUpdateResponse
          ? (previewSubscriptionUpdateError
            ? (<div className="text-base text-danger">
                <div>{getErrorMessage(previewSubscriptionUpdateError)}</div>
                <div>{tError("general-message")}</div>
              </div>)
            : (<div className="text-base text-grayDarken">{t("loading-preview-data-of-operation")}</div>))
          : (<>
            <div className="mb-4">
              {showInvoiceLineItems && previewSubscriptionUpdateResponse.invoice.lines.data.map((lineData, index) => (
                <div key={`line-${index}`}>
                  {lineData.description} 
                  <div className="float-right">
                    {amountToString(formatAmount(lineData.amount))} {getCurrencySymbol[lineData.currency]}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-b-[1px] border-gray mb-8"/>

            <div className=" text-base mb-12">
              {t("amount-due")} {moment.unix(previewSubscriptionUpdateResponse.invoice.created).format(stripeDateFormat)}
              <div className="float-right font-bold">
                {getCurrencySymbol[previewSubscriptionUpdateResponse.invoice.currency]} {amountToString(formatAmount(previewSubscriptionUpdateResponse.invoice.amount_due))}
              </div>
            </div>
          </>)}

        {subscriptionUpdateError && (
          <div className="text-base text-danger">
            <div>{getErrorMessage(subscriptionUpdateError)}</div>
            <div>{tError("general-message")}</div>
          </div>
        )}

        {didSubscriptionUpdate && !subscriptionUpdateError && (
          <div className="text-lg font-bold text-success">
            <div>{t("update-subscription-ok-success")}</div>
          </div>
        )}

        <div className="flex flex-wrap">
          <ButtonAnt
            margin="20px auto auto auto"
            variant="contained"
            color="default"
            size="big"
            width="150px"
            onClick={(e) => {
              e.preventDefault();
              onCancelSubscriptionUpdate();
            }}
            fontSize="14px"
            fontWeight="bold"
          >
            {t("cancel")}
          </ButtonAnt>

          <ButtonAnt
                margin="20px auto auto auto"
                variant="contained"
                color="primary"
                size="big"
                fontSize="14px"
                fontWeight="bold"
                width="150px"
                disabled={!previewSubscriptionUpdateResponse || didSubscriptionUpdate}
                loading={isLoadingUpdateSubscription}
                onClick={(e) => {
                  e.preventDefault();
                  updateSubscription();
                }}
              >
                {t("confirm")}
          </ButtonAnt>
        </div>
      </div>
    </ModalContainer>
  );
};
