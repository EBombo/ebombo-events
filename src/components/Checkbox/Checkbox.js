import React, { forwardRef, Fragment } from "react";
import styled from "styled-components";
import sizes from "../../styles/constants/sizes";
import { Checkbox as AntCheckbox } from "antd";

export const Checkbox = forwardRef((props, ref) => {
  return (
    <Fragment>
      {props.label && (
        <Label required={props.required} variant={props.variant}>
          {props.label}
        </Label>
      )}
      <CheckboxContainer>
        <StyledCheckboxGroup {...props} ref={ref} />
      </CheckboxContainer>
      {props.error && (
        <Error>{props.errorMessage || props.error.message}</Error>
      )}
    </Fragment>
  );
});

const CheckboxContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledCheckboxGroup = styled(AntCheckbox.Group)`
  margin-bottom: 1rem !important;
  border-radius: 2px;

  .ant-checkbox-input {
    color: red;
  }

  .ant-checkbox-checked .ant-checkbox-inner::after {
    filter: brightness(0.5);
  }
  .ant-checkbox-inner {
    background-color: transparent !important;
    border-radius: 2px;
    border: 1px solid ${(props) => props.theme.basic.primary};
    :focus {
      border: 1px solid red !important;
    }
  }

  label {
    font-weight: 500;
    font-size: 10px;
    line-height: 12px;
    color: ${(props) => props.theme.basic.white};
  }

  .ant-checkbox-checked {
    background-color: ${(props) => props.theme.basic.primary};
    border-radius: 2px;
  }

  ${(props) =>
    props.hasError &&
    `
    background-color: ${(props) => props.theme.basic.white};
    border-color: ${(props) => props.theme.basic.danger};
  `}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;

  color: ${(props) => props.theme.basic.primary};

  ${(props) =>
    props.required &&
    `
    ::before {
        display: inline-block;
        margin-right: 4px;
        color: ${props.theme.basic.danger};
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const Error = styled.p`
  margin-top: -0.5rem;
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
