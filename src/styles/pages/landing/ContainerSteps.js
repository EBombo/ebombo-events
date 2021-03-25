import styled from "styled-components";
import { mediaQuery } from "../../constants/mediaQuery";

export const ContainerSteps = styled.section`
  color: ${(props) => props.theme.basic.white};
  background: ${(props) => props.theme.basic.blackDarken};
  padding: 5px;
  margin: 0 auto;
  margin-bottom: 25px;
  width: 95%;

  ${mediaQuery.afterTablet} {
    width: 700px;
  }
`;
