import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";

export const HeaderLanding = (props) => (
  <HeaderLandingContainer>
    <div className="left-container">
      <div className="title" data-aos="fade-up" data-aos-delay="0" data-aos-anchor-placement="top-center">
        Cambiamos la forma de reunirte con tu equipo
      </div>
      <div className="description" data-aos="fade-up" data-aos-delay="500" data-aos-anchor-placement="top-center">
        Organiza eventos virtuales con ebombo para integrar, motivar y empoderar a los trabajadores de tu empresa. Ya
        hemos organizado más de 240 eventos virtuales y presenciales.
      </div>
      <div className="companies" data-aos="fade-right" data-aos-delay="1000">
        <Image
          src={`${config.storageUrl}/resources/companies.svg`}
          height={"55px"}
          desktopHeight={"55px"}
          margin={"1rem 0"}
          size={"contain"}
        />
      </div>
    </div>
    <div className="right-container" data-aos="fade-left">
      <Image
        src={`${config.storageUrl}/resources/header.png`}
        width={"100%"}
        height={"400px"}
        margin={"0"}
        size={"contain"}
      />
    </div>
  </HeaderLandingContainer>
);

const HeaderLandingContainer = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.secondary};
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column-reverse;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 25px;
    letter-spacing: 0.03em;
    color: ${(props) => props.theme.basic.whiteLight};
    margin: 1rem 0;
  }

  .subtitle {
    font-family: Lato;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.whiteLight};
    margin: 1rem 0;
  }

  .description {
    font-family: Lato;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: ${(props) => props.theme.basic.whiteLight};
    margin: 1rem 0;
  }

  ${mediaQuery.afterTablet} {
    flex-direction: row;
    padding: 2rem;
    justify-content: center;

    .left-container {
      max-width: 485px;
    }

    .title {
      font-size: 40px;
      line-height: 44px;
    }

    .subtitle {
      font-size: 24px;
      line-height: 29px;
    }

    .description {
      font-size: 18px;
      line-height: 22px;
    }
  }

  @keyframes loop_carousel_tablet {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 485px 0%;
    }
  }

  @keyframes loop_carousel_mobile {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 210% 0%;
    }
  }

  .companies {
    width: 100%;
    overflow: hidden;
  }

  .companies > div {
    background-repeat: repeat-x !important;
    width: 200%;
    animation: loop_carousel_mobile 42s linear infinite;

    ${mediaQuery.afterTablet} {
      animation: loop_carousel_tablet 42s linear infinite;
    }
  }
`;
