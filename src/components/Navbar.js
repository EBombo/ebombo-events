import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./common/Image";
import { config } from "../firebase";
import { Desktop, Tablet } from "../constants";
import { Anchor, ButtonAnt } from "./form";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "./common/Layout";
import { Footer } from "./Footer";

export const Navbar = (props) => {
  const router = useRouter();

  const { signOut } = useAuth();

  const [authUser] = useGlobal("user");

  const [active, setActive] = useState(false);

  return (
    <>
      <Layout>
        <NavContainer active={active}>
          <div className="left-container">
            <Image
              src={`${config.storageUrl}/resources/ebombo.svg`}
              height="auto"
              width="125px"
              size="contain"
              margin="0"
              cursor="pointer"
              alt=""
              onClick={() => router.push(authUser ? "/library" : "/")}
            />
            <Desktop>
              {/*
                <a
                  className="ant-dropdown-link"
                  onClick={() => {
                    router.push("/games");
                  }}
                >
                  Games
                </a>
              */}
              <Anchor onClick={() => router.push("/subscriptions")} className="link">
                Planes
              </Anchor>
              <Anchor onClick={() => router.push("/about-us")} className="link">
                Sobre nosotros
              </Anchor>
              <Anchor onClick={() => router.push({ pathname: "/", hash: "contact" })} className="link">
                Contacto
              </Anchor>
            </Desktop>
          </div>

          {/* TODO remove for dev purposes.
          <Desktop>
            {authUser ? (
              <Anchor onClick={() => signOut()} variant="secondary" fontSize="18px">
                Cerrar Sesión
              </Anchor>
            ) : (
              <div className="btns-container">
                <Anchor
                  onClick={() => router.push("/register")}
                  variant="secondary"
                  fontSize="18px"
                  fontWeight="500"
                  margin="auto 8px"
                  className="anchor"
                >
                  Regístrate
                </Anchor>
                <ButtonAnt onClick={() => router.push("/login")} color="secondary" variant="outlined" fontSize="18px">
                  Iniciar sesión
                </ButtonAnt>
              </div>
            )}
          </Desktop>
          */}

          <Tablet>
            <ul className={`nav-menu ${active ? "active" : ""}`}>
              {/*
                <li
                  className="nav-item"
                  onClick={() => {
                    router.push("/games");
                  }}
                >
                  Games
                </li>
              */}
              <li className="nav-item" onClick={() => router.push("/subscriptions")}>
                Planes
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  router.push({ pathname: "/", hash: "about" });
                  setActive(false);
                }}
              >
                Sobre nosotros
              </li>
              <li
                className="nav-item"
                onClick={() => {
                  router.push({ pathname: "/", hash: "contact" });
                  setActive(false);
                }}
              >
                Contacto
              </li>

              {/*TODO remove for dev purposes.*/}
              {/*
              !authUser ? (
                <>
                  <ButtonAnt
                    margin="1.5rem auto"
                    onClick={() => router.push("/login")}
                    color="secondary"
                    variant="outlined"
                    fontSize="18px"
                  >
                    Iniciar sesión
                  </ButtonAnt>
                  <li className="nav-item" onClick={() => router.push("/register")}>
                    Regístrate
                  </li>
                </>
              ) : (
                <li className="nav-item" onClick={() => signOut()}>
                  Cerrar Sesión
                </li>
              )
              */}
            </ul>

            <div className={`hamburger ${active ? "active" : ""}`} onClick={() => setActive(!active)}>
              <span className="bar" />
              <span className="bar" />
              <span className="bar" />
            </div>
          </Tablet>
        </NavContainer>

        <LayoutMenu>
          <Body>{props.children}</Body>
          <Footer />
        </LayoutMenu>
      </Layout>
    </>
  );
};

const LayoutMenu = styled.section`
  min-height: 100vh;
  padding: 0;
`;

const Body = styled.section`
  width: 100vw;
  flex: 1 1 auto;
  display: grid;
  min-height: calc(100vh - 100px);
`;

const NavContainer = styled.div`
  z-index: 9;
  width: 100%;
  display: flex;
  height: 100px;
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
  background: ${(props) => props.theme.basic.whiteLight};
  position: ${(props) => (props.active ? "fixed" : "inherit")};

  .left-container {
    display: flex;
    align-items: center;

    .ant-dropdown-link,
    .link {
      color: ${(props) => props.theme.basic.secondary};
      margin: 0 1rem;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 22px;
    }
  }

  .bar {
    display: block;
    width: 25px;
    height: 3px;
    margin: 5px auto;
    -webkit-transition: all 0.3s ease-in-out;
    transition: all 0.3s ease-in-out;
    background-color: ${(props) => props.theme.basic.primary};
  }

  .hamburger.active .bar:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger.active .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  .nav-menu {
    position: fixed;
    z-index: 999;
    left: -100%;
    top: 5rem;
    flex-direction: column;
    background-color: ${(props) => props.theme.basic.whiteLight};
    width: 100%;
    text-align: center;
    transition: 0.3s;
    box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);

    li {
      cursor: pointer;
    }
  }

  .nav-menu.active {
    left: 0;
  }

  .games-item {
    padding: 1rem 0;
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  .last {
    border-bottom: 1px solid ${(props) => props.theme.basic.whiteDarken};
  }

  .nav-item {
    padding: 1.5rem 0;
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.secondary};
    border-bottom: 1px solid ${(props) => props.theme.basic.whiteDarken};
  }

  .hamburger {
    display: block;
    cursor: pointer;
  }

  .btns-container {
    display: flex;
    align-items: center;
  }
`;
