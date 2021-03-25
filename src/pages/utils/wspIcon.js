import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../styles/constants";
import { config } from "../firebase";
import { darkTheme } from "../styles/theme";

const wspImg = (
  <img
    src={`${config.storageUrl}/resources/wsp-icon.svg`}
    className="img-wsp"
    alt="whatsapp bombo"
  />
);

export const whatsAppIcon = () => (
  <ContainerButtonWsp backgroundColor={darkTheme.basic.blackDarken}>
    <a
      href={config.wspUrl}
      rel="noopener noreferrer"
      target="_blank"
      className="link-icon"
    >
      {wspImg}
    </a>
  </ContainerButtonWsp>
);

const ContainerButtonWsp = styled.section`
  position: fixed;
  z-index: 9999;
  height: 40px;
  width: 40px;
  border-radius: 10px 0 0 10px;
  padding: 25px 25px;
  bottom: 85px;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.backgroundColor};
  ${mediaQuery.afterTablet} {
    bottom: 5%;
  }

  .link-icon {
    cursor: pointer;

    .img-wsp {
      width: 30px;
      z-index: 99999;
    }
  }
`;
