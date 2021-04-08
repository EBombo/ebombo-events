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
                        <a onClick={() => props.executeScroll("services")}>Servicios</a>
                    </li>
                    <li>
                        <a onClick={() => props.executeScroll("games")}>Juegos</a>
                    </li>
                    <li>
                        <a onClick={() => props.executeScroll("events")}>Eventos</a>
                    </li>
                    <li>
                        <a onClick={() => props.executeScroll("contact")}>Contacto</a>
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
            <Desktop>
                <BackgroundImage src={`${config.storageUrl}/landing/header-bg.svg`} widthSize={"90%"}/>
                <BackgroundImage src={`${config.storageUrl}/landing/header-bg.svg`} widthSize={"70%"}/>
                <BackgroundImage src={`${config.storageUrl}/landing/header-bg.svg`} widthSize={"50%"}/>
            </Desktop>
            <Tablet>
                <BackgroundImage src={`${config.storageUrl}/landing/header-bg.svg`} widthSize={"95%"}/>
                <BackgroundImage src={`${config.storageUrl}/landing/header-bg.svg`} widthSize={"60%"}/>
                <BackgroundImage src={`${config.storageUrl}/landing/header-bg.svg`} widthSize={"30%"}/>
            </Tablet>
            <BackgroundLines src={`${config.storageUrl}/landing/header-thick-lines.svg`}/>
            <YellowKite src={`${config.storageUrl}/landing/yellow-kite.svg`}/>
            <YellowKite2 src={`${config.storageUrl}/landing/yellow-kite.svg`}/>
            <WhiteKite src={`${config.storageUrl}/landing/white-kite.svg`}/>
            <div className="presenter">
                <Image
                    src={`${config.storageUrl}/landing/presenter.svg`}
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
            <div className="kites">
                <Image
                    src={`${config.storageUrl}/landing/kites.svg`}
                    height={"100%"}
                    width={"100%"}
                />
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
            <div className="blue-planets">
                <Image
                    src={`${config.storageUrl}/landing/blue-planets.svg`}
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
    position: relative;
    z-index: 999;

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

    .kites {
      position: absolute;
      top: 60%;
      left: 20%;
      height: auto;
      z-index: 2;
      width: 100px;

      ${mediaQuery.afterTablet} {
        top: 70%;
        left: 30%;
        width: 200px;
      }
    }

    .green-planet {
      position: absolute;
      top: 25%;
      right: 15%;
      height: auto;
      z-index: 2;
      width: 20%;

      ${mediaQuery.afterTablet} {
        width: 15%;
        top: 15%;
      }
    }

    .purple-planet {
      position: absolute;
      top: 20%;
      left: 10%;
      height: auto;
      z-index: 2;
      width: 12%;
    }

    .purple-planet-small {
      position: absolute;
      top: 35%;
      right: 2.5%;
      height: auto;
      z-index: 2;
      width: 10%;

      ${mediaQuery.afterTablet} {
        top: 25%;
        width: 5%;
      }
    }

    .blue-planets {
      position: absolute;
      bottom: 5%;
      right: 0;
      height: auto;
      z-index: 2;
      width: 40%;

      ${mediaQuery.afterTablet} {
        width: 20%;
      }
    }
  }
`;

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: ${props => props.widthSize};
  height: 100vh;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center left;
  z-index: 1;

  ${mediaQuery.afterTablet} {
    background-position: center left;
  }
`

const BackgroundLines = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background-image: url(${(props) => props.src});
  background-size: 150%;
  background-repeat: no-repeat;
  background-position: 76% 0%;
  z-index: 1;

  ${mediaQuery.afterTablet} {
    background-size: 120%;
    background-position: 152% 0%;
    height: 70%;
  }
`

const YellowKite = styled.div`
  position: absolute;
  top: 28%;
  right: 20%;
  width: 85px;
  height: 15px;
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 3;

  ${mediaQuery.afterTablet} {
    top: 37%;
    right: 15%;
    width: 100px;
    height: 30px;
  }
`
const YellowKite2 = styled.div`
  position: absolute;
  top: 37%;
  right: 10%;
  width: 85px;
  height: 15px;
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 3;

  ${mediaQuery.afterTablet} {
    top: 41%;
    right: 12%;
    width: 100px;
    height: 25px;
  }
`

const WhiteKite = styled.div`
  position: absolute;
  top: 30%;
  left: 20%;
  width: 100px;
  height: 25px;
  background-image: url(${(props) => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 3;

  ${mediaQuery.afterTablet} {
    top: 25%;
    right: 25%;
    width: 150px;
    height: 35px;
    left: auto;
  }
`