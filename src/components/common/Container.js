import styled from "styled-components";
import get from "lodash/get";
import {mediaQuery} from "../../styles/constants/mediaQuery";

export const Container = styled.section`
  position: relative;
  width: 100%;
  padding: ${(props) => getCSSMobile(padding, props.type)};

  ${mediaQuery.afterTablet} {
    padding: ${(props) => getCSS(padding, props.type)};
  }
`;

const getCSS = (css, type) => {
  const type_ = get(type, "desktop", "default");

  return get(css, type_);
};

const getCSSMobile = (css, type) => {
  const type_ = get(type, "mobile", "fluid");

  return get(css, type_);
};

const padding = {
  total: "1rem 0",
  fluid: "2rem 1rem",
  default: "3.5rem 2.5rem",
};
