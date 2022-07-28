import React, { useEffect, useGlobal, useState, useMemo } from "reactn";
import { firestore, config } from "../firebase";
import { snapshotToArray } from "../utils";
import { ButtonAnt } from "./form";
import { Image } from "./common/Image";
import { DisplayNumber } from "./common/DisplayNumber";
import useCountdown from "../hooks/useCountdown";
import { useTranslation } from "../hooks/useTranslation";
import { useRouter } from "next/router";

export const FreeTrialStatus = () => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const { t } = useTranslation("components.free-trial-status");

  const [userHasSubscription, setUserHasSubscription] = useState(null);
  const [hasFreeTrial, setHasFreeTrial] = useState(false);

  const {
    countdownDate: deadline,
    setCountdownDate,
    timer: [days, hours, minutes, seconds],
  } = useCountdown();

  const companyId = useMemo(() => {
    return authUser?.companyId ? authUser.companyId : firestore.collection("companies").doc().id;
  }, [authUser]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      const allSubscriptionsQuery = await firestore.collection(`customers/${authUser.id}/subscriptions`).get();

      const userHasSubscription_ = !allSubscriptionsQuery.empty;
      setUserHasSubscription(userHasSubscription_);

      const trialSubscriptionsQuery = await firestore
        .collection(`customers/${authUser.id}/subscriptions`)
        .where("status", "==", "trialing")
        .get();

      const hasFreeTrial_ = !trialSubscriptionsQuery.empty;

      setHasFreeTrial(hasFreeTrial_);

      if (trialSubscriptionsQuery.empty) return;

      const trialSubscriptions = snapshotToArray(trialSubscriptionsQuery);

      const subscription = trialSubscriptions[0];

      setCountdownDate(subscription?.current_period_end?.toDate().getTime());
    };

    fetchSubscriptionData();
  }, []);

  const displayTimer = useMemo(() => {
    if (deadline === null) return null;
    if (days + hours + minutes + seconds <= 0) return null;

    return (
      <div className="flex items-center justify-center gap-1">
        <DisplayNumber value={days} label="d" />
        <DisplayNumber value={hours.toString().padStart(2, "0")} label="h" />
        <DisplayNumber value={minutes.toString().padStart(2, "0")} label="m" />
        <DisplayNumber value={seconds.toString().padStart(2, "0")} label="s" />
      </div>
    );
  }, [days, hours, minutes, seconds]);

  if (userHasSubscription && hasFreeTrial)
    return (
      <div className="font-bold text-left text-orangeLight">
        <div className="text-xs">Free Trial</div>
        {displayTimer}
      </div>
    );

  if (userHasSubscription === false)
    return (
      <ButtonAnt
        size="sm"
        color="orange"
        fontWeight="bold"
        onClick={(e) => {
          e.preventDefault();
          return router.push(`/companies/${companyId}?currentTab=billing`);
        }}
      >
        <span>
          <Image src={`${config.storageUrl}/resources/star-button-icon.png`} height="23px" width="23px" />
        </span>
        <div className="hidden lg:inline-block font-bold ml-1 mr-2">{t("activate-premium")}</div>
      </ButtonAnt>
    );

  return null;
};
