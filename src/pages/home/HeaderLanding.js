import React, { useEffect } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { config } from "../../firebase";
import { useRouter } from "next/router";
import { useTranslation } from "../../hooks";
import { SharpButton } from "../../components/common/SharpButton";

export const HeaderLanding = (props) => {
  const router = useRouter();
  const { t } = useTranslation("landing.header");

  useEffect(() => {
    router.prefetch("/register");
    router.prefetch("/login");
  }, []);

  return (
    <HeaderLandingContainer>
      <div className="left-container">
        <div className="text-primary text-2xl">{t("ebombo-style")}</div>

        <div className="title" data-aos="fade-up" data-aos-delay="0" data-aos-anchor-placement="top-center">
          {t("title")}
        </div>

        <div className="description" data-aos="fade-up" data-aos-delay="500" data-aos-anchor-placement="top-center">
          {t("sub-title")}
        </div>

        <div className="mx-auto md:ml-0 flex items-center gap-[10px]">
          <SharpButton prefixIcon="wink" onClick={() => router.push("/login")}>
            {t("sign-in-button-label")}
          </SharpButton>
          <SharpButton prefixIcon="satisfied" color="primary" onClick={() => router.push("/contact")}>
            {t("contact-button-label")}
          </SharpButton>
        </div>
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
  }
`;
