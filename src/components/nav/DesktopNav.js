import React, { useGlobal, useEffect } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useAcl } from "../../hooks";
import { MenuOutlined } from "@ant-design/icons";
import { config } from "../../firebase";
import { Image } from "../common/Image";
import { Anchor } from "../form";
import { sizes } from "../../constants";
import { menus } from "../common/DataList";

export const DesktopNav = (props) => {
  const router = useRouter();
  const { aclMenus } = useAcl();
  const [authUser] = useGlobal("user");
  const [, setOpenRightDrawer] = useGlobal("openRightDrawer");

  useEffect(() => {
    !authUser && router.push("/");
  }, []);

  const getCurrentMenu = () =>
    aclMenus({ menus: menus.filter((menu) => !menu.isAdmin) });

  const isSelected = (path) =>
    path === window.location.pathname ? "item item-selected" : "item";

  return (
    <DesktopNavContainer>
      <div className="items-container">
        <Image
          src={`${config.storageUrl}/resources/ebombo-white.svg`}
          height="23px"
          width="88px"
        />
        <div className="nav-items">
          {getCurrentMenu().map((userLink) => (
            <div
              className={isSelected(userLink.url)}
              key={`key-menu-user-link-${userLink.url}`}
              onClick={() => router.push(userLink.url)}
            >
              <Image
                src={userLink.src}
                width="20px"
                height="20px"
                className="icon"
              />
              <span className="label">{userLink.name}</span>
            </div>
          ))}
        </div>
      </div>
      {!authUser && (
        <Anchor onClick={() => setIsVisibleLoginModal(true)} variant="primary">
          Ingresa
        </Anchor>
      )}
      {authUser && (
        <div className="menu-icon-nav" onClick={() => setOpenRightDrawer(true)}>
          <MenuOutlined />
        </div>
      )}
    </DesktopNavContainer>
  );
};

const DesktopNavContainer = styled.div`
  width: 100%;
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background: ${(props) => props.theme.basic.secondary};

  .items-container {
    display: flex;
    align-items: center;
    height: 100%;

    .nav-items {
      margin-left: 10px;
      height: 100%;

      display: flex;
      align-items: center;
      justify-content: space-evenly;

      .item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${(props) => props.theme.basic.white};
        cursor: pointer;
        padding: 0 0.5rem;
        height: 100%;

        .label {
          font-size: ${sizes.font.small};
          text-align: center;
          margin-left: 3px;
        }
      }

      .item-selected {
        position: relative;
        color: ${(props) => props.theme.basic.primaryLight};
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-bottom: 3px solid ${props => props.theme.basic.primaryLight};

        .icon {
          filter: opacity(0.5);
        }
      }
    }
  }

  .menu-icon-nav {
    color: ${(props) => props.theme.basic.white};
  }
`;
