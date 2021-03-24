import React, {forwardRef} from "reactn";
import styled from "styled-components";
import Button from "antd/lib/button";

export const ButtonAnt = forwardRef((props, ref) => <ButtonAntCss ref={ref} {...props} />);

const ButtonAntCss = styled(Button)`
  background: ${(props) =>
          props.background
                  ? props.background
                  : props.primary
                  ? props.theme.basic.primary
                  : "transparent"};
  color: ${(props) =>
          props.color
                  ? props.color
                  : props.primary
                  ? props.theme.basic.blackDarken
                  : props.danger
                          ? props.theme.basic.danger
                          : props.theme.basic.primary};
  border: ${(props) =>
          props.border
                  ? props.border
                  : `2px solid ${
                          props.primary
                                  ? props.theme.basic.primary
                                  : props.danger
                                  ? props.theme.basic.danger
                                  : props.theme.basic.primary
                  }`};
  border-radius: ${(props) =>
          props["border-radius"] ? props["border-radius"] : "5px"};
  cursor: pointer;
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  display: ${(props) => (props.display ? props.display : "block")};
  ${(props) =>
          props.justifyContent ? `justify-content: ${props.justifyContent};` : ""} ${(props) => (props.alignItems ? `align-items: ${props.alignItems};` : "")}
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "12px")};
  line-height: ${(props) => (props.lineheight ? props.lineheight : "27px")};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "bold")};
  box-shadow: ${(props) =>
          props.boxShadow ? props.boxShadow : "0 4px 4px rgba(0, 0, 0, 0.25)"};
  margin: ${(props) => (props.margin ? props.margin : "0px auto")};
  ${(props) => (props.padding ? `padding:${props.padding};` : "")}
  font-style: ${(props) => (props.fontStyle ? props.fontStyle : "normal")};

  :before {
    background: ${(props) => (props.bgColorBefore ? "-" : "none")}:;
  }

  :hover {
    background: ${(props) =>
            props.bgColorEvents
                    ? props.bgColorEvents
                    : props.theme.basic.blackDarken};
    color: ${(props) =>
            props.colorEvents ? props.colorEvents : props.theme.basic.primary};
    border: ${(props) =>
            props.border ? props.border : `1px solid ${props.theme.basic.primary}`};
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
    filter: grayscale(1);
    cursor: not-allowed;
    pointer-events: none;
    background: ${(props) => props.theme.basic.default} !important;
    color: ${(props) => props.theme.basic.blackLighten} !important;
    border: 1px solid ${(props) => props.theme.basic.blackLighten} !important;
  }
`;
