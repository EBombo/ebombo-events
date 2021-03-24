import styled from "styled-components";
import {Select as AntSelect} from "antd";
import React from "react";
import {sizes} from "../../constants";

export const Select = props => (
    <SelectContainer>
        {props.label && <Label required={props.required}>{props.label}</Label>}
        <StyledSelect {...props}>
            {
                props.optionsdom
                    ? props.optionsdom
                        .map(option =>
                            <AntSelect.Option key={option.key}
                                              value={option.code}>
                                {option.name}
                            </AntSelect.Option>)
                    : props.children
            }
        </StyledSelect>
        {props.error && <Error>{props.error.message}</Error>}
    </SelectContainer>
);

const SelectContainer = styled.div`
  * {
    cursor: pointer;
  }

  .ant-select-open {
    .ant-select-selection {
      box-shadow: 0 0 0 2px ${props => props.theme.basic.primary} !important;
    }
  }
`;

const StyledSelect = styled(AntSelect)`
  width: 100%;
  border: 1px solid ${props => props.primary
          ? props.theme.basic.primary
          : props.success
                  ? props.theme.basic.success
                  : props.default
                          ? props.theme.basic.primary
                          : props.danger
                                  ? props.theme.basic.danger
                                  : props.warning
                                          ? props.theme.basic.warning
                                          : props.theme.basic.primary} !important;
  margin-bottom: ${props => props.marginbottom || "1rem"} !important;
  color: ${props => props.theme.basic.primary};

  .ant-select-selector {
    background: transparent !important;
    border: none !important;
    font-size: 10px;
  }

  .ant-select-arrow {
    color: ${(props) => props.theme.basic.primary};

    span {
      svg {
        color: ${props => props.theme.basic.primary};
        cursor: pointer;
      }
    }
  }

  .ant-select-selection {
    border: none !important;
    background-color: ${props => props.theme.basic.default} !important;
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
  font-size: ${sizes.font.mini};

  ${props => props.required && `
    ::before {
        display: inline-block;
        margin-right: 4px;
        color: #f5222d;
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${props => props.theme.basic.danger};
`;
