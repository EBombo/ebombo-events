import React, {forwardRef, useEffect, useState} from "react";
import Icon from "../Icon";
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import get from "lodash/get";
import sizes from "../../../styles/constants/sizes";

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
        <InputWrapper>
          <span
            className="ant-input-wrapper ant-input-group"
            style={{ display: "table" }}
          >
            {props.addonBefore && (
              <span className={"ant-input-group-addon"}>
                {props.addonBefore}
              </span>
            )}
            {props.values.map((val, idx) =>
              val === props.defaultValue ? (
                <>
                  <label key={idx}>
                    <StyledInputRadio
                      value={val}
                      ref={ref}
                      checked
                      type="radio"
                      {...props}
                    />
                    {val.toUpperCase()}
                  </label>
                  <br />
                </>
              ) : (
                <>
                  <label key={idx}>
                    <StyledInputRadio
                      name={props.name}
                      value={val}
                      ref={ref}
                      type="radio"
                      {...props}
                    />
                    {val.toUpperCase()}
                  </label>
                  <br />
                </>
              )
            )}
          </span>
        </InputWrapper>
        {props.error && <Error>{props.error.message}</Error>}
      </InputContainer>
    );

  return (
    <InputContainer marginBottom={props.marginBottom} width={props.width}>
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
        {props.type === "password" && (
          <StyledIcon
            icon={hide ? faEye : faEyeSlash}
            onClick={() => setHide(!hide)}
          />
        )}
        {props.addonAfter && <StyledIcon icon={props.addonAfter} />}
      </InputWrapper>
      {props.error && <Error>{props.error.message}</Error>}
    </InputContainer>
  );
});

const InputContainer = styled.div`
  margin-bottom: ${(props) => props.marginBottom || "1rem"} !important;
  width: ${(props) => props.width || "100%"};
  margin: ${(props) => (props.margin ? props.margin : 0)};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  input[type="radio"] {
    margin: 10px 5px;
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
    }
  }
`;

const StyledIcon = styled(Icon)`
  z-index: 99;
  position: absolute;
  right: 0;
  bottom: auto;
  color: ${(props) => props.theme.basic.primary};
`;

const StyledInputRadio = styled.input`
  &[disabled] {
    filter: grayscale(1);
    background: ${(props) => props.theme.basic.blackLighten} !important;
    color: ${(props) => props.theme.basic.grayLighten} !important;
    border: 0 !important;
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
    border: inset!important;
    border-color: ${props.theme.basic.danger} !important;
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
    

  &[disabled] {
    filter: grayscale(1);
    background: ${(props) => props.theme.basic.blackLighten} !important;
    color: ${(props) => props.theme.basic.grayLighten} !important;
    border: 0 !important;
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
