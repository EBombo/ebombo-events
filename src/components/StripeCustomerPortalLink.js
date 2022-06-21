import React, { useState } from "reactn";
import { useSendError } from "../hooks";
import { Anchor, ButtonAnt } from "./form";
import { ModalContainer } from "./common/ModalContainer";
import { spinLoaderMin } from "./common/loader";
import { goToPortalLink } from "../stripe";
import { darkTheme } from "../theme";

export const StripeCustomerPortalLink = ({ anchorWrapperClassName, anchorClassName, ...props }) => {
  const { sendError } = useSendError();

  const [isLodingPortalLink, setIsLoadingPortalLink] = useState(false);

  const goToCustomerPortal = async () => {
    setIsLoadingPortalLink(true);
    try {
      // Redirects to Stripe Customer Portal.
      await goToPortalLink();
    } catch (error) {
      setIsLoadingPortalLink(false);
      sendError(error);
      props.showNotification?.("Error", "Algo salió mal, intente dentro de unos momentos", "error");
    }
  };

  return (
    <>
      <ModalContainer
        background={darkTheme.basic.whiteLight}
        visible={isLodingPortalLink}
        footer={null}
        closable
        padding={"1rem"}
        onCancel={() => setIsLoadingPortalLink(false)}
      >
        <div className="text-lg text-black">
          <div>Se está redireccionando a la gestión de su plan</div>
          <div>{spinLoaderMin()}</div>
          <div className="table">
            <ButtonAnt onClick={() => setIsLoadingPortalLink(false)}>Aceptar</ButtonAnt>
          </div>
        </div>
      </ModalContainer>
      <div className={anchorWrapperClassName}>
        <Anchor {...props} onClick={() => goToCustomerPortal()}>
          <span className={anchorClassName}>{props.children}</span>
        </Anchor>
      </div>
    </>
  );
};
