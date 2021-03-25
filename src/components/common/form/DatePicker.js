import React, {forwardRef, Fragment} from "react";
import styled from "styled-components";
import sizes from "../../../styles/constants/sizes";
import {DatePicker as AntDatePicker} from "antd";

export const DatePicker = forwardRef((props, ref) => {
  return (
    <Fragment>
      {props.label && <Label required={props.required}>{props.label}</Label>}
      <DatePickerContainer {...props}>
        <StyledDatePicker {...props} hasError={props.error} ref={ref} />
      </DatePickerContainer>
      {props.error && (
        <Error>{props.errorMessage || props.error.message}</Error>
      )}
    </Fragment>
  );
});

const DatePickerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  .ant-picker {
    width: 100%;
    background: ${(props) =>
      props.variant === "primary"
        ? props.theme.basic.blackDarken
        : props.variant === "secondary"
        ? props.theme.basic.grayLighten
        : props.theme.basic.white};

    border: 1px solid
      ${(props) =>
        props.variant === "primary"
          ? props.theme.basic.blackDarken
          : props.variant === "secondary"
          ? props.theme.basic.grayLighten
          : props.theme.basic.grayLighten};

    .ant-picker-input > input {
      color: ${(props) =>
        props.variant === "primary"
          ? props.theme.basic.white
          : props.variant === "secondary"
          ? props.theme.basic.blackLighten
          : props.theme.basic.black};
    }
    .ant-picker-input > input::placeholder {
      color: ${(props) => props.theme.basic.grayLight};
    }
  }
  .ant-picker-dropdown {
    .ant-picker-panel-container {
      filter: invert(1);
    }
  }
`;

const StyledDatePicker = styled(AntDatePicker)`
  margin-bottom: 1rem !important;
  ${(props) =>
    props.hasError &&
    `
    background-color: ${props.theme.basic.white};
    border-color: ${props.theme.basic.danger};
  `}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${sizes.font.normal};

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
