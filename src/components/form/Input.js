import React, { forwardRef, useEffect, useState } from "reactn";
import { Input as InputAnt } from "antd";
import styled from "styled-components";
import { sizes } from "../../constants";
import get from "lodash/get";
import { config } from "../../firebase";
import { Image } from "../common/Image";

export const Input = forwardRef((props, ref) => {
  return (
    <InputContainer>
      {props.type === "password" ? (
        <StyledInput.Password hasError={props.error} ref={ref} {...props} />
      ) : (
        <StyledInput hasError={props.error} ref={ref} {...props} />
      )}
      {props.error && (
        <Error>
          <Image
            src={`${config.storageUrl}/resources/error.svg`}
            height="11px"
            width="11px"
            margin="0 5px 0 0"
          />
          Falta rellenar esta información
        </Error>
      )}
    </InputContainer>
  );
});

const InputContainer = styled.div`
  width: 100%;
  margin: 0;
`;

const StyledInput = styled(InputAnt)`
  width: 100%;
  height: 36px;
  border: 1px solid ${(props) => props.theme.basic.grayLighten};
  box-sizing: border-box;
  border-radius: 4px;
  background: ${(props) => props.theme.basic.whiteLight};
  color: ${(props) => props.theme.basic.blackDarken};

  &:focus {
    outline: none;
    border: none;
  }
`;

const Error = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-size: ${sizes.font.mini};
  color: ${(props) => props.theme.basic.danger};
`;
