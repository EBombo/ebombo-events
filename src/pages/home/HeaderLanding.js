import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../constants";
import { config } from "../../firebase";
import { Anchor, ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import dynamic from "next/dynamic";
import { spinLoaderMin } from "../../components/common/loader";
import { useAuth } from "../../hooks/useAuth";
import { darkTheme } from "../../theme";
import { useRouter } from "next/router";

const Login = dynamic(() => import("../login"), {
  loading: () => spinLoaderMin(),
});

const ForgotPassword = dynamic(() => import("../forgot-password"), {
  loading: () => spinLoaderMin(),
});

export const HeaderLanding = (props) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const [active, setActive] = useState(false);
  const [authUser] = useGlobal("user");
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useGlobal(
    "isVisibleLoginModal"
  );
  const [isVisibleForgotPassword] = useGlobal("isVisibleForgotPassword");

  const loginModal = () =>
    isVisibleLoginModal && !authUser ? (
      <ModalContainer
        background={darkTheme.basic.gray}
        visible={isVisibleLoginModal && !authUser}
        onCancel={() => setIsVisibleLoginModal(false)}
        footer={null}
        closable={false}
        padding={"1rem"}
      >
        {isVisibleForgotPassword ? (
          <ForgotPassword {...props} />
        ) : (
          <Login {...props} />
        )}
      </ModalContainer>
    ) : null;

  return (
    <HeaderLandingContainer>
      {loginModal()}
      <div className="navbar">
        <div className="logo-container">
          <Image
            src={`${config.storageUrl}/resources/ebombo.svg`}
            height={"auto"}
            width={"125px"}
            size={"contain"}
            margin={"0"}
            cursor={"pointer"}
            alt=""
            onClick={() => authUser && router.push("/library")}
          />
        </div>
        <Desktop>
          <div className="nav-links">
            <ul>
              <li onClick={() => props.executeScroll("services")}>Servicios</li>
              <li onClick={() => props.executeScroll("games")}>Juegos</li>
              <li onClick={() => props.executeScroll("events")}>Eventos</li>
              <li onClick={() => props.executeScroll("contact")}>Contacto</li>
            </ul>
          </div>
          {authUser ? (
            <Anchor
              onClick={() => signOut()}
              variant="secondary"
              fontSize="18px"
            >
              Cerrar Sesión
            </Anchor>
          ) : (
            <div className="btns-container">
              <Anchor
                onClick={() => router.push("/register")}
                variant="secondary"
                fontSize="18px"
                margin="auto 8px"
                className="anchor"
              >
                Regístrate
              </Anchor>
              <ButtonAnt
                onClick={() => setIsVisibleLoginModal(true)}
                color="secondary"
                variant="outlined"
                fontSize="18px"
              >
                Iniciar sesión
              </ButtonAnt>
            </div>
          )}
        </Desktop>
        <Tablet>
          <ul className={`nav-menu ${active ? "active" : ""}`}>
            <li
              className="nav-item"
              onClick={() => {
                setActive(!active);
                props.executeScroll("services");
              }}
            >
              Servicios
            </li>
            <li
              className="nav-item"
              onClick={() => {
                setActive(!active);
                props.executeScroll("games");
              }}
            >
              Juegos
            </li>
            <li
              className="nav-item"
              onClick={() => {
                setActive(!active);
                props.executeScroll("events");
              }}
            >
              Eventos
            </li>
            <li
              className="nav-item"
              onClick={() => {
                setActive(!active);
                props.executeScroll("contact");
              }}
            >
              Contacto
            </li>
            {!authUser ? (
              <>
                <li
                  className="nav-item"
                  onClick={() => setIsVisibleLoginModal(true)}
                >
                  Iniciar sesión
                </li>
                <li
                  className="nav-item"
                  onClick={() => router.push("/register")}
                >
                  Regístrate
                </li>
              </>
            ) : (
              <li className="nav-item" onClick={() => signOut()}>
                Cerrar Sesión
              </li>
            )}
          </ul>
          <div
            className={`hamburger ${active ? "active" : ""}`}
            onClick={() => setActive(!active)}
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>
        </Tablet>
      </div>
      <div className="header-content">
        <div className="first-content">
          <div className="title">
            Somos una empresa <span>que aprendió a romper barreras</span>
          </div>
          <Desktop>
            <div className="button-container">
              <ButtonAnt
                variant="contained"
                color="secondary"
                onClick={() => props.executeScroll("contact")}
                margi="0 0 0 10px"
              >
                Contáctanos
              </ButtonAnt>
            </div>
          </Desktop>
        </div>
        <div className="second-content">
          <Desktop>
            <Image
              src={`${config.storageUrl}/resources/b2bLanding/desktop-header.png`}
              width={"100%"}
              height={"400px"}
              margin={"0"}
              size={"contain"}
            />
          </Desktop>
          <Tablet>
            <Image
              src={`${config.storageUrl}/resources/b2bLanding/mobile-header.png`}
              width={"auto"}
              height={"250px"}
              margin={"0"}
              size={"contain"}
            />
          </Tablet>
        </div>
        <Tablet>
          <div className="button-container">
            <ButtonAnt
              variant="contained"
              color="white"
              onClick={() => props.executeScroll("contact")}
            >
              Contáctanos
            </ButtonAnt>
          </div>
        </Tablet>
      </div>
    </HeaderLandingContainer>
  );
};

const HeaderLandingContainer = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};

  li {
    list-style: none;
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 100px;
    background: ${(props) => props.theme.basic.whiteLight};
    padding: 0 1rem;

    .nav-links {
      ul {
        display: flex;
        align-items: center;
        margin: 0;

        li {
          padding: 0 1rem;
          color: ${(props) => props.theme.basic.secondary};
          font-style: normal;
          font-weight: bold;
          font-size: 20px;
          line-height: 25px;
          cursor: pointer;
        }
      }
    }

    .bar {
      display: block;
      width: 25px;
      height: 3px;
      margin: 5px auto;
      -webkit-transition: all 0.3s ease-in-out;
      transition: all 0.3s ease-in-out;
      background-color: ${(props) => props.theme.basic.white};
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
      background-color: #fff;
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

    .nav-item {
      margin: 2.5rem 0;
    }

    .hamburger {
      display: block;
      cursor: pointer;
    }

    .btns-container {
      display: flex;
      align-items: center;
    }
  }

  .header-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
    background: ${(props) => props.theme.basic.secondary};

    .first-content {
      .title {
        text-align: center;
        font-size: 28px;
        line-height: 35px;
        font-weight: normal;
        color: ${(props) => props.theme.basic.secondary};

        span {
          font-weight: bold;
        }
      }

      .button-container {
        margin: 1rem auto;
      }
    }

    .second-content {
      max-width: 100%;
      height: 280px;
    }
  }

  ${mediaQuery.afterTablet} {
    .header-content {
      flex-direction: row;
      padding: 2rem;

      .first-content {
        width: 50%;

        .title {
          font-size: 39px;
          line-height: 49px;
          color: ${(props) => props.theme.basic.white};
          text-align: left;

          span {
            font-weight: bold;
          }
        }

        .button-container {
          margin: 1rem 0;
        }
      }

      .second-content {
        width: 50%;
        height: 400px;
      }
    }
  }
`;
