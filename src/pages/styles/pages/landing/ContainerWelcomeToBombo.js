import styled from "styled-components";
import {
  btnPrimaryGeneral,
  fontWeightFont,
  landingGlobal,
  mediaQuery,
} from "../../constants";

export const ContainerWelcomeToBombo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background-image: url(${(props) => props.backgroundPhone});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center right;
  position: relative;

  ${mediaQuery.afterTablet} {
    background-position: center center;
    background-image: url(${(props) => props.background});
  }

  .container-wrapper-welcome {
    width: 100%;
    height: 100%;
    padding: 0 1rem;

    ${mediaQuery.afterTablet} {
      width: 90%;
      height: 80%;
      display: flex;
    }

    ${mediaQuery.afterHighResolution} {
      max-width: ${landingGlobal.max_width_sections};
      display: flex;
    }

    .container-text-welcome {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;

      ${mediaQuery.afterTablet} {
        width: 65%;
        height: 100%;
        margin-left: 4rem;
        max-width: 400px;
      }

      .wrapper-title {
        display: flex;
        justify-content: flex-start;
        margin: 1rem 0;
        width: 100%;
        position: relative;
        color: ${(props) => props.theme.basic.white};
        text-align: left;

        .title {
          font-weight: 900;
          font-size: 3rem;
          line-height: 3.75rem;
          letter-spacing: -1.53px;
          color: ${(props) => props.theme.basic.white};
          margin-bottom: 0.5rem;
        }
      }
      .item-sub-title {
          font-size: 1.25rem;
          line-height: 1.5rem;
          letter-spacing: -0.62px;
          width: 75%;
          font-weight: 400;
          margin: 0 0 2rem;
          color: ${(props) => props.theme.basic.whiteDarken};
      }
    }
`;
