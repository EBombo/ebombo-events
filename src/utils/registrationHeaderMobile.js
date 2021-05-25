import React from "react";
import { ButtonBombo, Icon } from "../components";

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
