import styled from "styled-components";
import {Select as AntSelect} from "antd";
import React from "react";
import sizes from "../../../styles/constants/sizes";

export const Select = ({ variant = "primary", ...props }) => (
  <SelectContainer variant={variant}>
    {props.label && (
      <Label required={props.required} variant={variant}>
        {props.label}
      </Label>
    )}
    <StyledSelect {...props} variant={variant}>
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
    {props.error && <Error>{props.error.message}</Error>}
  </SelectContainer>
);

const SelectContainer = styled.div`
  .ant-select-open {
    border-radius: 5px;
    .ant-select-selection {
      box-shadow: 0 0 0 2px ${(props) => props.theme.basic.primary} !important;
    }
    border: 2px solid
      ${(props) =>
        props.variant === "primary"
          ? props.theme.basic.primary
          : props.variant === "secondary"
          ? props.theme.basic.blackDarken
          : ""};
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
      : ""};

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
    border-radius: 5px;
    box-shadow: none !important;
  }

  .ant-select-arrow {
    margin-right: 10px;
    color: ${(props) =>
      props.variant === "primary"
        ? props.theme.basic.primary
        : props.variant === "secondary"
        ? props.theme.basic.grayLight
        : ""};
  }

  .ant-select-selection {
    border: none !important;
    background-color: ${(props) => props.theme.basic.default} !important;
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
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;

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
