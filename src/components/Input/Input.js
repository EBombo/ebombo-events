import React, { forwardRef, useEffect, useState } from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import styled from "styled-components";
import get from "lodash/get";
import sizes from "../../styles/constants/sizes";
import { mediaQuery } from "../../styles/constants";

export default forwardRef((props, ref) => {
  const [hide, setHide] = useState(false);

  const inputType = () => {
    if (props.type === "password") {
      return hide ? "password" : "text";
    }
    return props.type;
  };

  useEffect(() => {
    if (props.type === "password") setHide(true);
  }, [props.type]);

  if (props.type === "radio")
    return (
      <InputContainer {...props}>
        {props.label && <Label required={props.required}>{props.label}</Label>}
        <InputRadioWrapper>
          {props.values.map((val, idx) => (
            <label key={idx} htmlFor={idx} className="radio">
              <input
                value={val}
                ref={ref}
                id={idx}
                className="radio__input"
                {...props}
              />
              <div className="radio__radio" />
              {val}
            </label>
          ))}
        </InputRadioWrapper>
        {props.error && props.variant !== "clear" && (
          <Error>{props.error.message}</Error>
        )}
      </InputContainer>
    );

  return (
    <InputContainer
      width={props.width}
      margin={props.margin}
      variant={props.variant}
    >
      {props.label && (
        <Label required={props.required} variant={props.variant}>
          {props.label}
        </Label>
      )}
      <InputWrapper {...props} id="null">
        <span
          className="ant-input-wrapper ant-input-group"
          style={{ display: "table" }}
        >
          {props.addonBefore && (
            <span className={"ant-input-group-addon"}>{props.addonBefore}</span>
          )}
          <StyledInput
            hasError={props.error}
            {...props}
            ref={ref}
            type={inputType()}
            className={`ant-input ${get(props, "className", "")}`}
          />
        </span>
        {props.type === "password" &&
          (hide ? (
            <EyeInvisibleOutlined
              className={"addon-after"}
              onClick={() => setHide(!hide)}
            />
          ) : (
            <EyeOutlined
              className={"addon-after"}
              onClick={() => setHide(!hide)}
            />
          ))}
        {props.addonAfter && (
          <span className={"addon-after"}>{props.addonAfter}</span>
        )}
      </InputWrapper>
      {props.error && props.variant !== "clear" && (
        <Error>{props.error.message}</Error>
      )}
    </InputContainer>
  );
});

const InputContainer = styled.div`
  width: ${(props) => props.width || "100%"};
  margin: ${(props) =>
    props.margin
      ? props.margin
      : props.variant === "primary"
      ? "0 0 0.5rem 0"
      : props.variant === "secondary"
      ? "0 0 0.5rem 0"
      : props.variant === "clear"
      ? "0"
      : "0"};
`;

const InputRadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${mediaQuery.afterMobile} {
    flex-direction: row;
  }

  .radio {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    margin-right: 10px;
  }

  .radio__input {
    display: none;
  }

  .radio__radio {
    width: 16px;
    height: 16px;
    background: ${(props) => props.theme.basic.grayDarken};
    border: none;
    border-radius: 50%;
    margin-right: 10px;
    box-sizing: border-box;
    padding: 2px;
  }

  .radio__radio::after {
    content: "";
    width: 100%;
    height: 100%;
    display: block;
    background: ${(props) => props.theme.basic.primary};
    border-radius: 50%;
    transform: scale(0);
    transition: transform 0.15s;
  }

  .radio__input:checked + .radio__radio::after {
    transform: scale(1);
  }

  label {
    font-family: AdihausDIN;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 23px;
    color: ${(props) => props.theme.basic.white};
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    svg {
      color: ${(props) =>
        props.variant === "clear"
          ? props.theme.basic.black
          : props.theme.basic.white}!important;
    }
  }

  .addon-after {
    z-index: 99;
    position: absolute;
    right: 0;
    bottom: auto;
    cursor: pointer;
    margin-right: 0.5rem;
  }

  .ant-input-wrapper {
    .ant-input-group-addon {
      height: 30px;
      padding: 0 5px;
      ${(props) =>
        props.variant === "primary" &&
        `background: ${props.theme.basic.grayLighten};
        border: 1px solid ${props.theme.basic.grayLighten};
        border-right: 1px solid ${props.theme.basic.blackLighten};`}
      ${(props) =>
        props.variant === "secondary" &&
        `
        border-right: 1px solid ${props.theme.basic.blackLighten};
        background: ${props.theme.basic.grayLighten};
        `};
      ${(props) =>
        props.variant === "clear" &&
        `background: ${props.theme.basic.white};
        border: 0.1px solid ${props.theme.basic.grayLight};
        color: ${props.theme.basic.default};
        `};
    }
  }
`;

const StyledInput = styled.input`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  background: ${(props) => props.background};
  width: ${(props) => props.width || "100%"};
  border: ${(props) => (props.border ? props.border : 0)};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "3px"};

  ::placeholder {
    color: ${(props) => props.theme.basic.grayLight};
  }

  ${(props) =>
    !props.addonBefore &&
    `
    border-radius: 4px !important;
  `};

  ${(props) =>
    props.hasError &&
    `
    background-color: ${props.theme.basic.white};
    border: 0.5px solid ${props.theme.basic.danger} !important;;
  `}

  ${(props) =>
    props.variant === "primary" &&
    `
    color: ${props.theme.basic.whiteDarken};
    background: ${props.theme.basic.blackDarken};
    `}

  ${(props) =>
    props.variant === "secondary" &&
    `
    color: ${props.theme.basic.blackLighten};
    background: ${props.theme.basic.grayLighten};
    `}
  
  ${(props) =>
    props.variant === "transparent" &&
    `
    color: ${props.theme.basic.whiteDarken};
    background: transparent;
  `}

  ${(props) =>
    props.variant === "clear" &&
    `background: ${props.theme.basic.white};
        border-radius: ${props.borderRadius} !important;
        border-top: ${props.borderTop};
        border-left: ${props.borderLeft};
        border-right: ${props.borderRight};
        border-bottom: ${props.borderBottom};
        color: ${props.theme.basic.default};
  `};

  &[disabled] {
    filter: grayscale(1);
    background: ${(props) =>
      props.variant === "secondary"
        ? props.theme.basic.grayLight
        : props.theme.basic.blackLighten} !important;
    color: ${(props) =>
      props.variant === "secondary"
        ? props.theme.basic.blackLighten
        : props.theme.basic.grayLighten} !important;
    border: 0 !important;
    cursor: not-allowed;
  }

  :focus {
    box-shadow: none;
    ${(props) =>
      props.variant === "primary" &&
      `border: 2px solid ${props.theme.basic.primary}; `}

    ${(props) => props.variant === "secondary" && `none`}
  }
`;

//corregir los important en la migracion a style components

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

const Error = styled.p`
  font-size: ${sizes.font.small};
  color: ${(props) => props.theme.basic.danger};
`;
