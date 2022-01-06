import React, { forwardRef, Fragment } from "react";
import styled from "styled-components";
import { sizes } from "../../constants";
import { Checkbox as AntCheckbox } from "antd";

export const Checkbox = forwardRef((props, ref) => (
  <Fragment>
    <CheckboxContainer>
      {props.label && <Label required={props.required}>{props.label}</Label>}
      <StyledCheckboxGroup {...props} ref={ref} />
    </CheckboxContainer>
    {props.error && <Error>{props.errorMessage || props.error.message}</Error>}
  </Fragment>
));

const CheckboxContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  .ant-checkbox-wrapper {
    margin-left: 5px;
  }
`;

const StyledCheckboxGroup = styled(AntCheckbox)`
  ${(props) =>
    props.hasError &&
    `
    background-color: #fff;
    border-color: ${(props) => props.theme.basic.danger};
  `}
  color: ${({ variant = "default", theme }) =>
    variant === "primary"
      ? theme.basic.primary
      : variant === "secondary"
      ? theme.basic.secondary
      : variant === "warning"
      ? theme.basic.warning
      : variant === "danger"
      ? theme.basic.danger
      : variant === "gray"
      ? theme.basic.grayLight
      : theme.basic.default};
`;

const Label = styled.label`
  display: block;
  font-size: ${sizes.font.normal};

  ${(props) =>
    props.required &&
    `
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
  margin-top: -0.5rem;
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
