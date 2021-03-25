import React from "react";
import styled from "styled-components";
import Button from "antd/lib/button";

export const ButtonBombo = ({ type = "primary", ...props }) => {
  return <ButtonAnt type={type} {...props} />;
};

const ButtonAnt = styled(Button)`
  background: ${(props) =>
    props.background
      ? props.background
      : props.type === "primary"
      ? props.theme.basic.primary
      : props.type === "secondary"
      ? "transparent"
      : props.type === "action"
      ? props.theme.basic.action
      : ""};
  color: ${(props) =>
    props.color
      ? props.color
      : props.type === "primary"
      ? props.theme.basic.grayLight
      : props.type === "secondary"
      ? props.theme.basic.primary
      : props.type === "action"
      ? props.theme.basic.grayLight
      : props.danger
      ? props.theme.basic.danger
      : props.theme.basic.primary};
  border: ${(props) =>
    props.border
      ? props.border
      : props.type === "primary"
      ? "none"
      : props.type === "secondary"
      ? `1px solid ${props.theme.basic.primary}`
      : props.type === "action"
      ? props.theme.basic.action
      : ""};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "5px"};
  cursor: pointer;
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  display: ${(props) => (props.display ? props.display : "block")};
  ${(props) =>
    props.justifyContent ? `justify-content: ${props.justifyContent};` : ""}
  ${(props) => (props.alignItems ? `align-items: ${props.alignItems};` : "")}
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "13px")};
  line-height: ${(props) => (props.lineHeight ? props.lineHeight : "15px")};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "600")};
  box-shadow: ${(props) => (props.boxShadow ? props.boxShadow : "")};
  margin: ${(props) => (props.margin ? props.margin : "0px auto")};
  padding: ${(props) =>
    props.padding
      ? props.padding
      : props.size === "small"
      ? "10px"
      : props.size === "large"
      ? "10px 45px"
      : "10px 34px"};
  font-style: ${(props) => (props.fontStyle ? props.fontStyle : "normal")};

  text-shadow: none;

  :before {
    background: ${(props) => (props.bgColorBefore ? "-" : "none")};
  }

  :hover {
    background: ${(props) =>
      props.bgColorEvents
        ? props.bgColorEvents
        : props.type === "primary"
        ? `${props.theme.basic.primary}CC`
        : props.type === "secondary"
        ? "transparent"
        : props.type === "action"
        ? props.theme.basic.action
        : ""};
    color: ${(props) =>
      props.colorEvents
        ? props.colorEvents
        : props.type === "primary"
        ? props.theme.basic.grayLight
        : props.type === "secondary"
        ? props.theme.basic.primary
        : props.type === "action"
        ? props.theme.basic.grayLight
        : ""};
    border: ${(props) =>
      props.border
        ? props.border
        : props.type === "primary"
        ? ""
        : props.type === "secondary"
        ? `1px solid ${props.theme.basic.primary}`
        : ""};
    box-shadow: ${(props) =>
      props.boxShadow
        ? props.boxShadow
        : props.type === "primary"
        ? "0px 4px 4px rgba(0, 0, 0, 0.25)"
        : ""};

    filter: ${(props) =>
      props.type === "secondary"
        ? "drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5))"
        : ""};
  }

  :focus {
    background: ${(props) =>
      props.background ? props.background : "transparent"};
    color: ${(props) =>
      props.color ? props.color : props.theme.basic.primary};
    border: ${(props) =>
      props.border
        ? props.border
        : `1px solid ${(props) => props.theme.basic.primary}`};
    outline: none !important;
  }

  &[disabled] {
    cursor: not-allowed;
    pointer-events: none;
    background: ${(props) =>
      props.type === "primary"
        ? props.theme.basic.grayLighten
        : props.type === "secondary"
        ? "transparent "
        : ""} !important;
    color: ${(props) =>
      props.type === "primary"
        ? props.theme.basic.gray
        : props.type === "secondary"
        ? props.theme.basic.grayLighten
        : ""} !important;
    border: 1px solid
      ${(props) =>
        props.type === "secondary"
          ? props.theme.basic.grayLighten
          : ""} !important;
  }
`;
