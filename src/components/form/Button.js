import React, { forwardRef } from "reactn";
import styled from "styled-components";
import Button from "antd/lib/button";

export const ButtonAnt = forwardRef((props, ref) => (
  <ButtonAntCss
    ref={ref}
    size={props.size ? props.size : "medium"}
    width={props.width ? props.width : "auto"}
    {...props}
  />
));

const ButtonAntCss = styled(Button)`
  padding: ${(props) =>
    props.size === "small"
      ? "10px"
      : props.size === "medium"
      ? "6px 20px"
      : props.size === "big"
      ? "10px 30px"
      : ""};
  margin: 0;
  border-radius: 4px;
  cursor: pointer;
  width: ${(props) => props.width};

  ${({ variant = "contained", theme, color = "primary" }) =>
    variant === "contained"
      ? `
      background: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color
      };
      color: ${color === "white" ? theme.basic.secondary : theme.basic.white};
      border: none;
      `
      : variant === "outlined"
      ? `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color
      };
      border: 1px solid ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color
      };
      `
      : `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? theme.basic.secondary
          : color === "warning"
          ? theme.basic.warning
          : color === "danger"
          ? theme.basic.danger
          : color
      };  
      border: none;
      `}

  .children {
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.02857em;
  }

  &:hover {
    ${({ variant = "contained", theme = darkTheme, color = "primary" }) =>
      variant === "contained"
        ? `
      background: ${
        color === "primary"
          ? `${theme.basic.primary}CC`
          : color === "secondary"
          ? `${theme.basic.secondary}CC`
          : color === "warning"
          ? `${theme.basic.warning}CC`
          : color === "danger"
          ? `${theme.basic.danger}CC`
          : `${color}CC`
      };
      color: ${
        color === "white" ? `${theme.basic.secondary}CC` : theme.basic.white
      };
      border: none;
      `
        : variant === "outlined"
        ? `
      background: transparent;
      color: ${
        color === "primary"
          ? theme.basic.primary
          : color === "secondary"
          ? `${theme.basic.secondary}CC`
          : color === "warning"
          ? `${theme.basic.warning}CC`
          : color === "danger"
          ? `${theme.basic.danger}CC`
          : `${color}CC`
      };
      border: 1px solid ${
        color === "primary"
          ? `${theme.basic.primary}CC`
          : color === "secondary"
          ? `${theme.basic.secondary}CC`
          : color === "warning"
          ? `${theme.basic.warning}CC`
          : color === "danger"
          ? `${theme.basic.danger}CC`
          : `${color}CC`
      };
      `
        : `
      background: transparent;
      color: ${
        color === "primary"
          ? `${theme.basic.primary}CC`
          : color === "secondary"
          ? `${theme.basic.secondary}CC`
          : color === "warning"
          ? `${theme.basic.warning}CC`
          : color === "danger"
          ? `${theme.basic.danger}CC`
          : `${color}CC`
      };  
      border: none;
      `}
  }
`;
