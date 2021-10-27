import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Desktop, mediaQuery, Tablet } from "../../constants";
import { config } from "../../firebase";
import { Anchor, ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalContainer } from "../../components/common/ModalContainer";
import dynamic from "next/dynamic";
import { spinLoaderMin } from "../../components/common/loader";
import { useAuth } from "../../hooks/useAuth";
import { darkTheme } from "../../theme";
import { useRouter } from "next/router";

const Login = dynamic(() => import("../login"), {
  loading: () => spinLoaderMin(),
});

const ForgotPassword = dynamic(() => import("../forgot-password"), {
  loading: () => spinLoaderMin(),
});

export const HeaderLanding = (props) => {

  return (
    <HeaderLandingContainer>
      <div className="header-content">
        <div className="first-content">
          <div className="title">
            Somos una empresa <span>que aprendió a romper barreras</span>
          </div>
          <Desktop>
            <div className="button-container">
              <ButtonAnt
                variant="contained"
                color="secondary"
                onClick={() => props.executeScroll("contact")}
                margi="0 0 0 10px"
              >
                Contáctanos
              </ButtonAnt>
            </div>
          </Desktop>
        </div>
        <div className="second-content">
          <Desktop>
            <Image
              src={`${config.storageUrl}/resources/b2bLanding/desktop-header.png`}
              width={"100%"}
              height={"400px"}
              margin={"0"}
              size={"contain"}
            />
          </Desktop>
          <Tablet>
            <Image
              src={`${config.storageUrl}/resources/b2bLanding/mobile-header.png`}
              width={"auto"}
              height={"250px"}
              margin={"0"}
              size={"contain"}
            />
          </Tablet>
        </div>
        <Tablet>
          <div className="button-container">
            <ButtonAnt
              variant="contained"
              color="white"
              onClick={() => props.executeScroll("contact")}
            >
              Contáctanos
            </ButtonAnt>
          </div>
        </Tablet>
      </div>
    </HeaderLandingContainer>
  );
};

const HeaderLandingContainer = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};

  li {
    list-style: none;
  }

  .header-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
    background: ${(props) => props.theme.basic.secondary};

    .first-content {
      .title {
        text-align: center;
        font-size: 28px;
        line-height: 35px;
        font-weight: normal;
        color: ${(props) => props.theme.basic.secondary};

        span {
          font-weight: bold;
        }
      }

      .button-container {
        margin: 1rem auto;
      }
    }

    .second-content {
      max-width: 100%;
      height: 280px;
    }
  }

  ${mediaQuery.afterTablet} {
    .header-content {
      flex-direction: row;
      padding: 2rem;

      .first-content {
        width: 50%;

        .title {
          font-size: 39px;
          line-height: 49px;
          color: ${(props) => props.theme.basic.white};
          text-align: left;

          span {
            font-weight: bold;
          }
        }

        .button-container {
          margin: 1rem 0;
        }
      }

      .second-content {
        width: 50%;
        height: 400px;
      }
    }
  }
`;
