import styled from "styled-components";
import {
  btnPrimaryGeneral,
  centerFlexBox,
  landingGlobal,
} from "../../constants";
import { mediaQuery } from "../../constants/mediaQuery";

export const ContainerWinners = styled.section`
  padding: 32px 16px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: url(${`https://storage.googleapis.com/fantasy-football-dev-244822.appspot.com/resources/bg-our-winners-landing.png`});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center right;
  img {
    width: 16px !important;
    height: 16px !important;
  }
  .wrapper-content {
    width: 100%;

    ${mediaQuery.afterTablet} {
      width: 100%;
      max-width: ${landingGlobal.max_width_sections};
      display: grid;
      grid-template-columns: 100%;
    }

    .item-2 {
      ${centerFlexBox()};
      flex-direction: column;
      .title-2 {
        font-size: 18px;
        line-height: 1.7rem;
        text-align: center;
        color: ${(props) => props.theme.basic.white};
        padding-bottom: 16px;
        ${mediaQuery.afterTablet} {
          font-size: 32px;
          line-height: 37px;
        }
      }
      .text {
        font-weight: 800;
        font-size: 2.5rem;
        line-height: 45px;
        text-align: center;
        color: ${(props) => props.theme.basic.primary};
        padding-bottom: 16px;
      }
      .btn-whatsapp {
        display: grid !important;
        grid-template-columns: 70% 30%;
        cursor: pointer;
        ${(props) =>
          btnPrimaryGeneral(
            "1.7rem",
            "normal",
            "0 0 .7rem 0",
            "50%",
            "auto",
            props.theme.basic.primary,
            "transparent"
          )}
        width: 90%;
        ${mediaQuery.afterTablet} {
          width: 50%;
        }
        border-radius: 13px;
        border: 2px solid ${(props) => props.theme.basic.primary} !important;
        .text {
          font-size: 1rem;
          line-height: 25px;
          text-align: left;
          padding: 10px 23px;
          font-weight: normal;
          ${mediaQuery.afterTablet} {
            font-size: 26px;
            line-height: normal;
          }
        }
        .icon {
          .img {
            height: 55px !important;
            width: auto !important;
            ${mediaQuery.afterTablet} {
              height: 70px !important;
              width: auto !important;
            }
          }
        }
      }
    }
    .item-3 {
      width: 80%;
      margin: auto;
      .row-1 {
        display: grid;
        grid-template-columns: 50% 50%;
      }
      .row-2 {
        display: grid;
        grid-template-columns: repeat(4, calc(100% / 4));
      }
      .row-1 {
        margin-bottom: 15px;
        .img {
          width: 80px !important;
          ${mediaQuery.afterTablet} {
            width: 120px !important;
          }
          height: auto !important;
          margin: auto;
        }
      }
      .row-2 {
        .img {
          width: 40px !important;
          ${mediaQuery.afterTablet} {
            width: 80px !important;
          }
          height: auto !important;
          margin: auto;
        }
      }
    }
  }
`;
