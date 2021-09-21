import React from "reactn";
import styled from "styled-components";

export const Divider = (props) => (
  <DividerCss className="subtitle-between-lines-desktop">
    <hr />
    <span>{props.children}</span>
  </DividerCss>
);

const DividerCss = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
  position: relative;
  height: 25px;

  hr {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    z-index: 1;
    background-color: ${(props) => props.theme.basic.grayLighten};
    border: none;
    width: 100%;
    height: 1px;
  }

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 3;
    color: ${(props) => props.theme.basic.blackDarken};
    font-size: 11px;
    font-weight: 900;
    padding: 0 10px 0 10px;
    background: ${(props) =>
      props.background ? props.background : props.theme.basic.gray};
  }
`;
