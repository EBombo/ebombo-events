import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Image } from "./common/Image";
import { config } from "../firebase";
import { Desktop, Tablet } from "../constants";
import { Anchor, ButtonAnt } from "./form";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { Layout } from "./common/Layout";
import { Footer } from "./Footer";
import { landingHeaderMenu } from "./common/DataList";

export const Navbar = (props) => {
  const router = useRouter();

  const { signOut } = useAuth();

  const [authUser] = useGlobal("user");

  const [active, setActive] = useState(false);

  useEffect(() => {
    router.prefetch("/");
    router.prefetch("/login");
    router.prefetch("/register");
    router.prefetch("/library");
    router.prefetch("/about-us");
    router.prefetch("/subscriptions");
  }, []);

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
              {landingHeaderMenu.map((menu) => (
                <Anchor url={menu.url} className="link">
                  {menu.title}
                </Anchor>
              ))}
            </Desktop>
          </div>

          <Desktop>
            {authUser ? (
              <Anchor onClick={() => signOut()} variant="secondary" fontSize="18px">
                Cerrar Sesión
              </Anchor>
            ) : (
              <div className="btns-container">
                <Anchor
                  url="/login"
                  variant="secondary"
                  fontSize="18px"
                  fontWeight="500"
                  margin="auto 8px"
                  className="anchor"
                >
                  Iniciar sesión
                </Anchor>
                <ButtonAnt onClick={() => router.push("/contact")} color="success" variant="contained" fontSize="18px">
                  Contáctanos
                </ButtonAnt>
              </div>
            )}
          </Desktop>

          <Tablet>
            <ul className={`nav-menu ${active ? "active" : ""}`}>
              {landingHeaderMenu.map((menu) => (
                <li
                  className="nav-item"
                  onClick={() => {
                    router.push(menu.url);
                    setActive(false);
                  }}
                >
                  {menu.title}
                </li>
              ))}

              {!authUser ? (
                <>
                  <ButtonAnt
                    margin="1.5rem auto"
                    onClick={() => router.push("/contact")}
                    color="success"
                    variant="contained"
                    fontSize="18px"
                  >
                    Contáctanos
                  </ButtonAnt>
                  <li className="nav-item" onClick={() => router.push("/login")}>
                    Iniciar sesión
                  </li>
                </>
              ) : (
                <li className="nav-item" onClick={() => signOut()}>
                  Cerrar Sesión
                </li>
              )}
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
