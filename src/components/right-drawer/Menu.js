import React, { useGlobal } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { useRouter } from "next/router";
import { Tabs } from "antd";
import { mediaQuery } from "../../constants";
import { useAuth } from "../../hooks/useAuth";

export const Menu = (props) => {
  const { signOut } = useAuth();
  const [, setOpenRightDrawer] = useGlobal("openRightDrawer");
  const [authUser] = useGlobal("user");
  const router = useRouter();
  const { TabPane } = Tabs;

  return (
    <MenuContainer>
      <div className="user-name">
        {get(authUser, "name", "")} {get(authUser, "lastName", "")}
      </div>
      <MenuTabs defaultActiveKey="1">
        <TabPane tab={<b>Mi Cuenta</b>} key="1">
          <MenuItem
            onClick={() => {
              setOpenRightDrawer(false);
              router.push(`/`);
            }}
          >
            <span className="item">Ajustes del Perfil</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenRightDrawer(false);
              router.push(`/`);
            }}
          >
            <span className="item">Ajustes de la Empresa</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenRightDrawer(false);
              router.push(`/`);
            }}
          >
            <span className="item">Facturación</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenRightDrawer(false);
              router.push(`/`);
            }}
          >
            <span className="item">Informe de Uso</span>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenRightDrawer(false);
              router.push(`/`);
            }}
          >
            <span className="item">Plan</span>
          </MenuItem>
          <MenuItem
            logout
            onClick={() => {
              setOpenRightDrawer(false);
              router.push(`/`);
            }}
          >
            <span className="item" onClick={() => signOut()}>
              Cerrar Sesión
            </span>
          </MenuItem>
        </TabPane>
      </MenuTabs>
    </MenuContainer>
  );
};

const MenuContainer = styled.div`
  width: 100%;

  .user-name {
    padding: 0.5rem;
    color: ${(props) => props.theme.basic.grayLight};
    font-weight: 700;
    font-size: 1rem;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
  }
`;

const MenuTabs = styled(Tabs)`
  .ant-tabs-nav::before {
    border-bottom: 2px solid #c4c4c4;
  }

  .ant-tabs-nav {
    margin: 0 !important;

    .ant-tabs-nav-wrap {
      .ant-tabs-nav-list {
        .ant-tabs-tab,
        .ant-tabs-tab-active {
          .notification {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 9px;
            top: 3px;
            right: -4px;
            margin: auto 5px;
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background: ${(props) => props.theme.basic.primary};
            color: ${(props) => props.theme.basic.blackDarken};
          }

          div {
            color: ${(props) => props.theme.basic.blackLighten};
          }
        }

        .ant-tabs-tab {
          padding: 0.5rem 1rem;
          margin: 0 !important;
        }

        .ant-tabs-ink-bar {
          background: ${(props) => props.theme.basic.primary};
        }
      }
    }
  }
`;

const MenuItem = styled.div`
  display: flex;
  position: relative;
  flex-direction: ${(props) => props.flexDirection || "row"};
  cursor: pointer;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 1px #c4c4c4;
  padding: 0 16px;

  span {
    display: flex;
    font-size: 14px;
    color: ${(props) => (props.logout ? props.theme.basic.danger : props.theme.basic.blackLighten)};
    align-items: center;
    height: 100%;

    ${mediaQuery.afterTablet} {
      font-size: 15px;
    }
  }

  .bold {
    font-weight: bold;
  }

  .icon-menu {
    height: 22px;
    width: auto !important;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span {
      font-weight: bold;
    }
  }
`;
