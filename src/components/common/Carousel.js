import React, {useRef, useState} from "react";
import {Carousel as CarouselAntd} from "antd";
import styled from "styled-components";
import {arrows} from "../../styles/utils/arrowsCarousel";

export const Carousel = (props) => {
  const slider = useRef(null);
  const [indicator, setIndicator] = useState(0);
  const lengthComponents = props.components.length;

  const next = () => {
    setIndicator(indicator + 1);
    if (indicator > lengthComponents) setIndicator(0);
    slider.current.next();
  };

  const prev = () => {
    setIndicator(indicator - 1);
    if (indicator === 0) setIndicator(lengthComponents);
    slider.current.prev();
  };

  return (
    <Container>
      <CarouselStyled ref={slider} dots={false} autoplay={false}>
        {props.components.map((component, index) => (
          <div className="content-carousel" key={index}>
            {component}
          </div>
        ))}
      </CarouselStyled>
      <ContainerArrow>
        {arrows(next, prev, props.components, indicator)}
      </ContainerArrow>
    </Container>
  );
};

const Container = styled.div`
  max-width: 100%;
  overflow: hidden;
  color: ${(props) => props.theme.basic.white};
  border-radius: 8px;
  .slider-decorator-0 {
    bottom: -20px !important;
  }
`;

const ContainerArrow = styled.div`
  width: 100%;
  height: 20px;
  position: relative;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const CarouselStyled = styled(CarouselAntd)`
  .content-carousel {
    width: auto;
    min-width: 300px;
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
