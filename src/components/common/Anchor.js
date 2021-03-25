import React from "react";
import styled from "styled-components";

export const Anchor = (props) => (
  <AnchorTag href={props.url} target="_blank" rel="noreferrer" {...props}>
    {props.children}
  </AnchorTag>
);

const AnchorTag = styled.a`
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : 500)};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "11px")};
  text-decoration: ${(props) => (props.underlined ? `underline` : "")};
  border: ${(props) => (props.border ? props.border : "")};
  margin: ${(props) => (props.margin ? props.margin : "")};
  padding: ${(props) => (props.padding ? props.padding : "")};
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  display: ${(props) => (props.display ? props.display : "")};
  color: ${(props) =>
    props.type === "primary"
      ? props.theme.basic.primary
      : props.type === "default"
      ? props.theme.basic.grayLight
      : props.theme.basic.white};

  :hover {
    color: ${(props) =>
      props.type === "primary"
        ? props.theme.basic.white
        : props.type === "default"
        ? props.theme.basic.white
        : props.theme.basic.primary};
    text-decoration: ${(props) => (props.underlined ? `underline` : "")};
  }

  &[disabled] {
    cursor: not-allowed;
    pointer-events: none;
    color: ${(props) => props.theme.basic.grayLighten};
  }
`;
