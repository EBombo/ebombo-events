import styled from "styled-components";
import { Select as AntSelect } from "antd";
import React from "react";
import sizes from "../../styles/constants/sizes";

export const Select = ({ variant = "primary", ...props }) => {
  return (
    <SelectContainer
      variant={variant}
      borderRadius={props.borderRadius}
      borderRight={props.borderRight}
      borderLeft={props.borderLeft}
      borderTop={props.borderTop}
      borderBottom={props.borderBottom}
      hasError={props.error}
    >
      {props.label && (
        <Label required={props.required} variant={variant}>
          {props.label}
        </Label>
      )}
      <StyledSelect {...props} variant={variant} autocompleted={"false"}>
        {props.optionsdom
          ? props.optionsdom.map((option) => (
              <AntSelect.Option
                key={option.key}
                value={option.code}
                className={variant}
              >
                {option.name}
              </AntSelect.Option>
            ))
          : props.children}
      </StyledSelect>
      {props.error && variant !== "clear" && (
        <Error>{props.error.message}</Error>
      )}
    </SelectContainer>
  );
};

const SelectContainer = styled.div`
  .ant-select-open {
    border-radius: ${(props) =>
      props.borderRadius ? props.borderRadius : "5px"} !important;

    .ant-select-selection {
      box-shadow: 0 0 0 2px ${(props) => props.theme.basic.primary} !important;
    }

    ${(props) =>
      props.variant === "primary"
        ? `border: 2px solid ${props.theme.basic.primary}`
        : props.variant === "secondary"
        ? `border: 2px solid ${props.theme.basic.blackDarken}`
        : props.variant === "clear"
        ? `border: 0`
        : ""}
  }

  .ant-select {
    background: ${(props) =>
      props.variant === "clear"
        ? props.theme.basic.white
        : props.theme.basic.blackLighten} !important;
    border-radius: ${(props) =>
      props.borderRadius ? props.borderRadius : "5px"} !important;
    border-right: ${(props) =>
      props.borderRight ? props.borderRight : "0"} !important;
    border-left: ${(props) =>
      props.borderLeft ? props.borderLeft : "0"} !important;
    border-top: ${(props) =>
      props.borderTop ? props.borderTop : "0"} !important;
    border-bottom: ${(props) =>
      props.borderBottom ? props.borderBottom : "0"} !important;
    ${(props) =>
      props.hasError
        ? `border: 0.5px solid ${props.theme.basic.danger} !important`
        : ""}
  }

  .ant-select-arrow {
    margin-right: 10px;
    svg {
      color: ${(props) =>
        props.variant === "primary"
          ? props.theme.basic.primary
          : props.variant === "secondary"
          ? props.theme.basic.grayLight
          : props.variant === "clear"
          ? props.theme.basic.grayLight
          : ""} !important;
    }
  }
`;

const StyledSelect = styled(AntSelect)`
  width: 100%;
  margin-bottom: ${(props) => props.marginbottom || "1rem"} !important;

  color: ${(props) =>
    props.variant === "primary"
      ? props.theme.basic.primary
      : props.variant === "secondary"
      ? props.theme.basic.blackLighten
      : props.variant === "clear"
      ? props.theme.basic.default
      : ""} !important;

  div {
    svg {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .ant-select-selection-placeholder {
    color: ${(props) => props.theme.basic.grayDark};
  }

  .ant-select-selector {
    background: ${(props) =>
      props.variant === "primary"
        ? props.theme.basic.blackDarken
        : props.variant === "secondary"
        ? props.theme.basic.grayLighten
        : "transparent"} !important;

    border: none !important;
    font-size: ${sizes.font.large};
    box-shadow: none !important;
  }

  .ant-select-selection {
    border: none !important;
    background-color: ${(props) =>
      props.variant === "clear"
        ? props.theme.basic.white
        : props.variant === "secondary"
        ? props.theme.basic.grayLighten
        : props.theme.basic.default} !important;
    border-radius: 0;
    outline: none;
  }

  .ant-select-selection:hover {
    border-color: transparent !important;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 16px;
  font-size: 13px;

  color: ${(props) =>
    props.variant === "primary"
      ? props.theme.basic.primary
      : props.theme.basic.blackLighten};

  ${(props) =>
    props.required &&
    `
    ::before {
        display: inline-block;
        margin-right: 4px;
        color: ${(props) => props.theme.basic.danger};
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
