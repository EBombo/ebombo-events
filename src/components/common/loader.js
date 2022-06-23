import React from "react";
import styled from "styled-components";
import { LoadingOutlined } from "@ant-design/icons";
import { mediaQuery } from "../../constants";
import { config } from "../../firebase";
import { darkTheme } from "../../theme";
import { Spin } from "antd";
import { Overlay } from "./Overlay";
import { Image } from "./Image";

const CustomLoaderIcon = (props) => <LoadingOutlined className="spin-version-icon" style={{color: props.color}} />;

export const spinLoader = (props) => (
  <SpinLoader>
    <Spin indicator={<CustomLoaderIcon {...props} />} spinning={true} className="spin-version" />
  </SpinLoader>
);

export const spinLoaderMin = (props = { color: darkTheme.basic.primary }) => (
  <SpinLoaderMin>
    <Spin indicator={<CustomLoaderIcon {...props} />} spinning={true} className="spin-version" />
  </SpinLoaderMin>
);

export const PageLoader = () => (
  <Overlay>
    <Image src={`${config.storageUrl}/resources/ebombo-loader.gif`} width="120px" />
  </Overlay>
);

export const LogoSpin = () => (
  <SpinLoaderLogo>
    <div className="logo-spin">
      <div className="item-preloader">
        <img src={`${config.storageUrl}/resources/${window.location.hostname}.png`} alt="Preloader bombo" />
        <label htmlFor="cargando..." style={{ display: "flex" }}>
          <span>Cargando</span>
          <marquee loop scrolldelay="300" direction="right" style={{ width: "10px" }}>
            . . .
          </marquee>
        </label>
      </div>
    </div>
  </SpinLoaderLogo>
);

const SpinLoaderLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
  background: transparent;

  .logo-spin {
    position: relative;
    display: inline-block;

    .item-preloader {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: ${(props) => props.theme.basic.white};

      label {
        margin-top: 5px;
      }

      img {
        width: 150px;

        ${mediaQuery.afterTablet} {
          width: 250px;
        }
      }
    }
  }
`;

const SpinLoader = styled.div`
  .spin-version {
    color: ${(props) => props.theme.primary};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    flex-direction: column;
  }

  .spin-version-icon {
    font-size: 50px;
    margin-bottom: 25px;
    width: 110px;
  }

  .avatar-uploader {
    > .ant-upload {
      margin: auto;
      width: 77%;
      border-radius: 60%;
    }
  }
`;

export const SpinLoaderMin = styled(SpinLoader)`
  .spin-version {
    height: 200px !important;
  }
`;
