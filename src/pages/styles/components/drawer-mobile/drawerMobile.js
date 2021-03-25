import styled from "styled-components";
import { Drawer } from "antd";
import { mediaQuery } from "../../constants";

export const DrawerMobile = styled(Drawer)`
  
  padding-top: ${(props) => (props.default ? "3rem" : 0)};
  
  .ant-drawer-content-wrapper {
    width: 90% !important;
    height: ${(props) => (props.default ? "auto" : "100%")}; !important;

    .ant-drawer-body {
      background-color: ${(props) =>
        props.default
          ? props.theme.basic.gray
          : props.theme.basic.blackLighten};
      width: 100% !important;
      min-height: 100% !important;
      padding: ${(props) => (props.default ? "0" : "16px 0")} !important;
    }

    .ant-drawer-wrapper-body {
      .ant-drawer-header-no-title {
        .ant-drawer-close {
          color: ${(props) =>
            props.default
              ? props.theme.basic.blackLighten
              : props.theme.basic.white};
        }
      }
    }
    .ant-drawer-content {
    }
  }
    
  ${mediaQuery.afterTablet} {
    .ant-drawer-content-wrapper {
      width: 40% !important;
      height:  ${(props) => (props.default ? "auto" : "100%")} !important;
      max-width: ${props => props.default ? "352px" : "450px"};
    }
  }
`;

export const ContentSidebarMobile = styled.section`
  width: 100% !important;
  height: auto !important;
`;
