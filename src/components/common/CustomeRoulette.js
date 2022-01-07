import React from "reactn";
import styled from "styled-components";
import { Wheel } from "react-custom-roulette";

const CustomeRoulette = (props) => {
  return (
    <CustomeRouletteContainer buttonColor={props.buttonColor} outerBorder={props.outerBorder}>
      <Wheel {...props} />
      <button
        className="spin"
        onClick={(e) => {
          e.preventDefault()
          const newPrizeNumber = Math.floor(Math.random() * props.data.length);
          props.setPrizeNumber(newPrizeNumber);
          props.setMustSpin(true);
        }}
      >
        GIRAR
      </button>
    </CustomeRouletteContainer>
  );
};

const CustomeRouletteContainer = styled.div`
  background: ${(props) => props.outerBorder ?? props.theme.basic.gray};
  border-radius: 50%;
  width: max-content;
  position: relative;

  div:first-child {
    margin: 0 auto;
  }

  img {
    display: none;
  }

  .spin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80px;
    height: 80px;
    z-index: 9999;
    border-radius: 50%;
    background: ${(props) => props.buttonColor ?? props.theme.basic.gray};
    font-size: 15px;
    color: ${(props) => props.theme.basic.secondary};
  }
`;

export default CustomeRoulette;
