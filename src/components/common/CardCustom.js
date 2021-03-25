import React from "react";
import styled from "styled-components";

export const CardCustom = (props) => <CardCustomContainer {...props} />;

const CardCustomContainer = styled.section`
  background: ${(props) =>
    props.background ? props.background : props.theme.basic.blackDarken};
  color: ${(props) => (props.color ? props.color : props.theme.basic.white)};
  border: ${(props) =>
    props.border ? props.border : `1px solid ${props.theme.basic.primary}`};
  border-radius: ${(props) =>
    props.borderRadius ? props.borderRadius : "7px"};
  padding: ${(props) => (props.padding ? props.padding : "1rem .8rem")};
  margin: ${(props) => (props.margin ? props.margin : "1rem auto")};
  width: ${(props) => (props.width ? props.width : "100%")};
  max-width: ${(props) => (props.maxWidth ? props.maxWidth : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  position: relative;
`;
