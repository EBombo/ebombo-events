import styled from "styled-components";
import React from "react";

export const Arrows = ({
  next,
  prev,
  components = null,
  indicator,
  goTo,
  showArrows = false,
}) => {
  return (
    <>
      <ArrowLeft
        showArrows={showArrows}
        className="arrow-left"
        onClick={() => prev()}
      />
      {components.map((_, index) => {
        return (
          <Dot
            indicator={indicator}
            index={index}
            key={`carousel-dots-${index}`}
            onClick={() => goTo(index)}
          />
        );
      })}
      <ArrowRight
        showArrows={showArrows}
        className="arrow-right"
        onClick={() => next()}
      />
    </>
  );
};

const ArrowLeft = styled.span`
  height: 5px;
  width: 10px;
  position: relative;
  bottom: 10px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent ${(props) => props.theme.basic.primary} transparent
    transparent;
  cursor: pointer;
  visibility: ${(props) => (props.showArrows ? "visible" : "hidden")};
`;

const Dot = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  position: relative;
  bottom: 5px;
  margin: 0 5px;
  background-color: ${(props) =>
    props.index === props.indicator
      ? props.theme.basic.primary
      : props.theme.basic.grayLighten};
`;

const ArrowRight = styled.span`
  height: 5px;
  width: 10px;
  position: relative;
  bottom: 10px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent transparent
    ${(props) => props.theme.basic.primary};
  cursor: pointer;
  visibility: ${(props) => (props.showArrows ? "visible" : "hidden")};
`;
