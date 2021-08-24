import React, { forwardRef } from "reactn";
import styled from "styled-components";
import { Input } from "./Input";

export const InputSearch = forwardRef((props, ref) => (
  <InputSearchCss variant={props.variant}>
    <Input.Search {...props} />
  </InputSearchCss>
));

const InputSearchCss = styled.div`
  .ant-input-search {
    border-radius: 3px;
    background: ${(props) =>
      props.variant === "primary"
        ? props.theme.basic.blackDarken
        : props.theme.basic.whiteDarken};
    border: none;

    .ant-input-group {
      border-radius: 3px;

      input {
        width: 100%;
        height: 100%;
        border-radius: 3px;
        color: ${(props) =>
          props.variant === "primary"
            ? props.theme.basic.white
            : props.theme.basic.blackLighten};
        background: ${(props) =>
          props.variant === "primary"
            ? "transparent"
            : props.theme.basic.whiteDarken};
        padding: 8px 10px;
        border: none;
      }

      input:focus {
        outline: none;
      }

      .ant-input-group-addon {
        left: 1px !important;
        background-color: ${(props) =>
          props.variant === "primary"
            ? props.theme.basic.blackDarken
            : props.theme.basic.whiteDarken};

        button {
          border: none;
          background-color: ${(props) =>
            props.variant === "primary"
              ? props.theme.basic.blackDarken
              : props.theme.basic.whiteDarken};
        }
      }
    }
  }
`;
