import styled from "styled-components";
import {Modal} from "antd";
import {mediaQuery} from "../../constants";
import React from "reactn";

export const ModalContainer = (props) => (
    <ModalContainerCss {...props}>{props.children}</ModalContainerCss>
);

const ModalContainerCss = styled(Modal)`
  top: 10px;

  ${mediaQuery.afterTablet} {
    top: 50px;
    ${props => props.width ? `width:${props.width}!important;` : ""}
  }

  .ant-modal-content {
    margin-bottom: 50px;
  }

  .ant-modal-close {
    color: ${(props) => props.theme.basic.primary};
  }

  .ant-modal-body {
    padding: 45px 24px 24px 24px;
    background: ${(props) => props.theme.basic.blackDarken};
    color: ${(props) => props.theme.basic.white};
  }
`;
