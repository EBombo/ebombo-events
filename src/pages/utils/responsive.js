import React from "react";
import Responsive from "react-responsive";

const containerGlobal = {
  xxl: { span: 15 },
  xl: { span: 18 },
  lg: { span: 18 },
  md: { span: 18 },
  sm: { span: 24 },
  xs: { span: 24 },
};

const responsive = {
  xxl: 1600,
  xl: 1200,
  lg: 992,
  md: 769,
  sm: 567,
};

const Desktop = (props) => <Responsive {...props} minWidth={responsive.lg} />;

const Tablet = (props) => (
  <Responsive {...props} maxWidth={responsive.lg - 1} />
);

const Mobile = (props) => (
  <Responsive {...props} orientation="portrait" maxWidth={responsive.md - 1} />
);

const Default = (props) => (
  <Responsive {...props} minWidth={responsive.md - 1} />
);

export { Desktop, Tablet, Mobile, Default, containerGlobal };
