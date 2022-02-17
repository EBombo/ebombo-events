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
          Ayudamos a tu empresa a conectar con tus trabajadores
        </div>
        <div className="description" data-aos="fade-up" data-aos-delay="500" data-aos-anchor-placement="top-center">
          La forma en que tus trabajadores se reunen influye en el clima y cultura de tu empresa. Nuestra plataforma te
          permite tener experiencias en línea y eventos virtuales creados promover la productividad, el compromiso y la
          diversión de tus trabajadores
        </div>
        <div className="companies" data-aos="fade-right" data-aos-delay="1000">
          <ButtonAnt
            color="success"
            variant="contained"
            fontSize="20px"
            margin="15px 0 0 0"
            onClick={() => router.push("/register")}
          >
            Registrate
          </ButtonAnt>
        </div>
      </div>
      <div className="right-container" data-aos="fade-left">
        <div className="image-container">
          <img src={`${config.storageUrl}/resources/video-lading.gif`} width={"80%"} height={"400px"} />
        </div>
      </div>
    </HeaderLandingContainer>
  );
};

const HeaderLandingContainer = styled.section`
  width: 100%;
  height: 90vh;
  background: linear-gradient(270deg, #331e6d 0%, #6646b7 31.25%, #382079 100%);
  padding: 1rem;
  display: flex;
  align-items: center;
  flex-direction: column;

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

  ${mediaQuery.afterTablet} {
    flex-direction: row;
    padding: 2rem;
    justify-content: center;

    .left-container {
      max-width: 600px;
    }

    .title {
      font-size: 3.5rem;
      line-height: 60px;
    }

    .subtitle {
      font-size: 22px;
      line-height: 29px;
    }

    .description {
      font-size: 20px;
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
