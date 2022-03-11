import styled from "styled-components";
import { Select as AntSelect } from "antd";
import React from "react";
import { sizes } from "../../constants";

export const Select = ({ variant = "primary", ...props }) => {
  return (
    <SelectContainer {...props}>
      <StyledSelect {...props} variant={variant} autocompleted={"false"}>
        {props.optionsdom
          ? props.optionsdom.map((option) => (
              <AntSelect.Option key={option.key} value={option.code} className={variant}>
                {option.name}
              </AntSelect.Option>
            ))
          : props.children}
      </StyledSelect>
      {props.error && variant !== "clear" && <Error>{props.error.message}</Error>}
    </SelectContainer>
  );
};

const SelectContainer = styled.div`

  .ant-select {
    background: ${(props) => props.theme.basic.whiteLight};
    border-radius: ${(props) => props.borderRadius ?? "4px"} !important;
    border: ${(props) => props.border ?? `1px solid ${props.theme.basic.grayLighten}`};
    ${(props) => (props.hasError ? `border: 0.5px solid ${props.theme.basic.danger} !important` : "")};
  }

  .ant-select-arrow {
    margin-right: 0px;
  }
`;

const StyledSelect = styled(AntSelect)`
  width: 100%;
  height: ${(props) => (props.height ? props.height : "36px")};

  color: ${(props) => props.theme.basic.blackDarken};

  .ant-select-selection-placeholder {
    color: ${(props) => props.theme.basic.grayDark};
    margin: auto;
  }

  .ant-select-selector {
    border: none !important;
    font-size: ${sizes.font.small} !important;
    height: 100% !important;
    background: ${(props) => props.background ?? props.theme.basic.whiteLight} !important;
    border-radius: 4px !important;
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

const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
