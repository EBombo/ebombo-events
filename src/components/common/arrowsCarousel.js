import styled from "styled-components";
import React from "react";

export const Arrows = (props) => {
  return (
    <ContainerArrow position={props.position ? props.position : "center"}>
      <ArrowLeft
        showArrows={props.showArrows}
        className="arrow-left"
        onClick={() => props.prev()}
      />
      {props.components.map((_, index) => {
        return (
          <Dot
            indicator={props.indicator}
            index={index}
            key={`carousel-dots-${index}`}
            onClick={() => props.goTo(index)}
          />
        );
      })}
      <ArrowRight
        showArrows={props.showArrows}
        className="arrow-right"
        onClick={() => props.next()}
      />
    </ContainerArrow>
  );
};

const ContainerArrow = styled.div`
  height: 20px;
  position: relative;
  display: flex;
  justify-content: ${(props) =>
    props.position === "center"
      ? "center"
      : props.position === "right"
      ? "flex-end"
      : props.position === "left"
      ? "flex-start"
      : "center"};
  align-items: center;
`;

const ArrowLeft = styled.span`
  height: 5px;
  width: 10px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent ${(props) => props.theme.basic.primary} transparent
    transparent;
  cursor: pointer;
  visibility: ${(props) => (props.showArrows ? "visible" : "hidden")};
  margin-right: 10px;
`;

const ArrowRight = styled.span`
  height: 5px;
  width: 10px;
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent transparent
    ${(props) => props.theme.basic.primary};
  cursor: pointer;
  visibility: ${(props) => (props.showArrows === true ? "visible" : "hidden")};
  margin-left: 10px;
`;

const Dot = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: ${(props) =>
    props.index === props.indicator
      ? props.theme.basic.primary
      : props.theme.basic.grayLighten};
`;
