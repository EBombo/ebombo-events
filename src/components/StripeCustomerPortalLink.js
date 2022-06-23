import React, { useGlobal } from "reactn";
import { useSendError, useTranslation } from "../hooks";
import { Anchor } from "./form";
import { goToPortalLink } from "../stripe";

export const StripeCustomerPortalLink = ({ anchorWrapperClassName, anchorClassName, ...props }) => {
  const { sendError } = useSendError();

  const { t } = useTranslation();

  const [,setScreenLoader] = useGlobal("screenLoader");

  const goToCustomerPortal = async () => {
    setScreenLoader(true);
    try {
      // Redirects to Stripe Customer Portal.
      await goToPortalLink();
    } catch (error) {
      sendError(error);
      props.showNotification?.(t("errors.general-title"),t("errors.general-message"), "error");
    }
    setScreenLoader(false);
  };

  return (
    <>
      <div className={anchorWrapperClassName}>
        <Anchor {...props} onClick={() => goToCustomerPortal()}>
          <span className={anchorClassName}>{props.children}</span>
        </Anchor>
      </div>
    </>
  );
};
