import styled from "styled-components";
import {
  centerFlexBox,
  fontWeightFont,
  landingGlobal,
  mediaQuery,
} from "../../constants";

export const ContainerTestimonials = styled.section`
  padding: 30px 0;
  background: ${(props) => props.theme.basic.blackDarken};

  .title {
    font-weight: 800;
    font-size: 26px;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
    margin-bottom: 32px;
  }
  .card {
    background: linear-gradient(
      180deg,
      transparent 25%,
      rgba(31, 31, 31, 1) 25%
    );
    color: ${(props) => props.theme.basic.white};
    width: 250px;
    height: auto;
    min-height: 320px;
    margin: 10px;
    display: grid;
    grid-template-rows: 40% 10% 50%;
    justify-content: center;
    .image-user {
      ${centerFlexBox()};
      img {
        object-fit: cover;
        width: auto;
        height: 100px;
      }
    }
    .name-user {
      padding: 0.5rem;
      text-align: center;
      ${fontWeightFont(500)};
    }
    .testimonial {
      padding: 5px 10px;
      text-align: center;
      font-size: 0.7rem;
      overflow: hidden;
    }
  }
  .container-card {
    display: flex;
    max-width: ${landingGlobal.max_width_sections};
    ${mediaQuery.afterTablet} {
      width: 100%;
      justify-content: center;
      align-items: center;
    }
  }
  .scroll-cards {
    display: flex;
    overflow-x: scroll;
    width: 98%;
    ${mediaQuery.afterTablet} {
      justify-content: center;
      width: 70%;
      margin: auto;
    }
  }
`;
