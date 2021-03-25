import React from "react";
import styled from "styled-components";

export const ToolTipContent = ({ title, description }) => (
  <TooltipContainer>
    <h2>{title}</h2>
    <p className="pre-wrap">{description}</p>
  </TooltipContainer>
);

const TooltipContainer = styled.div`
  padding: 13px 10px;

  h2 {
    color: ${(props) => props.theme.basic.grayDarken};
    font-weight: bold;
    font-size: 14px;
  }

  p {
    color: ${(props) => props.theme.basic.grayDarken};
    font-size: 12px;
  }
`;
