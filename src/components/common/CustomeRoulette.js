import React from "reactn";
import styled from "styled-components";
import { Wheel } from "react-custom-roulette";

const CustomeRoulette = (props) => {
  return (
    <CustomeRouletteContainer>
      <Wheel {...props} />
    </CustomeRouletteContainer>
  );
};

const CustomeRouletteContainer = styled.div`
  width: 100%;
`

export default CustomeRoulette;
