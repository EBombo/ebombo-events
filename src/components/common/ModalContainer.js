import styled from "styled-components";
import {Modal} from "antd";
import {mediaQuery} from "../../styles/constants";
import React from "reactn";

export const ModalContainer = (props) => (
  <ModalContainerCss {...props}>{props.children}</ModalContainerCss>
);

const ModalContainerCss = styled(Modal)`
  top: 10px;
  ${mediaQuery.afterTablet} {
    top: 50px;
  }

  .ant-modal-content {
    margin-bottom: 50px;
  }

  .ant-modal-close {
    color: ${(props) =>
      props.primary === "true"
        ? props.theme.basic.blackLighten
        : props.theme.basic.primary};
  }

  .ant-modal-body {
    background: ${(props) =>
      props.primary === "true"
        ? props.theme.basic.gray
        : props.theme.basic.blackLighten};

    color: ${(props) =>
      props.primary === "true"
        ? props.theme.basic.blackLighten
        : props.theme.basic.white};
  }
`;
