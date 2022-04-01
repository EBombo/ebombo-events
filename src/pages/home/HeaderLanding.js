import React, { useEffect } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { config } from "../../firebase";
import { ButtonAnt } from "../../components/form";
import { useRouter } from "next/router";

export const HeaderLanding = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/register");
  }, []);

  return (
    <HeaderLandingContainer>
      <div className="left-container">
        <div className="text-primary text-2xl">Al estilo ebombo</div>
        <div className="title" data-aos="fade-up" data-aos-delay="0" data-aos-anchor-placement="top-center">
          Ayudamos a tu empresa a conectar con tus trabajadores para mejorar el ambiente de trabajo
        </div>
        <div className="description" data-aos="fade-up" data-aos-delay="500" data-aos-anchor-placement="top-center">
          La forma en que tus trabajadores se reunen influye en el clima y cultura de tu empresa. Nuestra plataforma te
          permite tener experiencias en línea y eventos virtuales para promover la productividad, el compromiso y la
          diversión de tus trabajadores.
        </div>
        <ButtonAnt
          color="success"
          fontSize="20px"
          margin="15px 0 0 0"
          onClick={() => props.setIsVisibleModalEvents((prev) => !prev)}
        >
          Reservar evento
        </ButtonAnt>
      </div>
      <div className="right-container" data-aos="fade-left">
        <div className="image-container">
          <img src={`${config.storageUrl}/resources/videos-landing/video-1.gif`} width={"80%"} height={"400px"} />
        </div>
      </div>
    </HeaderLandingContainer>
  );
};

const HeaderLandingContainer = styled.section`
  width: 100%;
  height: auto;
  background: linear-gradient(270deg, #331e6d 0%, #6646b7 31.25%, #382079 100%);
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;

  ${mediaQuery.afterTablet} {
    height: 90vh;
    padding: 2rem;
    flex-direction: row;
    justify-content: center;
  }

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.03em;
    color: ${(props) => props.theme.basic.whiteLight};
    margin: 1rem 0;

    ${mediaQuery.afterTablet} {
      font-size: 3rem;
      line-height: 60px;
    }
  }

  .subtitle {
    margin: 1rem 0;
    font-size: 14px;
    font-weight: 600;
    font-family: Lato;
    font-style: normal;
    color: ${(props) => props.theme.basic.whiteLight};

    ${mediaQuery.afterTablet} {
      font-size: 22px;
      line-height: 29px;
    }
  }

  .description {
    margin: 1rem 0;
    font-size: 14px;
    font-weight: 400;
    font-family: Lato;
    line-height: 17px;
    font-style: normal;
    color: ${(props) => props.theme.basic.whiteLight};

    ${mediaQuery.afterTablet} {
      font-size: 20px;
      line-height: 22px;
    }
  }

  .right-container {
    .image-container {
      img {
        border-radius: 10px;
        margin: 2rem auto;

        ${mediaQuery.afterTablet} {
          margin: auto;
        }
      }
    }
  }

  .left-container {
    ${mediaQuery.afterTablet} {
      max-width: 600px;
    }
  }

  @keyframes loop_carousel_tablet {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 485px 0;
    }
  }

  @keyframes loop_carousel_mobile {
    from {
      background-position: 0 0;
    }
    to {
      background-position: 210% 0;
    }
  }
`;
