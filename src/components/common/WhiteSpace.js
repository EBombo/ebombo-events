import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";

export const WhiteSpace = styled.div`
  width: ${(props) => (props.vertical ? "1.5rem" : "100%")};
  height: ${(props) => (props.vertical ? "100%" : "1.5rem")};
  clear: both;
  display: table;

  ${mediaQuery.afterTablet} {
    width: ${(props) => (props.vertical ? "4rem" : "100%")};
    height: ${(props) => (props.vertical ? "100%" : "3rem")};
  }
`;
