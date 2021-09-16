import styled from "styled-components";
import { Drawer } from "antd";
import { fontWeightFont } from "../../constants";
import { mediaQuery } from "../../constants";

export const DrawerContainer = styled(Drawer)`
  padding-top: 50px;

  .ant-drawer-mask {
    background-color: ${(props) => props.theme.basic.default} !important;
    opacity: 0.7 !important;
  }

  .ant-drawer-content-wrapper {
    width: 80% !important;
    height: auto;

    .ant-drawer-header {
      background: ${(props) => props.theme.basic.black} !important;
      border: none !important;

      .ant-drawer-close {
        i {
          color: ${(props) => props.theme.basic.primary};
          ${fontWeightFont(700)};
        }
      }
    }

    .ant-drawer-body {
      background: ${(props) => props.theme.basic.whiteLight};
      width: 100% !important;
      min-height: 100% !important;
    }

    .ant-drawer-wrapper-body {
      .ant-drawer-header-no-title {
        .ant-drawer-close {
          color: ${(props) => props.theme.basic.white};
        }
      }
    }

    .ant-drawer-content {
      background: ${(props) => props.theme.basic.black} !important;
    }

    .ant-drawer-body {
      padding: 0 !important;
    }
  }
  ${mediaQuery.afterTablet} {
    .ant-drawer-content-wrapper {
      width: 40% !important;
      height: auto !important;
      max-width: 350px;
    }
  }
`;
