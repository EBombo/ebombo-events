import styled from "styled-components";
import {mediaQuery} from "../../../styles/constants";

export const InputGroup = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.gridTemplateColumns || "1fr"};
  grid-gap: ${(props) => props.gridGap || "0.25rem"};
  ${mediaQuery.afterTablet} {
    grid-template-columns: ${(props) =>
      props.gridTemplateAfterTablet || props.gridTemplateColumns};
  }
`;
