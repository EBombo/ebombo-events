import React, { useRef, useState } from "react";
import { Carousel as CarouselAntd } from "antd";
import styled from "styled-components";
import { Arrows } from "./arrowsCarousel";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { ButtonAnt } from "../form";

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
      {props.showArrows && (
        <div className="absolute top-[30%] left-[-20px]">
          <ButtonAnt padding="0.5rem" onClick={() => prev()} margin="0">
            <LeftOutlined style={{ color: "white" }} />
          </ButtonAnt>
        </div>
      )}

      <CarouselStyled
        effect="fade"
        ref={slider}
        dots={false}
        autoplay={!!props.autoplay}
        afterChange={(current) => setIndicator(current)}
        width={props.width}
        height={props.height}
      >
        {props.components.map((component, index) => (
          <div className="content-carousel" key={index}>
            {component}
          </div>
        ))}
      </CarouselStyled>

      {props.showArrows && (
        <div className="absolute top-[30%] right-[-20px]">
          <ButtonAnt padding="0.5rem" onClick={() => next()} margin="0">
            <RightOutlined style={{ color: "white" }} />
          </ButtonAnt>
        </div>
      )}
      {!props.hideIndicators && <Arrows next={next} prev={prev} indicator={indicator} goTo={goTo} {...props} />}
    </Container>
  );
};

const Container = styled.div`
  width: ${(props) => (props.width ? props.width : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  max-width: 100%;
  color: ${(props) => props.theme.basic.white};
  position: relative;
  .slider-decorator-0 {
    bottom: -20px !important;
  }
`;

const CarouselStyled = styled(CarouselAntd)`
  .content-carousel {
    width: ${(props) => (props.width ? props.width : "auto")};
    height: ${(props) => (props.height ? `calc(${props.height} - 20px)` : "100%")};
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
