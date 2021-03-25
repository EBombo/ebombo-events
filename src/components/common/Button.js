import styled from "styled-components";

export const Button = styled.button`
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  background-color: ${(props) =>
    props.disabled ? "grey" : props.theme.basic.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50px;
  padding: 0.5rem 1rem;
  width: fit-content;
  color: ${(props) => props.theme.basic.white};
  margin-bottom: 1rem;
  font-weight: bold;

  :hover {
    background-color: ${(props) =>
      props.disabled ? "grey" : props.theme.basic.primary};
  }
`;
