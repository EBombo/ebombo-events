import React, { useGlobal, useMemo, useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { Desktop, Tablet } from "../../constants";
import { Anchor, ButtonAnt } from "../../components/form";
import { useRouter } from "next/router";
import { useAuth } from "../../hooks/useAuth";
import { Dropdown, Menu, message } from "antd";
import { DownOutlined } from "@ant-design/icons";

const menus = [{ title: "Bingo" }, { title: "Charadas" }, { title: "Canta y Gana" }, { title: "Trivia" }];

export const Navbar = (props) => {
  const router = useRouter();
  const { signOut } = useAuth();
  const [authUser] = useGlobal("user");
  const [active, setActive] = useState(false);
  const [isVisibleNavGames, setIsVisibleNavGames] = useState(false);

  const onClick = ({ key }) => {
    message.info(`Click on item ${key}`);
  };

  const menu = useMemo(
    () => (
      <Menu onClick={onClick}>
        {menus.map((menu, index) => (
          <Menu.Item key={index}>Bingo</Menu.Item>
        ))}
      </Menu>
    ),
    [menus]
  );

  return (
    <NavContainer>
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
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Games <DownOutlined />
            </a>
          </Dropdown>
          <Anchor onClick={() => router.push("/subscriptions")} className="link">
            Planes
          </Anchor>
          <Anchor variant="secondary" onClick={() => router.push("/held-events")} className="link">
            Eventos pasados
          </Anchor>
          <Anchor variant="secondary" onClick={() => router.push("/")} className="link">
            Sobre nosotros
          </Anchor>
          <Anchor variant="secondary" onClick={() => router.push("/")} className="link">
            Contacto
          </Anchor>
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
              onClick={() => router.push("/register")}
              variant="secondary"
              fontSize="18px"
              fontWeight="500"
              margin="auto 8px"
              className="anchor"
            >
              Regístrate
            </Anchor>
            <ButtonAnt onClick={() => router.push("login")} color="secondary" variant="outlined" fontSize="18px">
              Iniciar sesión
            </ButtonAnt>
          </div>
        )}
      </Desktop>
      <Tablet>
        <ul className={`nav-menu ${active ? "active" : ""}`}>
          <li className="nav-item" onClick={() => setIsVisibleNavGames(!isVisibleNavGames)}>
            Games <DownOutlined />
          </li>
          {isVisibleNavGames && (
            <>
              <li className="games-item">Bingo</li>
              <li className="games-item">Charadas</li>
              <li className="games-item">Canta y Gana</li>
              <li className="games-item last">Trivia</li>
            </>
          )}
          <li className="nav-item">Planes</li>
          <li className="nav-item">Eventos pasados</li>
          <li className="nav-item">Sobre nosotros</li>
          <li className="nav-item">Contacto</li>
          {!authUser ? (
            <>
              <ButtonAnt
                margin="1.5rem auto"
                onClick={() => router.push("login")}
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
          )}
        </ul>
        <div className={`hamburger ${active ? "active" : ""}`} onClick={() => setActive(!active)}>
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100px;
  background: ${(props) => props.theme.basic.whiteLight};
  padding: 0 1rem;

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