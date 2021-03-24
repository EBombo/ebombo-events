import React, {forwardRef, useEffect, useState} from "reactn";
import styled from "styled-components";
import {inputAutoFill, sizes} from "../../constants";
import {EyeInvisibleOutlined, EyeOutlined} from "@ant-design/icons";
import get from "lodash/get";

export const Input = forwardRef((props, ref) => {
    const [hide, setHide] = useState(false);

    const inputType = () => {
        if (props.type === "password") return hide ? "password" : "text";

        return props.type;
    };

    useEffect(() => {
        if (props.type === "password") setHide(true);
    }, [props.type]);

    return <InputContainer marginBottom={props.marginbottom}
                           width={props.width}>
        {
            props.label
            && <Label required={props.required}
                      variant={props.variant}>
                {props.label}
            </Label>
        }
        <InputWrapper {...props}>
        <span className="ant-input-wrapper ant-input-group"
              style={{display: "table"}}>
          {
              props.addonBefore
              && <span className={"ant-input-group-addon"}>{props.addonBefore}</span>
          }
            <StyledInput
                hasError={props.error}
                {...props}
                ref={ref}
                type={inputType()}
                className={`ant-input ${get(props, "className", "")}`}
            />
            {
                props.addonAfter
                && <span className={"ant-input-group-addon"}>{props.addonAfter}</span>
            }
        </span>
            {
                props.type === "password"
                && <>
                    {
                        hide
                            ? <EyeOutlinedCss onClick={() => setHide(!hide)}/>
                            : <EyeInvisibleOutlinedCss onClick={() => setHide(!hide)}/>
                    }
                </>
            }
        </InputWrapper>
        {
            props.error
            && <Error>{props.error.message}</Error>
        }
    </InputContainer>;
});

const InputContainer = styled.div`
  margin-bottom: ${({marginBottom = "1rem"}) => marginBottom} !important;
  width: ${({width = "100%"}) => width};
  margin: ${({margin = 0}) => margin};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;

  .ant-input-wrapper {
    .ant-input-group-addon {
      height: 30px;
      ${
              ({variant = "default"}) =>
                      variant === "primary"
                      && `  background: ${props.theme.basic.primary};
                            border: 1px solid ${props.theme.basic.success};
                            border-right: 1px solid ${props.theme.basic.blackLighten};`
      }

      ${
              (variant = "default") =>
                      variant === "secondary"
                      && `  border-right: 1px solid ${props.theme.basic.blackLighten};
                            background: ${props.theme.basic.blackLighten};`
      }
    }
  }
`;

const EyeOutlinedCss = styled(EyeOutlined)`
  z-index: 99;
  position: absolute;
  right: 5px;
  bottom: auto;

  svg {
    color: ${props => props.theme.basic.primary} !important;
  }
`;

const EyeInvisibleOutlinedCss = styled(EyeInvisibleOutlined)`
  z-index: 99;
  position: absolute;
  right: 5px;
  bottom: auto;

  svg {
    color: ${props => props.theme.basic.primary} !important;
  }
`;

const StyledInput = styled.input`
  border-radius: ${({borderRadius = 0}) => borderRadius};
  background: ${({background = "transparent"}) => background};
  color: ${({color = "white"}) => color};
  border: ${(props) => props.border === "primary" ? `1px solid ${props => props.theme.basic.primary}` : "none"};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  font-size: 10px;

  ${(props) => !props.addonBefore && `border-radius: 4px !important;`};

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[disabled] {
    color: ${props => props.theme.basic.whiteDarken};
    background: ${props => props.theme.basic.blackLighten};
    cursor: not-allowed;
    opacity: 1;
  }

  ${props => props.hasError && `border:1px solid ${props => props.theme.basic.danger}!important;`}
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
    background: ${props.theme.basic.whiteDarken};
    `}
  .ant-select-selection {
    background: none !important;
    border-radius: 0;
    border: none;
    outline: none;

    :active {
      outline-color: ${props => props.theme.basic.primary};
    }

    .ant-select-selection__placeholder {
      font-size: 10px;
      color: ${props => props.theme.basic.whiteDarken};
      line-height: 24px;
    }
  }

  &[disabled] {
    filter: grayscale(1);
    background: ${(props) => props.theme.basic.blackLighten} !important;
    color: ${(props) => props.theme.basic.whiteDarken} !important;
    border: 0 !important;
  }

  ::placeholder {
    color: ${props => props.theme.basic.whiteDarken};
  }

  &:focus {
    ${({variant = "default"}) => variant === "secondary" && `none`}
    outline: 0;
    box-shadow: 0 0 3px 1px ${props => props.theme.basic.whiteDarken};
  }

  ${props => inputAutoFill("none", props.theme.basic.action, props.theme.basic.whiteDarken, props.theme.basic.blackLighten)} ${(props) => props.borderRadius && `border-radius: ${(props) => props.borderRadius};`}
`;

//corregir los important en la migracion a style components

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${sizes.font.small};

  color: ${({variant = "default"}) =>
          variant === "primary"
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
