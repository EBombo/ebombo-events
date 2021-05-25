import React from "react";
import { ButtonBombo, Icon } from "../components";

export const registrationFooterMobile = (func) => (
  <div className="footer-registration">
    <div>
      <h3>Siguiente</h3>
      <ButtonBombo
        block={true}
        className="btn-primary-mobile btn-login-mobile"
        htmlType="submit"
        onClick={(e) => func && func(e)}
      >
        <div>
          <Icon type="arrow-right" />
        </div>
      </ButtonBombo>
    </div>
  </div>
);
