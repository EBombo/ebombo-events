import { Progress } from "antd";
import React from "react";

export const mobileProgressBar = (percent = 10) => (
  <Progress
    className="progress-registration-mobile"
    percent={percent}
    showInfo={false}
    size="small"
  />
);
