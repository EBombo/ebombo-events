import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  position: relative;
  padding: ${(props) => props.padding || "1rem"};
  flex-direction: ${(props) => props.flexDirection || "row"};
  justify-content: ${(props) => props.justifyContent || "initial"};
  align-items: ${(props) => props.alignItems || "initial"};
`;
