import styled from "styled-components";
import {
  btnPrimaryGeneral,
  centerFlexBox,
  fontWeightFont,
  landingGlobal,
} from "../../constants";
import { mediaQuery } from "../../constants";

export const ContainerLeagues = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  background: ${(props) => props.theme.basic.blackDarken};
  padding: 1rem 0;
  .wrapper-leagues {
    width: 100%;
    max-width: ${landingGlobal.max_width_sections};
    display: flex;
    justify-content: center;
    .container-leagues {
      width: 100%;
      .item-title-leagues {
        text-align: center;
        font-size: 1.7rem;
        color: ${(props) => props.theme.basic.white};
        ${fontWeightFont(600)};
        padding: 1.5rem 0 1rem 0;
      }
      .items-leagues-content {
        display: flex;
        justify-content: center;
        padding: 1rem 0;
        margin: auto;
        width: 100%;
        overflow: hidden;

        .content-scroll {
          width: 1150px;
          overflow-x: scroll;
          display: flex;

          .card-container {
            width: 500px;
            height: 400px;
            display: grid;
            grid-template-rows: 19% 33% 10% 6% 16% 16%;
            margin: 0.5rem 0.5rem;
            ${mediaQuery.afterTablet} {
              width: 400px;
              height: 540px;
            }
            .item-title-card {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              img {
                width: auto;
                height: 30px;
              }
              span {
                font-size: 1rem;
                ${fontWeightFont(600)};
                color: ${(props) => props.theme.basic.primary};
              }
            }
            .item-content-time {
              background: ${(props) => props.theme.basic.blackDarken};
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 0 2.5rem;
              position: relative;
              .bg-league {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 10;
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
              .title-date-league {
                text-align: center;
                font-size: 1rem;
                color: ${(props) => props.theme.basic.white};
                z-index: 50;
                ${fontWeightFont(600)};
                padding: 0.8rem 0;
                ${mediaQuery.afterTablet} {
                  font-size: 1.1rem;
                }
              }
              .content-items-times {
                display: flex;
                justify-content: center;
                z-index: 50;
                .title-date-league {
                }
                .item-time-date {
                  display: flex;
                  justify-content: center;
                  width: 80%;
                  .item-date {
                    color: ${(props) => props.theme.basic.white};
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    div {
                      width: 40px;
                      height: 50px;
                      font-size: 1.1rem;
                      margin: 0 10px;
                      background: rgba(0, 0, 0, 0.2);
                      ${fontWeightFont(700)};
                      ${centerFlexBox()};
                      ${mediaQuery.afterTablet} {
                        width: 45px;
                        height: 55px;
                        font-size: 1.4rem;
                      }
                    }
                    span {
                      font-size: 0.7rem;
                      ${fontWeightFont(600)};
                      text-align: center;
                      ${mediaQuery.afterTablet} {
                        font-size: 0.8rem;
                      }
                    }
                  }
                }
              }
            }
            .item-total-money {
              background: ${(props) => props.theme.basic.blackDarken};
              display: flex;
              align-items: flex-end;
              .total-money {
                width: 100%;
                height: 85%;
                background: ${(props) => props.theme.basic.primary};
                color: ${(props) => props.theme.basic.blackDarken};
                font-size: 1rem;
                ${fontWeightFont(600)};
                ${centerFlexBox()};
                ${mediaQuery.afterTablet} {
                  font-size: 1.2rem;
                }
              }
            }
            .item-info-league {
              background: ${(props) => props.theme.basic.blackDarken};
              color: ${(props) => props.theme.basic.primary};
              display: flex;
              .prize-1ro {
                width: 50%;
                font-size: 0.7rem;
                ${fontWeightFont(600)};
                ${centerFlexBox()};
                ${mediaQuery.afterTablet} {
                  font-size: 1rem;
                }
              }
              .total-winners {
                width: 50%;
                font-size: 0.7rem;
                ${fontWeightFont(600)};
                ${centerFlexBox()};
                ${mediaQuery.afterTablet} {
                  font-size: 1.1rem;
                }
              }
            }
            .item-request-league {
              background: ${(props) => props.theme.basic.blackDarken};
              display: flex;
              .cost-for-team {
                width: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                ${fontWeightFont(600)};
                color: ${(props) => props.theme.basic.white};
                text-align: center;
                ${mediaQuery.afterTablet} {
                  font-size: 1rem;
                }
              }
              .participating-teams {
                width: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                ${fontWeightFont(600)};
                color: ${(props) => props.theme.basic.white};
                text-align: center;
                ${mediaQuery.afterTablet} {
                  font-size: 1rem;
                }
              }
            }
            .item-button-enter {
              background: ${(props) => props.theme.basic.blackDarken};
              ${centerFlexBox()};
              .button-enter {
                cursor: pointer;
                ${(props) =>
                  btnPrimaryGeneral(
                    "1rem",
                    "600",
                    "0 0 .7rem 0",
                    "50%",
                    "38px",
                    props.theme.basic.action,
                    "transparent"
                  )};
                border-radius: 10px;
                border: 2px solid ${(props) =>
                  props.theme.basic.action}; !important;
                ${fontWeightFont(600)};
                ${mediaQuery.afterTablet} {
                  ${(props) =>
                    btnPrimaryGeneral(
                      "1.1rem",
                      "600",
                      "0 0 .7rem 0",
                      "50%",
                      "38px",
                      props.theme.basic.action,
                      "transparent"
                    )};
                }
              }
            }
          }
          .message-warning {
            color: ${(props) => props.theme.basic.white};
            font-size: 1rem;
            ${fontWeightFont(500)};
            text-align: center;
            width: 100%;
            padding: 1rem 0;
          }
        }
      }
    }
  }
  .title-list-winners {
    width: 100%;
    font-weight: 700;
    font-size: 1.1rem;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
    padding: 0 0.3rem;
    ${mediaQuery.afterTablet} {
      padding: 0.7rem 0.5rem;
    }
    span {
      color: ${(props) => props.theme.basic.primary};
    }
  }
`;
