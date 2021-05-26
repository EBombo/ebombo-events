import React, { useRef, useState } from "react";
import { Carousel as CarouselAntd } from "antd";
import styled from "styled-components";
import { Arrows } from "./arrowsCarousel";

export const Carousel = (props) => {
  const slider = useRef(null);
  const [indicator, setIndicator] = useState(0);
  const lengthComponents = props.components.length;

  const next = () => {
    if (indicator + 1 > lengthComponents - 1) {
      setIndicator(0);
    } else {
      setIndicator(indicator + 1);
    }
    slider.current.next();
  };

  const prev = () => {
    if (indicator - 1 < 0) {
      setIndicator(lengthComponents - 1);
    } else {
      setIndicator(indicator - 1);
    }
    slider.current.prev();
  };

  const goTo = (slideNumber) => {
    setIndicator(slideNumber);
    slider.current.goTo(slideNumber, true);
  };

  return (
    <Container width={props.width} height={props.height}>
      <CarouselStyled
        ref={slider}
        dots={false}
        autoplay={props.autoplay ? true : false}
      >
        {props.components.map((component, index) => (
          <div className="content-carousel" key={index}>
            {component}
          </div>
        ))}
      </CarouselStyled>
      <ContainerArrow position={props.position ? props.position : "center"}>
        <Arrows
          next={next}
          prev={prev}
          components={props.components}
          indicator={indicator}
          goTo={goTo}
        />
      </ContainerArrow>
    </Container>
  );
};

const Container = styled.div`
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  max-width: 100%;
  overflow: hidden;
  color: ${(props) => props.theme.basic.white};
  .slider-decorator-0 {
    bottom: -20px !important;
  }
`;

const ContainerArrow = styled.div`
  height: 20px;
  position: relative;
  display: flex;
  margin-top: 10px;
  justify-content: ${(props) =>
    props.position === "center"
      ? "center"
      : props.position === "right"
      ? "flex-end"
      : props.position === "left"
      ? "flex-start"
      : "center"};
`;

const CarouselStyled = styled(CarouselAntd)`
  .content-carousel {
    width: auto;
    padding: 10px 20px;
  }

  .am-carousel-wrap {
    .am-carousel-wrap-dot-active {
      span {
        background-color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
