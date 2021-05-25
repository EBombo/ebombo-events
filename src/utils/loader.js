import React from "react";
import { Spin } from "antd";
import { config } from "../firebase";
import { Icon, Image } from "../components";

const antIcon = <Icon type="loading" className="spin-version-icon" spin />;

export const spinLoader = () => (
  <div className="spin-loader">
    <Spin indicator={antIcon} spinning={true} className="spin-version" />
  </div>
);

export const logoSpin = () => (
  <div className="logo-spin">
    <div className="item-preloader">
      <Image
        src={`${config.storageUrl}/resources/imalogo-green.svg`}
        width="100px"
      />
      <label htmlFor="cargando..." style={{ display: "flex" }}>
        <span>Cargando</span>
        <marquee
          loop
          scrolldelay="300"
          direction="right"
          style={{ width: "10px" }}
        >
          . . .
        </marquee>
      </label>
    </div>
  </div>
);
