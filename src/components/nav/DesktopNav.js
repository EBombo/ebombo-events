import React, { useGlobal } from "reactn";
import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useAcl } from "../../hooks";
import { MenuOutlined } from "@ant-design/icons";
import { config } from "../../firebase";
import { Image } from "../common/Image";
import { Anchor, ButtonAnt } from "../form";
import { sizes } from "../../constants";

export const DesktopNav = (props) => {
  const router = useRouter();
  const { userAcls } = useAcl();
  const [authUser] = useGlobal("user");
  const [, setOpenRightDrawer] = useGlobal("openRightDrawer");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");

  return (
      <DesktopNavContainer>
        <div className="items-container">
          <Image
              src={`${config.storageUrl}/resources/ebombo-white.svg`}
              onClick={() =>
                  userAcls.some((acl) => acl.includes("admin"))
                      ? router.push("/admin")
                      : authUser
                          ? router.push("/library/games")
                          : router.push("/")
              }
              height="23px"
              width="88px"
          />
          {authUser && (
              <div className="nav-items">
                <ul>
                  <li onClick={() => router.push("/library/games")}>Librería</li>
                  <li onClick={() => router.push("/reports")}>Reportes</li>
                </ul>
              </div>
          )}
        </div>
        {!authUser && (
            <Anchor onClick={() => setIsVisibleLoginModal(true)} variant="primary">
              Ingresa
            </Anchor>
        )}
        {authUser && (
            <div className="menu-profile">
              <div
                  className="menu-icon-nav"
                  DesktopLibrary
                  onClick={() => setOpenRightDrawer(true)}
              >
                <MenuOutlined />
              </div>
              <ButtonAnt variant="contained" width="200px">
                Crear
              </ButtonAnt>
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

      ul {
        list-style: none;
        display: flex;
        align-items: center;
        justify-content: space-around;
        height: 100%;
        margin: 0;

        li {
          height: 100%;
          padding: 0.5rem;
          font-size: ${sizes.font.normal};
          color: ${(props) => props.theme.basic.white};
          display: flex;
          align-items: center;
          cursor: pointer;
        }
      }
    }
  }

  .menu-profile {
    display: flex;
    .menu-icon-nav {
      margin: auto 10px;
      color: ${(props) => props.theme.basic.white};
    }
  }
`;