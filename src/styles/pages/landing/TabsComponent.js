import styled from "styled-components";
import {
  centerFlexBox,
  flexBoxDynamic,
  fontWeightFont,
  landingGlobal,
  mediaQuery,
} from "../../constants";

export const ContainerTabs = styled.section`
  width: 100%;

  ${mediaQuery.afterHighResolution} {
    max-width: ${landingGlobal.max_width_sections};
  }

  .items-tabs-mb {
    display: flex;
    justify-content: space-between;

    .item-tab-mb {
      text-align: center;
      width: calc(95% / 2);
      background: ${(props) => props.theme.basic.default};
      color: ${(props) => props.theme.basic.blackLighten};
      padding: 10px 0px;
      ${mediaQuery.afterMobile} {
        padding: 1rem;
        font-size: 1.1rem;
      }
      ${fontWeightFont(600)};
      font-size: 0.8rem;
      cursor: pointer;
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      ${flexBoxDynamic("center", "center")};
    }

    .item-tab-active-mb {
      text-align: center;
      width: calc(95% / 2);
      background: ${(props) => props.theme.basic.primary};
      padding: 10px 0px;
      ${fontWeightFont(600)};
      font-size: 0.8rem;
      ${mediaQuery.afterMobile} {
        padding: 1rem;
        font-size: 1.1rem;
      }
      cursor: pointer;
      color: ${(props) => props.theme.basic.blackDarken};
      border-top-left-radius: 6px;
      border-top-right-radius: 6px;
      ${flexBoxDynamic("center", "center")};
    }
  }

  .content-body-tab-mb {
    width: 100%;
    background: ${(props) => props.theme.basic.blackDarken};
    font-family: "Encode Sans", sans-serif;
    display: flex;
    justify-content: center;
    padding: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    .second-tab {
      padding: 1rem;
    }

    ${mediaQuery.afterMobile} {
      padding: 1rem 10px;
    }

    .carousel {
      width: 100%;

      ${mediaQuery.afterMobile} {
        width: 690px;
      }

      iframe {
        width: 100%;
        height: 100%;
      }
    }

    .container-tab-1 {
      ${mediaQuery.afterTablet} {
        display: flex;
        flex-direction: row;
        padding: 5rem 4rem;
      }

      display: flex;
      flex-direction: column;
      .container-tab-1-item {
        ${mediaQuery.afterTablet} {
          width: 50%;
        }
      }
      .bombo-icon {
        ${mediaQuery.afterTablet} {
          text-align: right;
        }
        text-align: center;
        img {
          height: 30px;
          width: auto;
          ${mediaQuery.afterTablet} {
            height: 70px;
            width: auto;
          }
        }
      }
      .big-text {
        .green-text {
          color: ${(props) => props.theme.basic.primary};
        }
        ${mediaQuery.afterTablet} {
          font-family: Encode Sans;
          font-style: normal;
          font-weight: 800;
          font-size: 33px;
          line-height: 41px;
          display: flex;
          align-items: center;
          text-align: left;
          color: ${(props) => props.theme.basic.white};
        }
        font-family: Encode Sans;
        font-style: normal;
        font-weight: 800;
        font-size: 16px;
        line-height: 20px;
        display: flex;
        align-items: center;
        text-align: center;
        color: ${(props) => props.theme.basic.white};
        margin: 1rem 0;
      }
      .video-youtube {
        ${mediaQuery.afterTablet} {
          width: 50%;
        }
        text-align: center;
        iframe {
          width: 98%;
          height: 360px;
          ${mediaQuery.afterTablet} {
            width: 95%;
            height: 360px;
          }
        }
      }
    }

    .container-tab-2 {
      display: grid;
      grid-template-rows: 50% 50%;
      justify-content: center;
      ${mediaQuery.afterTablet} {
        display: flex;
        flex-wrap: wrap;
        padding: 5rem 4rem;
        grid-template-columns: 50% 50%;
      }

      .item-1 {
        ${centerFlexBox()};
        .how-to-play-img {
          height: 250px;
          width: auto;
          ${mediaQuery.afterTablet} {
            height: 330px;
          }
        }
      }

      .item-2 {
        display: grid;
        grid-template-rows: auto;
        ${mediaQuery.afterTablet} {
          grid-template-rows: 20% 80%;
        }
        .content-title {
          display: none;
          ${mediaQuery.afterTablet} {
            font-family: Encode Sans;
            font-style: normal;
            font-weight: 800;
            font-size: 29px;
            line-height: 36px;
            display: flex;
            align-items: center;
            text-align: right;
            color: ${(props) => props.theme.basic.white};
            width: 666px;
            padding: 1rem 0 0 0;
          }
        }

        .images-items {
          width: auto;
          display: flex;
          justify-content: center;
          padding: 1rem 0.3rem;
          flex-direction: column;
          .images {
            display: flex;
            min-width: 280px;
            width: 280px;
            overflow-x: scroll;
            ${mediaQuery.afterTablet} {
              width: 670px;
            }
            img {
              width: auto;
              height: 300px;
              ${mediaQuery.afterTablet} {
                height: 330px;
                margin: 0px 10px;
              }
            }
          }
        }
      }
    }

    .container-tab-3 {
      width: 100%;
      height: auto;
      display: flex;
      overflow-x: scroll;
      ${mediaQuery.afterTablet} {
        justify-content: center;
      }
      .slider-slide {
        display: flex !important;
        justify-content: center;
      }
      .score-img {
        height: 500px;
        width: auto;
        ${mediaQuery.afterTablet} {
          height: 600px;
          padding-right: 1.5rem;
        }
      }
    }
    .container-tab-4 {
      ${mediaQuery.afterTablet} {
        width: 80%;
      }
    }
  }

  .content-tab-prizes-mb {
    width: 100%;
    padding: 2rem 0 2rem 0;
    display: flex;
    justify-content: center;

    .items-prizes-mb {
      border-radius: 10px;
      padding: 0rem 0 1rem 0;
      width: 80%;
      height: auto;
      font-family: "Encode Sans", sans-serif;
      display: grid;
      grid-template-rows: 80% 20%;

      .item-prize-landing-mb {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;

        .title-item-landing-mb {
          text-align: center;
          @include fontWeightFont(600);
          font-size: 1.3rem;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .define-prizes-mb {
          font-size: 1.2rem;
          text-align: justify;
          width: 100%;
          margin: auto;
          @include fontWeightFont(400);
        }
      }

      .item-image {
        display: flex;
        justify-content: center;

        img {
          padding: 1rem 0 1rem 0;
          margin-bottom: 10px;
          width: 110px;
          height: 110px;
        }
      }
    }
  }

  .container-term-and-condition-mb {
    display: flex;
    justify-content: center;
    width: 98%;

    .content-term-and-condition-mb {
      width: 100%;
      height: 500px;
      overflow: scroll;
      scroll-behavior: smooth;
    }
  }
`;
