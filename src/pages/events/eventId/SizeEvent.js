import React from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../../components/form";

const options = ["<25", "25-100", "100-500", "500+"];

export const SizeEvent = (props) => {
  return (
    <SizeEventStyled>
      <div className="text-secondary text-sm mb-3">
        Para preparar tu evento necesitamos cierta información que te pediremos a continuación.
      </div>

      <div className="text-primary text-4xl mb-6">¿Cuántes personas esperas en tu evento?</div>

      <div className="flex gap-3">
        {options.map((option) => (
          <div
            className={`w-52 text-2xl bg-white rounded-md ${
              props.size === option ? "border-primary" : "border-grayLighten"
            } border-2 py-2 px-1 cursor-pointer`}
            key={option}
            onClick={() => props.setSize(option)}
          >
            {option}
          </div>
        ))}
      </div>

      <ButtonAnt
        onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1].key)}
        color="primary"
        disabled={!props.size}
        variant="contained"
        fontSize="18px"
        size="big"
        margin="1rem 0 auto auto"
      >
        Siguiente
      </ButtonAnt>
    </SizeEventStyled>
  );
};

const SizeEventStyled = styled.div``;
