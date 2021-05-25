import React, { forwardRef } from "react";
import styled from "styled-components";
import sizes from "../../styles/constants/sizes";

export const TextArea = forwardRef((props, ref) => {
  return (
    <InputContainer marginBottom={props.marginBottom}>
      {props.label && (
        <Label required={props.required} variant={props.variant}>
          {props.label}
        </Label>
      )}
      <InputWrapper>
        <span
          className="ant-input-wrapper ant-input-group"
          style={{ display: "table" }}
        >
          <StyledInput
            hasError={props.error}
            {...props}
            ref={ref}
            className={props.className ? props.className : "ant-input"}
          />
        </span>
      </InputWrapper>
      {props.error && <Error>{props.error.message}</Error>}
    </InputContainer>
  );
});

const InputContainer = styled.div`
  margin-bottom: ${(props) => props.marginBottom || "1rem"} !important;
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
        color: ${props.theme.basic.danger};
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.textarea`
  background: ${(props) => props.background};
  width: ${(props) => props.width};
  border: ${(props) => (props.border ? props.border : 0)};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "3px"};

  ::placeholder {
    color: ${(props) => props.theme.basic.grayLight};
  }

  ${(props) =>
    props.variant === "primary" &&
    `
    color: ${props.theme.basic.whiteDarken};
    background: ${props.theme.basic.blackDarken};
    `}

  ${(props) =>
    props.variant === "secondary" &&
    `
    color: ${props.theme.basic.grayLight};
    background: ${props.theme.basic.grayLighten};
    `}


  ${(props) =>
    !props.addonBefore &&
    `
    border-radius: 4px !important;
  `};

  ${(props) =>
    props.hasError &&
    `
    background-color: ${props.theme.basic.white};
    border: inset!important;
    border-color: ${props.theme.basic.danger};!important;
  `}

  :focus {
    box-shadow: none;
    ${(props) =>
      props.variant === "primary" &&
      `border: 2px solid ${props.theme.basic.primary}; `}

    ${(props) =>
      props.variant === "secondary" &&
      `border: 2px solid ${props.theme.basic.blackLighten}; `}
  }
`;

const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
