import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useAcl } from "../../hooks";
import { config } from "../../firebase";
import { Image } from "../common/Image";
import { Anchor, ButtonAnt } from "../form";
import { sizes } from "../../constants";
import { ModalNewGame } from "../../pages/library/ModalNewGame";

export const DesktopNav = (props) => {
  const router = useRouter();

  const { userAcls } = useAcl();

  const [authUser] = useGlobal("user");
  const [openRightDrawer, setOpenRightDrawer] = useGlobal("openRightDrawer");

  const [isVisibleModalGame, setIsVisibleModalGame] = useState(false);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/admin");
    router.prefetch("/library/games");
  }, []);

  return (
    <DesktopNavContainer>
      {isVisibleModalGame && (
        <ModalNewGame
          {...props}
          isVisibleModalGame={isVisibleModalGame}
          setIsVisibleModalGame={setIsVisibleModalGame}
        />
      )}
      <div className="items-container">
        <Image
          src={`${config.storageUrl}/resources/ebombo-white.png`}
          onClick={() =>
            userAcls.some((acl) => acl.includes("admin"))
              ? router.push("/admin")
              : authUser
              ? router.push("/library/games")
              : router.push("/")
          }
          cursor="pointer"
          height="23px"
          width="88px"
        />

        {authUser && (
          <div className="nav-items">
            <ul>
              <li
                className={`${router.asPath.includes("library") ? "active" : ""}`}
                onClick={() => router.push("/library/games")}
              >
                <Image
                  src={`${config.storageUrl}/resources/library-icon.svg`}
                  width="auto"
                  height="30px"
                  className="icon"
                  margin="0 5px 0 0"
                />
                Librería
              </li>
              <li
                className={`${router.asPath.includes("reports") ? "active" : ""}`}
                onClick={() => router.push("/reports")}
              >
                <Image
                  src={`${config.storageUrl}/resources/reports-icon.svg`}
                  width="auto"
                  height="30px"
                  className="icon"
                  margin="0 5px 0 0"
                />
                Reportes
              </li>
            </ul>
          </div>
        )}
      </div>
      {!authUser && (
        <Anchor url="/login" variant="primary" fontSize={"1rem"}>
          Iniciar sesión
        </Anchor>
      )}
      {authUser && (
        <div className="menu-profile">
          {/*
            <Popover trigger="hover" content="Bienvenido a nuestra versión BETA">
            <button className="premium-btn" onClick={() => console.log("premium")}>
              <Image
                src={`${config.storageUrl}/resources/premium.svg`}
                height={"27px"}
                weight={"27px"}
                margin={"0 5px 0 0"}
              />
              Beta
            </button>
          </Popover>
             */}
          <ButtonAnt variant="contained" width="140px" onClick={() => setIsVisibleModalGame(true)}>
            Crear
          </ButtonAnt>
          <div className="hamburger" onClick={() => setOpenRightDrawer(!openRightDrawer)}>
            <Image
              src={`${config.storageUrl}/resources/user-profile.svg`}
              height="31px"
              width="31px"
              borderRadius="50%"
              size="contain"
              cursor="pointer"
            />
          </div>
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
          padding: 0;
          font-size: ${sizes.font.normal};
          color: ${(props) => props.theme.basic.white};
          display: flex;
          align-items: center;
          cursor: pointer;
          margin: 0 0.5rem;
        }

        .active {
          border-bottom: 3px solid ${(props) => props.theme.basic.primaryLight};
          color: ${(props) => props.theme.basic.primaryLight};

          .icon {
            filter: opacity(0.5);
          }
        }
      }
    }
  }

  .menu-profile {
    display: flex;
    align-items: center;

    .premium-btn {
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-right: 1rem;
      font-family: Lato;
      font-style: normal;
      font-weight: 700;
      font-size: 15px;
      line-height: 18px;
      border: none;
      color: ${(props) => props.theme.basic.primary};
      cursor: pointer;
    }

    .hamburger {
      display: block;
      cursor: pointer;
      margin: 0 1rem;
    }
  }
`;
