import styled from "styled-components";
import { fontWeightFont, landingGlobal, mediaQuery } from "../../constants";

export const ContainerStatistics = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  background: ${(props) => props.theme.basic.primary};
  .wrapper-statistics {
    display: flex;
    justify-content: space-around;
    ${fontWeightFont(600)};
    padding: 11px;
    width: 100%;
    ${mediaQuery.afterTablet} {
      width: 70%;
      max-width: ${landingGlobal.max_width_sections};
    }
    .item {
      display: grid;
      font-size: 11px;
      grid-template-columns: 20% 30% 1fr;
      width: 200px;
      ${mediaQuery.afterTablet} {
        width: auto;
      }
      img {
        width: auto;
        height: 16px;
        ${mediaQuery.afterTablet} {
          height: 40px;
        }
      }
      .image {
        display: flex;
        justify-content: center;
        align-items: center;
        .img-players-winners {
          width: auto;
          height: 30px;
          ${mediaQuery.afterTablet} {
            height: 60px;
          }
        }
      }

      .text {
        display: flex;
        align-items: center;
        justify-content: center;
        ${mediaQuery.afterTablet} {
          font-size: 1.1rem;
          color: ${(props) => props.theme.basic.blackDarken};
          padding-left: 10px;
        }
      }
      .number {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 1rem;
        color: ${(props) => props.theme.basic.blackDarken};
        ${mediaQuery.afterTablet} {
          font-size: 2rem;
          color: ${(props) => props.theme.basic.blackDarken};
          padding-left: 10px;
        }
        .loading-number {
          font-size: 1rem;
          ${fontWeightFont(700)};
          color: ${(props) => props.theme.basic.blackDarken};
          width: 55px;
          ${mediaQuery.afterTablet} {
            font-size: 2rem;
            width: 120px;
          }
        }
      }
    }
  }
`;
