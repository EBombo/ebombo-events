import React from "reactn";
import styled from "styled-components";
import {Desktop, Tablet} from "../../utils";
import {config} from "../../firebase";
import {mediaQuery} from "../../styles/constants";
import sizes from "../../styles/constants/sizes";
import {useHistory} from "react-router";
import {Image} from "../../components/common/Image";

export const HeaderLanding = (props) => {
    const history = useHistory();

    return <HeaderLandingContainer>
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
            <div className="presenter">
                <Image
                    src={`${config.storageUrl}/landing/presenter.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
            <div className="emojis">
                <Image
                    src={`${config.storageUrl}/landing/emojis.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
            <div className="astronaut">
                <Image
                    src={`${config.storageUrl}/landing/astronaut-left.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
            <div className="director">
                <Image
                    src={`${config.storageUrl}/landing/director.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
            <div className="purple-background">
                <Desktop>
                    <Image
                        src={`${config.storageUrl}/landing/header-bg.svg`}
                        height={"100%"}
                        width={"100%"}
                    />
                </Desktop>
                <Tablet>
                    <Image
                        src={`${config.storageUrl}/landing/header-bg2.svg`}
                        height={"100%"}
                        width={"100%"}
                    />
                </Tablet>
            </div>
            <div className="green-planet">
                <Image
                    src={`${config.storageUrl}/landing/green-planet.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
            <div className="purple-planet">
                <Image
                    src={`${config.storageUrl}/landing/purple-planet.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
            <div className="purple-planet-small">
                <Image
                    src={`${config.storageUrl}/landing/purple-planet-small.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
        </div>
        <div className="companies">CONFÍAN EN NOSOTROS</div>
    </HeaderLandingContainer>;
};

const HeaderLandingContainer = styled.section`
  width: 100%;
  position: relative;
  background: transparent;
  height: 100vh;

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
      z-index: 999;
    }

    .title {
      font-weight: 800;
      font-size: ${sizes.font.xExtraLarge};
      line-height: 21px;
      color: ${(props) => props.theme.basic.white};
      text-align: center;
      margin-bottom: 0.5rem;
      z-index: 999;

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
      z-index: 999;

      ${mediaQuery.afterTablet} {
        font-size: 40px;
        line-height: 50px;
      }
    }

    .purple-background {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 60%;
      z-index: 1;
    }

    .presenter {
      position: absolute;
      top: 35%;
      left: 35%;
      width: 30%;
      height: auto;
      z-index: 3;

      ${mediaQuery.afterTablet} {
        top: 30%;
        left: 50%;
        width: 280px;
        transform: translateX(-50%);
      }
    }
    
    .emojis{ position: absolute;
      top: 35%;
      right: 35%;
      width: 50px;
      z-index: 3;

      ${mediaQuery.afterTablet} {
        top: 35%;
        right: 50%;
      }
      
    }

    .astronaut {
      position: absolute;
      top: 35%;
      left: 0;
      width: 35%;
      height: auto;
      z-index: 3;

      ${mediaQuery.afterTablet} {
        top: 30%;
        width: 30%;
      }
    }

    .director {
      position: absolute;
      top: 35%;
      right: 0;
      width: 35%;
      height: auto;
      z-index: 3;

      ${mediaQuery.afterTablet} {
        top: 30%;
        width: 30%;
      }
    }

    .green-planet {
      position: absolute;
      top: 30%;
      right: 10%;
      height: auto;
      z-index: 2;
      width: 60px;

      ${mediaQuery.afterTablet} {
        top: 20%;
        width: 150px;
      }
    }
    
    .purple-planet{
      position: absolute;
      top: 20%;
      left: 10%;
      height: auto;
      z-index: 2;
      width: 80px;

      ${mediaQuery.afterTablet} {
        top: 20%;
        width: 100px;
      }
    }
    
    .purple-planet-small{
      position: absolute;
      bottom: 20%;
      right: 5%;
      height: auto;
      z-index: 2;
      width: 50px;

      ${mediaQuery.afterTablet} {
        top: 20%;
        width: 70px;
      }
    }
  }
`;
