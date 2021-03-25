import React, {useGlobal} from "reactn";
import styled from "styled-components";
import defaultTo from "lodash/defaultTo";

export const EBomboRules = (props) => {
  const [ebomboRules] = useGlobal("ebomboRules");

  return (
    <Container>
      <div
        dangerouslySetInnerHTML={{
          __html: defaultTo(ebomboRules, "Proximamente"),
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  background: ${(props) => props.theme.basic.blackLighten};
  padding: 0.5rem;
  border-radius: 5px;

  .title {
    font-weight: 600;
    font-size: 17px;
    margin-bottom: 1.5rem;
  }

  .subtitle {
    font-weight: 600;
    font-size: 15px;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }

  .description {
    margin-bottom: 1rem;
  }
`;

const ButtonRecord = styled.div`
  border: 1px solid ${(props) => props.theme.basic.primary} !important;
  border-radius: 7px;
  width: 250px;
  background: transparent;
  height: auto;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 10px;
  padding: 12px 15px;
  color: ${(props) => props.theme.basic.primary};
  margin: 1.5rem 0px;
  font-size: 15px;
  cursor: pointer;

  label {
    cursor: pointer;
  }
  .icon {
    height: 10px;
    width: 10px;
    border-width: 10px;
    border-style: solid;
    border-color: transparent transparent transparent
      ${(props) => props.theme.basic.primary};
    cursor: pointer;
  }
`;
