import styled from "styled-components";
import React from "react";

export const Arrows = (props) => {
  return (
    <ContainerArrow position={props.position ? props.position : "center"}>
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

const Dot = styled.span`
  height: 8px;
  width: 8px;
  border-radius: 50%;
  margin: 0 5px;
  background-color: ${(props) =>
    props.index === props.indicator ? props.theme.basic.primary : props.theme.basic.grayLighten};
`;
