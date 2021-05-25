import styled from "styled-components";
import { Modal } from "antd";
import { mediaQuery } from "../../styles/constants";
import React from "reactn";

export const ModalContainer = (props) => (
  <ModalContainerCss {...props}>{props.children}</ModalContainerCss>
);

const ModalContainerCss = styled(Modal)`
  top: ${(props) => props.top || "10px"};
  margin: 0 auto;

  ${mediaQuery.afterTablet} {
    top: ${(props) => props.top || "50px"};
  }

  .and-modal {
    .ant-modal-body {
      ${(props) => (props.width ? `width: ${props.width};` : "")}
    }
  }

  .ant-modal-content {
    margin-bottom: 50px;
  }

  .ant-modal-close {
    color: ${(props) =>
      props.primary === "true"
        ? props.theme.basic.blackLighten
        : props.theme.basic.primary};

    ${(props) => (props.hiddenClose ? `display:none;` : "")}
  }

  .ant-modal-body {
    background: ${(props) =>
      props.background
        ? props.background
        : props.primary === "true"
        ? props.theme.basic.gray
        : props.theme.basic.blackLighten};

    color: ${(props) =>
      props.primary === "true"
        ? props.theme.basic.blackLighten
        : props.theme.basic.white};
    ${(props) => `padding:${props.padding};` || ""}
  }
`;
