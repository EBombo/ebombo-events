import React from "reactn";
import { services } from "../../components/common/DataList";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { Desktop, Tablet } from "../../constants";
import { Carousel } from "../../components/common/Carousel";

export const Services = (props) => (
  <ServiceSection ref={props.refProp}>
    <div className="title">Nuestros Servicios</div>
    <Desktop>
      <div className="services-container">
        {services.map((service, index) => (
          <ServiceContainer key={`key-services-${service.title}`}>
            <div className="border-section">
              <div className="title">{service.title}</div>
              <div className="container-img">
                <img src={service.imageUrl} alt="" />
              </div>
              <div className="description">{service.text}</div>
            </div>
          </ServiceContainer>
        ))}
      </div>
    </Desktop>
    <Tablet>
      <Carousel
        components={services.map((service, index) => (
          <ServiceContainer key={`key-services-${service.title}`}>
            <div className="border-section">
              <div className="title">{service.title}</div>
              <div className="container-img">
                <img src={service.imageUrl} alt="" />
              </div>
              <div className="description">{service.text}</div>
            </div>
          </ServiceContainer>
        ))}
      />
    </Tablet>
    <div className="title">Juegos</div>
  </ServiceSection>
);

const ServiceSection = styled.section`
  padding: 1rem;
  position: relative;
  background: ${(props) => props.theme.basic.gray};

  .title {
    font-style: normal;
    font-weight: 700;
    font-size: 30px;
    line-height: 37px;
    text-align: center;
  }

  .services-container {
    display: grid;
    grid-template-columns: repeat(3, 100%);
    grid-gap: 1rem;
    overflow-x: auto;
    margin: 2rem 0;

    ::-webkit-scrollbar {
      display: none;
    }
  }

  ${mediaQuery.afterTablet} {
    .services-container {
      padding: 2rem;
      grid-template-columns: repeat(3, 1fr);
      max-width: 1200px;
      margin: 2rem auto;
    }
  }
`;

const ServiceContainer = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  border-radius: 10px;
  width: 100%;
  max-width: 340px;
  margin: auto;
  height: 360px;
  position: relative;

  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 25px;
    line-height: 31px;
    text-align: center;
    padding: 1rem 0 2rem 0;
  }

  .container-img {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 1rem 0;
    img {
      height: 88px;
      width: auto;
    }
  }

  .description {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
    text-align: center;
    padding: 1rem;
    ${mediaQuery.afterTablet} {
      font-size: 17px;
      line-height: 21px;
    }
  }
`;
