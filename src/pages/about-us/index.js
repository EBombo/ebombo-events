import React from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { mediaQuery } from "../../constants";
import { ContactForm } from "../contact";
import { Icon } from "../../components/common/Icons";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { useTranslation } from "../../hooks";

export const AboutUs = (props) => {
  const router = useRouter();

  const { t } = useTranslation("pages.about-us");

  return (
    <AboutUsContainer>
      <div className="title-container">
        <div className="back-container">
          <Icon className="back-icon" type="left" onClick={() => router.back()} />
        </div>
        <div className="title">{t("title")}</div>
      </div>
      <div className="main-content">
        <Image
          data-aos="fade-right"
          src={`${config.storageUrl}/resources/ebombo-white.png`}
          height="auto"
          width="200px"
          desktopHeight="75px"
          desktopWidth="280px"
          margin="2rem 0 4rem 0"
        />
        <div className="flex-container">
          <div className="text" data-aos="fade-right">
            {t("description-1")}
            <br />
            <br />
            <br />
            {t("description-2")}
          </div>
          {/*
            <div className="img-container" data-aos="fade-left">
            <Image src={`${config.storageUrl}/resources/about-us.png`} height="100%" width="80%" margin="1rem auto" />
          </div>
             */}
        </div>
      </div>

      <ContactForm />
    </AboutUsContainer>
  );
};

const AboutUsContainer = styled.div`
  width: 100%;

  .title-container {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    background: ${(props) => props.theme.basic.whiteLighten};

    .title {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 28px;
      line-height: 32px;
      color: ${(props) => props.theme.basic.secondary};
    }

    .back-container {
      margin: 0 1rem 0 0;

      span {
        border-radius: 50%;
        padding: 8px;
        background: ${(props) => props.theme.basic.primary};
        cursor: pointer;
        vertical-align: bottom;
        color: ${(props) => props.theme.basic.white};
        svg {
          font-size: 18px;
        }
      }
    }
  }

  .main-content {
    padding: 1rem;
    background: ${(props) => props.theme.basic.secondary};

    ${mediaQuery.afterTablet} {
      padding: 3rem;
      height: 90vh;
    }

    .flex-container {
      display: flex;
      flex-direction: column-reverse;

      .text {
        font-family: Lato;
        font-style: normal;
        font-weight: normal;
        font-size: 18px;
        line-height: 22px;
        color: ${(props) => props.theme.basic.whiteLighten};
        text-align: justify;

        ${mediaQuery.afterTablet} {
          font-size: 24px;
          line-height: 28px;
        }
      }
    }
  }

  .contests-container {
    margin-top: 5rem;
    height: 75px;
    padding: 0.5rem 1rem;
    width: 100%;
    max-width: 880px;
    background: ${(props) => props.theme.basic.whiteLighten};
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-radius: 10px;

    .text {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.blackDarken};

      ${mediaQuery.afterTablet} {
        font-size: 24px;
        line-height: 29px;
      }
    }
  }
`;
