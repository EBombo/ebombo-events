import React from "reactn";
import { services } from "../../components/common/DataList";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
import { config } from "../../firebase";

export const Services = (props) => (
  <ServiceSection id="services">
    <h2>Nuestros Servicios</h2>
    <div className="services-container">
      {services.map((service, index) => (
        <ServiceContent
          borderColor={service.color}
          index={index}
          key={`key-services-${service.title}`}
        >
          <div className="border-section">
            <img src={service.logoUrl} alt="" />
            <h4>{service.title}</h4>
            <p>{service.text}</p>
          </div>
          <img className="absolute-image" src={service.imageUrl} alt="" />
        </ServiceContent>
      ))}
    </div>
  </ServiceSection>
);

const ServiceSection = styled.section`
  padding: 1rem;
  position: relative;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/2.png"});

  ${mediaQuery.afterTablet} {
    padding: 3rem;
  }

  h2 {
    text-align: center;
    font-weight: bold;
    font-size: 24px;
    line-height: 30px;
    color: ${(props) => props.theme.basic.white};
  }

  .services-container {
    display: flex;
    overflow: auto;

    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-gap: 2rem;
    }
  }
`;

const ServiceContent = styled.div`
  margin: 2rem 0 !important;
  position: relative;
  color: ${(props) => props.theme.basic.white};
  min-width: 400px;

  .border-section {
    height: 100%;
    padding: 1rem;
    border-top: 4px solid ${(props) => props.borderColor};
    width: 90%;
    ${(props) =>
      props.index === 0
        ? `background: linear-gradient(180deg, #1B2E71 0%, #FC6C6C 100%);
           box-shadow: 0px 0px 6px rgba(153, 78, 227, 0.25);`
        : props.index === 1
        ? `background: linear-gradient(180deg, rgba(34, 133, 121, 0) 0%, #FFD00D 100%);
           filter: drop-shadow(0px 0px 4px rgba(0, 62, 97, 0.5));`
        : `background: linear-gradient(180deg, rgba(34, 133, 121, 0) 0%, #6C63FF 100%);
           filter: drop-shadow(0px 0px 6px rgba(153, 78, 227, 0.25));`}

    h4 {
      margin: 1rem 0 !important;
      text-align: left;
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.white};
    }

    p {
      width: 70%;
    }
  }

  .absolute-image {
    position: absolute;
    right: 0;
    top: 15%;
  }
`;
