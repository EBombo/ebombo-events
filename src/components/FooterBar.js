import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery, sizes } from "../constants";
import { useRouter } from "next/router";
import { useAcl } from "../hooks";
import { menus } from "./common/DataList";
import { Image } from "./common/Image";
import { ModalNewGame } from "../pages/library/ModalNewGame";

const FooterBar = (props) => {
  const router = useRouter();
  const { aclMenus } = useAcl();
  const [authUser] = useGlobal("user");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [isVisibleModalGame, setIsVisibleModalGame] = useState(false);

  const getCurrentMenu = () => aclMenus({ menus: menus.filter((menu) => !menu.isAdmin) });

  const isSelected = (path) => (path === window.location.pathname ? "item item-selected" : "item");

  return (
    <ContainerFooter authUser={authUser} itemLenght={getCurrentMenu().length}>
      <div className="footer-items">
        {getCurrentMenu().map((userLink) => (
          <div
            className={isSelected(userLink.url)}
            key={`key-menu-user-link-${userLink.url}`}
            onClick={() =>
              authUser
                ? userLink.onClick
                  ? userLink.onClick(setIsVisibleModalGame)
                  : router.push(userLink.url)
                : setIsVisibleLoginModal(true)
            }
          >
            <Image src={userLink.src} width="auto" height="30px" className="icon" />
            <span className="label">{userLink.name}</span>
          </div>
        ))}
      </div>
      {isVisibleModalGame && (
        <ModalNewGame
          {...props}
          isVisibleModalGame={isVisibleModalGame}
          setIsVisibleModalGame={setIsVisibleModalGame}
        />
      )}
    </ContainerFooter>
  );
};

const ContainerFooter = styled.section`
  position: fixed;
  height: 50px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;

  .footer-items {
    height: 50px;
    display: grid;
    width: 100%;
    background: ${(props) => props.theme.basic.secondary};
    direction: rtl;
    grid-template-columns: repeat(${(props) => (props.authUser ? props.itemLenght : props.itemLenght - 1)}, 1fr);

    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: ${(props) => props.theme.basic.white};
      cursor: pointer;

      .label {
        font-size: ${sizes.font.small};
        text-align: center;
      }
    }

    .item-selected {
      position: relative;
      color: ${(props) => props.theme.basic.primaryLight};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      .icon {
        filter: opacity(0.5);
      }
    }

    .notification {
      .img-content {
        position: relative;
      }

      .img-content:after {
        content: "";
        background: ${(props) => props.theme.basic.danger};
        width: 15px;
        height: 15px;
        position: absolute;
        top: -5px;
        left: -5px;
        border-radius: 10px;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    width: 61px;
    height: 100vh;
    padding-top: 50px;
    //z-index: 998;
    align-items: flex-start;

    .footer-items {
      display: flex;
      flex-direction: column;
      background: none;
      height: auto;

      .item,
      .item-selected {
        height: 65px;

        :hover {
          background-color: ${(props) => props.theme.basic.blackLighten};
        }
      }
    }
  }
`;

export default FooterBar;
