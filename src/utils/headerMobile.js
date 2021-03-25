import React from "react";
import { Icon } from "antd";
import { ButtonBombo } from "../components";

export const headerMobile = (func) => {
  return (
    <div className="header-registration">
      <ButtonBombo
        className="btn-primary-mobile-left btn-registration-mobile"
        htmlType="submit"
      >
        <Icon type="arrow-left" />
      </ButtonBombo>
    </div>
  );
};
