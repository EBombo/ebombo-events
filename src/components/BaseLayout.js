import React, {useGlobal, useState} from "reactn";
import {Drawer, Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import styled from "styled-components";
import {doSignOut} from "../firebase/authentication";
import "../utils/responsive";
import {menuAdmin} from "./common/DataList";
import {useAcl} from "../acl";
import {Icon} from "./common/Icons";

const dividers = [
  "/admin/roles",
  "/admin/ballots",
  "/admin/user-accounts",
  "/admin/games/:gameId/tournament-rules",
  "/admin/matches-history",
];

export default (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const [games] = useGlobal("games");
  const { aclMenus } = useAcl();

  const toggle = () => setCollapsed(!collapsed);

  const logOut = () => doSignOut();

  const childWithProperties = (props) =>
    React.Children.map(props.children, (child) =>
      React.cloneElement(child, { ...props })
    );

  let route = window.location.href;
  let currentKey = route.split("admin/").pop().split("/")[0];

  return (
    <BaseLayoutContent>
      <DrawerContent
        placement="left"
        closable={false}
        onClose={() => toggle()}
        visible={!collapsed}
      >
        <ContentLogo>V {props.version}</ContentLogo>
        <Menu
          theme="dark"
          mode="inline"
          onClick={() => toggle()}
          defaultSelectedKeys={[currentKey]}
        >
          <Menu.Item key="/vs">
            <Link to="/vs">
              <Icon type="gold" />
              <span>Inicio</span>
            </Link>
          </Menu.Item>
          {aclMenus({ menus: menuAdmin }).map((menu) => (
            <Menu.Item
              key={menu.url}
              style={{
                borderBottom: dividers.includes(menu.url)
                  ? "1px solid gray"
                  : "",
              }}
            >
              <Link
                to={
                  menu.url.includes(":gameId")
                    ? menu.url.replace(":gameId", games[0].id)
                    : menu.url.includes(":settingId")
                    ? menu.url.replace(":settingId", "default")
                    : menu.url
                }
              >
                <Icon type={menu.type} />
                <span>{menu.value}</span>
              </Link>
            </Menu.Item>
          ))}
          <Menu.Item key="/" onClick={() => logOut()}>
            <Link to="/">
              <Icon type="poweroff" />
              <span>Log Out</span>
            </Link>
          </Menu.Item>
        </Menu>
      </DrawerContent>
      <Layout>
        <Layout.Header className="container-header">
          <Icon
            className="trigger"
            style={{ color: "#fff" }}
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={toggle}
          />
          <span className="project-title" style={{ color: "#fff" }}>
            Bombo
          </span>
        </Layout.Header>
        <Layout.Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "86vh",
          }}
        >
          {childWithProperties(props)}
        </Layout.Content>
      </Layout>
    </BaseLayoutContent>
  );
};

const ContentLogo = styled.div`
  font-size: 17px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => props.theme.basic.white};
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
`;

const BaseLayoutContent = styled(Layout)`
  .container-header {
    padding: 0;
  }

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
  }

  .trigger:hover {
    color: ${(props) => props.theme.basic.primary};
  }

  .logo {
    height: 32px;
    background: ${(props) => props.theme.basic.default};
    margin: 16px;
  }

  .project-title {
    font-size: 20px;
    font-weight: 700;
  }
`;

const DrawerContent = styled(Drawer)`
  overflow-y: auto;
  .ant-drawer-content-wrapper {
    .ant-drawer-content {
      .ant-drawer-wrapper-body {
        color: ${(props) => props.theme.basic.white};
        background-color: ${(props) => props.theme.basic.blackDarken};

        .ant-drawer-body {
          padding: 0;

          .ant-menu,
          .ant-menu-dark,
          .ant-menu-root,
          .ant-menu-inline {
            background: ${(props) => props.theme.basic.blackDarken};

            .ant-menu-item {
              background: ${(props) => props.theme.basic.blackDarken};
            }

            .ant-menu-item-selected {
              background: ${(props) => props.theme.basic.primary};
            }
          }
        }
      }
    }
  }
`;
