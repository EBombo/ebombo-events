import React from "react";
import { Icon } from "../components/common/Icons";
import { ButtonBombo } from "../components";

export const registrationHeaderMobile = (func) => (
  <div className="header-registration">
    <ButtonBombo
      className="btn-primary-mobile-left btn-registration-mobile"
      htmlType="submit"
      onClick={() => func && func()}
    >
      <Icon type="arrow-left" />
    </ButtonBombo>
  </div>
);
