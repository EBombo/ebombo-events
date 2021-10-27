import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { Desktop, Tablet } from "../../constants";
import { Anchor, ButtonAnt } from "../../components/form";

export const Navbar = (props) => {
  return (
    <NavContainer>
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
          <Anchor onClick={() => signOut()} variant="secondary" fontSize="18px">
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
              <li className="nav-item" onClick={() => router.push("/register")}>
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
    </NavContainer>
  );
};

const NavContainer = styled.div`
  width: 100%;
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
`;
