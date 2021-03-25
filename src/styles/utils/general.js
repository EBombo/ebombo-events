import styled from "styled-components";
import { Button } from "antd";

export const ButtonPrimary = styled(Button)`
  background: ${(props) => props.theme.basic.primary};
  box-shadow: none;
  width: 120px;
  height: 35px;
  text-align: center;
  font-size: 13px;
  border: none;
  color: ${(props) => props.theme.colorBlack.lighten_1};
  border-radius: 50px;
  cursor: pointer;
  font-weight: 600;

  span {
    font-weight: 500;
  }

  &:hover {
    background: ${(props) => props.theme.colorPrimary.primary};
    color: ${(props) => props.theme.colorBlack.lighten_1};
  }

  &:active {
    background: ${(props) => props.theme.basic.primary};
    color: ${(props) => props.theme.colorBlack.lighten_1};
  }

  &:disabled {
    background: ${(props) => props.theme.colorGrey.darken_3};
    color: ${(props) => props.theme.colorGrey.darken_1};
  }
`;

export const SpinLoader = styled.div`
  .spin-loader {
    .spin-version {
      height: 200px;
      font-size: 20px;
    }
  }
`;
