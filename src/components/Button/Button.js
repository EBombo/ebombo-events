import React from "react";
import styled from "styled-components";
import sizes from "../../styles/constants/sizes";
import Button from "antd/lib/button";

export const ButtonBombo = (props) => {
  return (
    <StyledButton
      {...props}
      className={`btn ${props.className ? props.className : ""}`}
      variant={props.variant}
      color={props.color}
      disabled={props.disabled ? props.disabled : false}
      size={props.size ? props.size : "medium"}
      width={props.width ? props.width : "auto"}
    >
      <span className="children">{props.children}</span>
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
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

  ${(props) =>
    props.variant === "contained"
      ? `
      background: ${
        props.color === "primary"
          ? props.theme.basic.primary
          : props.color === "secondary"
          ? props.theme.basic.secondary
          : props.color === "action"
          ? props.theme.basic.action
          : props.color === "danger"
          ? props.theme.basic.danger
          : props.color
      };
      color: ${
        props.color === "white"
          ? props.theme.basic.secondary
          : props.theme.basic.white
      };
      border: none;
      `
      : props.variant === "outlined"
      ? `
      background: transparent;
      color: ${
        props.color === "primary"
          ? props.theme.basic.primary
          : props.color === "secondary"
          ? props.theme.basic.secondary
          : props.color === "action"
          ? props.theme.basic.action
          : props.color === "danger"
          ? props.theme.basic.danger
          : props.color
      };
      border: 1px solid ${
        props.color === "primary"
          ? props.theme.basic.primary
          : props.color === "secondary"
          ? props.theme.basic.secondary
          : props.color === "action"
          ? props.theme.basic.action
          : props.color === "danger"
          ? props.theme.basic.danger
          : props.color
      };
      `
      : `
      background: transparent;
      color: ${
        props.color === "primary"
          ? props.theme.basic.primary
          : props.color === "secondary"
          ? props.theme.basic.secondary
          : props.color === "action"
          ? props.theme.basic.action
          : props.color === "danger"
          ? props.theme.basic.danger
          : props.color
      };  
      border: none;
      `}

  .children {
    width: 100%;
    font-size: ${sizes.font.extraLarge};
    font-weight: 500;
    letter-spacing: 0.02857em;
  }

  &:hover {
    ${(props) =>
      props.variant === "contained"
        ? `
      background: ${
        props.color === "primary"
          ? `${props.theme.basic.primary}CC`
          : props.color === "secondary"
          ? `${props.theme.basic.secondary}CC`
          : props.color === "action"
          ? `${props.theme.basic.action}CC`
          : props.color === "danger"
          ? `${props.theme.basic.danger}CC`
          : `${props.color}CC`
      };
      color: ${
        props.color === "white"
          ? `${props.theme.basic.secondary}CC`
          : props.theme.basic.white
      };
      border: none;
      `
        : props.variant === "outlined"
        ? `
      background: transparent;
      color: ${
        props.color === "primary"
          ? props.theme.basic.primary
          : props.color === "secondary"
          ? `${props.theme.basic.secondary}CC`
          : props.color === "action"
          ? `${props.theme.basic.action}CC`
          : props.color === "danger"
          ? `${props.theme.basic.danger}CC`
          : `${props.color}CC`
      };
      border: 1px solid ${
        props.color === "primary"
          ? `${props.theme.basic.primary}CC`
          : props.color === "secondary"
          ? `${props.theme.basic.secondary}CC`
          : props.color === "action"
          ? `${props.theme.basic.action}CC`
          : props.color === "danger"
          ? `${props.theme.basic.danger}CC`
          : `${props.color}CC`
      };
      `
        : `
      background: transparent;
      color: ${
        props.color === "primary"
          ? `${props.theme.basic.primary}CC`
          : props.color === "secondary"
          ? `${props.theme.basic.secondary}CC`
          : props.color === "action"
          ? `${props.theme.basic.action}CC`
          : props.color === "danger"
          ? `${props.theme.basic.danger}CC`
          : `${props.color}CC`
      };  
      border: none;
      `}
  }
  
  
`;
