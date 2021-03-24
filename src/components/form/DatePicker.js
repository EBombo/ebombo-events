import React, {forwardRef, Fragment} from "react";
import styled from "styled-components";
import {sizes} from "../../constants/sizes";
import {DatePicker as AntDatePicker} from "antd";
import {useI18n} from "../../utils";

export const DatePicker = forwardRef((props, ref) => {
    const i18n = useI18n();

    return (
        <Fragment>
            {
                props.label &&
                <Label required={props.required}>{props.label}</Label>
            }
            <DatePickerContainer>
                <StyledDatePicker {...props}
                                  placeholder={i18n(["general", "selectDate"])}
                                  hasError={props.error}
                                  ref={ref}
                />
            </DatePickerContainer>
            {
                props.error &&
                <Error>{props.errorMessage || props.error.message}</Error>
            }
        </Fragment>
    )
});

const DatePickerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledDatePicker = styled(AntDatePicker)`
  margin-bottom: 1rem !important;
  ${props => props.hasError && `
    background-color: #fff;
    border-color: ${props => props.theme.basic.danger};
  `}
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
  margin-top: -0.5rem;
  font-size: ${sizes.font.small};
  color: ${props => props.theme.basic.danger};
`;
