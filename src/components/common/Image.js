import React from "reactn";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";

export const Image = (props) =>
    <ImageCss {...props}>
        <img src={props.src}
             className="my-img"
             alt={props.src}/>
        {props.children && props.children}
    </ImageCss>;

const ImageCss = styled.div`
  background-image: url("${(props) => props.src}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${(props) => (props.size ? props.size : "100%")};
  height: ${(props) => (props.height ? props.height : "100%")};
  width: ${(props) => (props.width ? props.width : "100%")};
  margin: ${(props) => props.margin || "auto"};
  cursor: ${(props) => props.cursor || "normal"};
  border-radius: ${(props) => props.borderRadius || "0"};
  position: ${(props) => props.position || "-"};

  ${props => props.top ? `top:${props.top};` : ""}
  ${props => props.left ? `left:${props.left};` : ""}
  ${props => props.right ? `right:${props.right};` : ""}
  ${props => props.minHeight ? `min-height:${props.minHeight};` : ""}
  ${props => props.minWidth ? `min-width:${props.minWidth};` : ""}
  ${mediaQuery.afterMobile} {
    height: ${(props) =>
            props.desktopHeight ? props.desktopHeight : props.height};
    width: ${(props) =>
            props.desktopWidth ? props.desktopWidth : props.width};
  }

  .my-img {
    width: 100%;
    height: auto;
    visibility: hidden;
  }
`;
