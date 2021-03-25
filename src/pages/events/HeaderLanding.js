import React from "reactn";
import styled from "styled-components";
import {Desktop, Tablet} from "../../utils";
import {config} from "../../firebase";
import {mediaQuery} from "../../styles/constants";
import sizes from "../../styles/constants/sizes";
import {useHistory} from "react-router";

export const HeaderLanding = (props) => {
  const history = useHistory();

  return (
    <HeaderLandingContainer>
      <div className="navbar">
        <div className="right-navbar">
          <ul>
            <Desktop>
              <li onClick={() => history.push("/")}>
                <img
                  src={`${config.storageUrl}/resources/b2bLanding/b2bLogo.svg`}
                  alt=""
                />
              </li>
            </Desktop>
            <li>
              <a href="#services">Servicios</a>
            </li>
            <li>
              <a href="#games">Juegos</a>
            </li>
            <li>
              <a href="#events">Eventos</a>
            </li>
            <li>
              <a href="#contact">Contacto</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="title-container">
        <Tablet>
          <img
            src={`${config.storageUrl}/resources/b2bLanding/b2bLogo.svg`}
            alt=""
            height="35px"
          />
        </Tablet>
        <img
          src={`${config.storageUrl}/resources/b2bLanding/the-event.svg`}
          alt=""
          height="35px"
        />
        <div className="title">DE BIENESTAR CORPORATIVO</div>
        <div className="subtitle">que tu empresa necesita</div>
      </div>
      <div className="companies">CONFÍAN EN NOSOTROS</div>
    </HeaderLandingContainer>
  );
};

const HeaderLandingContainer = styled.section`
  height: 100vh;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/1.png"});
  position: relative;
  .companies {
    position: absolute;
    bottom: 1rem;
    left: 0;
    right: 0;
    font-size: 14px;
    line-height: 17px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) => props.theme.basic.white};
    ${mediaQuery.afterTablet} {
      font-size: 25px;
      line-height: 31px;
    }
  }

  .navbar {
    display: flex;
    justify-content: center;
    padding: 1rem;
    ${mediaQuery.afterTablet} {
      justify-content: flex-end;
    }

    .right-navbar {
      ${mediaQuery.afterTablet} {
        width: 53%;
      }

      ul {
        list-style-type: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;

        li {
          img {
            height: 40px;
          }
          a {
            margin: 0 10px;
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 20px;
            color: ${(props) => props.theme.basic.white};
            ${mediaQuery.afterTablet} {
              font-size: 18px;
              line-height: 22px;
            }
          }
        }
      }
    }
  }
  .title-container {
    display: flex;
    justify-content: center;
    flex-direction: column;

    img {
      margin-bottom: 0.5rem;
    }

    .title {
      font-weight: 800;
      font-size: ${sizes.font.xExtraLarge};
      line-height: 21px;
      color: ${(props) => props.theme.basic.white};
      text-align: center;
      margin-bottom: 0.5rem;
      ${mediaQuery.afterTablet} {
        font-size: 42px;
        line-height: 52px;
      }
    }
    .subtitle {
      font-weight: 600;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.white};
      text-align: center;
      margin-bottom: 0.5rem;
      ${mediaQuery.afterTablet} {
        font-size: 40px;
        line-height: 50px;
      }
    }
  }
`;
