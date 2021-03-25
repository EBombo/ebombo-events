import styled from "styled-components";
import React from "react";

export const arrows = (next, prev, components = null, indicator) => {
  return (
    <>
      <ArrowLeft className="arrow-left" onClick={() => prev()} />
      {components.map((_, index) => {
        return (
          <Dot
            indicator={indicator}
            index={index}
            key={`carousel-dots-${index}`}
          />
        );
      })}
      <ArrowRight className="arrow-right" onClick={() => next()} />
    </>
  );
};

const ArrowLeft = styled.span`
  height: 10px;
  width: 10px;
  position: relative;
  //top: 95%;
  bottom: 10px;
  margin-left: 20%;
  border-width: 10px;
  border-style: solid;
  border-color: transparent ${(props) => props.theme.basic.primary} transparent
    transparent;
  cursor: pointer;
`;

const Dot = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  position: relative;
  bottom: 5px;
  margin-bottom: 10px;
  background-color: ${(props) =>
    props.index === props.indicator
      ? props.theme.basic.primary
      : props.theme.basic.grayLighten};
`;

const ArrowRight = styled.span`
  height: 10px;
  width: 10px;
  position: relative;
  //top: 95%;
  bottom: 10px;
  margin-right: 20%;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent transparent
    ${(props) => props.theme.basic.primary};
  cursor: pointer;
`;
