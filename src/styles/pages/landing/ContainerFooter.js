import styled from "styled-components";
import { fontWeightFont } from "../../constants";
import { mediaQuery } from "../../constants/mediaQuery";

export const ContainerFooter = styled.section`
  padding: 2rem 0 2rem 0;
  background: ${(props) => props.theme.basic.blackDarken};
  display: grid;
  grid-template-rows: repeat(3, auto);

  .container-primary {
    display: grid;
    grid-template-columns: 50% 50%;
    ${mediaQuery.afterTablet} {
      grid-template-columns: 33.33% 33.33% 33.33%;
    }
    .content-title {
      text-align: left;
      color: ${(props) => props.theme.basic.white};
      display: flex;
      align-items: flex-start;
      flex-direction: column;

      .list-text {
        list-style: none;
        font-size: 0.7rem;
        text-align: left;
        padding-left: 1rem;
        ${fontWeightFont(600)};
        cursor: pointer;
        ${mediaQuery.afterTablet} {
          font-size: 1rem;
        }
      }
    }

    .content-icons-red-social {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;

      ul {
        list-style: none;
        display: flex;
        width: 100%;
        justify-content: space-around;
        img {
          width: auto;
          height: 20px;
          cursor: pointer;
          ${mediaQuery.afterTablet} {
            height: 30px;
          }
        }
      }
    }
  }

  .container-secundary {
    display: grid;
    grid-template-columns: 40% 60%;
    ${mediaQuery.afterTablet} {
      grid-template-columns: 50% 50%;
    }
    .container-question {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      padding-left: 1.2rem;
      cursor: pointer;
      span {
        font-size: 0.7rem;
        color: ${(props) => props.theme.basic.action};
        ${fontWeightFont(600)};
        ${mediaQuery.afterTablet} {
          font-size: 1rem;
        }
      }
    }
    .content-img-start-up {
      margin: 0.7rem 1rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      img {
        width: auto;
        height: 20px;
        ${mediaQuery.afterTablet} {
          width: auto;
          height: 30px;
        }
      }
      img:first-child {
        margin-right: 10px;
      }
    }
  }

  .container-footer-bottom {
    text-align: center;
    color: ${(props) => props.theme.basic.blackDarken};
    font-size: 0.8rem;
    ${fontWeightFont(500)};
    padding: 0.7rem 0;
  }
`;
