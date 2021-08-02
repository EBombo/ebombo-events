import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import { Desktop, Tablet } from "../../constants";
import { config } from "../../firebase";
import { mediaQuery } from "../../constants";
import { Anchor, ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import dynamic from "next/dynamic";
import { spinLoaderMin } from "../../components/common/loader";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "next/router";

const Login = dynamic(() => import("../login"), {
  loading: () => spinLoaderMin(),
});

const ForgotPassword = dynamic(() => import("../forgot-password"), {
  loading: () => spinLoaderMin(),
});

export const HeaderLanding = (props) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [active, setActive] = useState(false);
  const [authUser] = useGlobal("user");
  const [isVisibleLoginModal, setIsVisibleLoginModal] = useGlobal(
    "isVisibleLoginModal"
  );
  const [isVisibleForgotPassword] = useGlobal(isVisibleForgotPassword);

  useEffect(() => {
    if (authUser) router.push("/library");
  }, [authUser]);

  const loginModal = () =>
    isVisibleLoginModal && !authUser ? (
      <ModalContainer
        visible={isVisibleLoginModal && !authUser}
        onCancel={() => setIsVisibleLoginModal(false)}
        footer={null}
      >
        <Login {...props} />
      </ModalContainer>
    ) : null;

  return (
    <HeaderLandingContainer>
      {loginModal()}
      <div className="navbar">
        <div className="logo-container">
          <img
            src={`${config.storageUrl}/resources/b2bLanding/b2bLogo.svg`}
            alt=""
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
          <div className="button-container">
            {authUser ? (
              <Anchor
                onClick={() => signOut()}
                variant="secondary"
                fontSize="18px"
              >
                Cerrar Sesión
              </Anchor>
            ) : (
              <Anchor
                onClick={() => setIsVisibleLoginModal(true)}
                variant="secondary"
                fontSize="18px"
              >
                Ingresa
              </Anchor>
            )}
          </div>
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
  padding: 1rem;
  background: conic-gradient(
      from -7.32deg at 50% 50%,
      rgba(255, 255, 255, 0) -26.25deg,
      #c4adff 127.5deg,
      rgba(255, 255, 255, 0) 333.75deg,
      #956dfc 487.5deg
    ),
    #956dfc;

  li {
    list-style: none;
  }

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .nav-links {
      ul {
        display: flex;
        align-items: center;
        margin: 0;

        li {
          padding: 0 1rem;
          color: ${(props) => props.theme.basic.white};
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
      border-radius: 10px;
      text-align: center;
      transition: 0.3s;
      box-shadow: 0 10px 27px rgba(0, 0, 0, 0.05);
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
  }

  .header-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1rem;

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
