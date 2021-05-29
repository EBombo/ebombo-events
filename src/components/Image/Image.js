import React from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";

export const Image = (props) => (
  <ImageCss {...props}>
    <img src={props.src} alt={props.src} />
  </ImageCss>
);

const ImageCss = styled.div`
  background-image: url("${(props) => props.src}");
  background-repeat: no-repeat;
  background-position: ${(props) =>
    props.position ? props.position : "center"};
  background-size: ${(props) => (props.size ? props.size : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  width: ${(props) => (props.width ? props.width : "100%")};
  margin: ${(props) => props.margin || "auto"};
  cursor: ${(props) => props.cursor || "normal"};
  border-radius: ${(props) => props.borderRadius || "0"};

  ${mediaQuery.afterMobile} {
    height: ${(props) =>
      props.desktopHeight ? props.desktopHeight : props.height};
    width: ${(props) =>
      props.desktopWidth ? props.desktopWidth : props.width};
  }

  img {
    width: 100%;
    height: auto;
    visibility: hidden;
  }
`;
