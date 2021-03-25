import React, {forwardRef, Fragment} from "react";
import styled from "styled-components";
import sizes from "../../../styles/constants/sizes";
import {TimePicker as AntTimePicker} from "antd";

export const TimePicker = forwardRef((props, ref) => {
  return (
    <Fragment>
      {props.label && <Label required={props.required}>{props.label}</Label>}
      <TimePickerContainer>
        <StyledTimePicker {...props} hasError={props.error} ref={ref} />
      </TimePickerContainer>
      {props.error && (
        <Error>{props.errorMessage || props.error.message}</Error>
      )}
    </Fragment>
  );
});

const TimePickerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledTimePicker = styled(AntTimePicker)`
  margin-bottom: 1rem !important;
  ${(props) =>
    props.hasError &&
    `
    background-color: #fff;
    border-color: ${(props) => props.theme.basic.danger};
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
        color: ${(props) => props.theme.basic.danger};
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
