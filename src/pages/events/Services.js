import React from "reactn";
import {services} from "../../components/common/DataList";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";
import {config} from "../../firebase";
import {Image} from "../../components/common/Image";
import {Desktop} from "../../utils";

export const Services = (props) =>
    <ServiceSection id="services">
        <h2>Nuestros Servicios</h2>
        <div className="services-container">
            {services.map((service, index) => <ServiceContent
                borderColor={service.color}
                index={index}
                key={`key-services-${service.title}`}
            >
                <div className="border-section">
                    <img src={service.logoUrl}
                         alt=""/>
                    <h4>{service.title}</h4>
                    <p>{service.text}</p>
                </div>
                <img className="absolute-image"
                     src={service.imageUrl}
                     alt=""/>
            </ServiceContent>)}
        </div>
        <BackgroundLine src={`${config.storageUrl}/landing/purple-line.svg`}/>
        <div className="orange-planet">
            <Image
                src={`${config.storageUrl}/landing/orange-planet.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <div className="moon">
            <Image
                src={`${config.storageUrl}/landing/moon.svg`}
                height={"100%"}
                width={"100%"}
            />
        </div>
        <Desktop>
            <div className="flying-saucer">
                <Image
                    src={`${config.storageUrl}/landing/flying-saucer.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
            <div className="saturn">
                <Image
                    src={`${config.storageUrl}/landing/saturn.svg`}
                    height={"100%"}
                    width={"100%"}
                />
            </div>
        </Desktop>
    </ServiceSection>;

const ServiceSection = styled.section`
  padding: 2rem;
  position: relative;
  height: 450px;
  background: transparent;

  ${mediaQuery.afterTablet} {
    padding: 80px 2rem;
    margin-bottom: 150px;
    height: 550px;
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

    z-index: 9999;
  }

  .orange-planet {
    position: absolute;
    height: auto;
    z-index: 2;
    width: 50px;
    top: 10px;
    left: 0;

    ${mediaQuery.afterTablet} {
      width: 100px;
    }
  }

  .moon {
    position: absolute;
    height: auto;
    z-index: 2;
    width: 30px;
    top: 10px;
    left: 50px;

    ${mediaQuery.afterTablet} {
      width: 60px;
      left: 70px;
    }
  }

  .flying-saucer {
    position: absolute;
    height: auto;
    z-index: 2;
    width: 250px;
    left: 5%;
  }

  .saturn {
    position: absolute;
    height: auto;
    z-index: 2;
    width: 260px;
    right: 10px;
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

const BackgroundLine = styled.div`
  position: absolute;
  top: 75%;
  right: 0;
  width: 70%;
  height: 100%;
  background-image: url(${(props) => props.src});
  background-size: 150%;
  background-repeat: no-repeat;
  transform: scaleX(-1);
  z-index: 0;
  background-position: center right;

  ${mediaQuery.afterTablet} {
    top: 100px;
    right: 0;
    width: 40%;
    height: 100%;
  }
`
