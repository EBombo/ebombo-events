import React from "react";
import {Tooltip} from "antd";
import get from "lodash/get";
import styled from "styled-components";
import {darkTheme} from "../../styles/theme";
import {ToolTipContent} from "./TooltipContent";

export const RuleTooltip = (props) => (
  <Tooltip
    placement="bottomLeft"
    title={
      <ToolTipContent
        title={get(props, "rule.name", "")}
        description={get(props, "rule.description", "")}
      />
    }
    color={darkTheme.basic.gray}
  >
    <GameRule>{get(props, "rule.name", "-")}</GameRule>
  </Tooltip>
);

const GameRule = styled.div`
  color: ${(props) => props.theme.basic.white};
  border: 1px solid ${(props) => props.theme.basic.white};
  margin-right: 5px;
  padding: 0 0.5rem;
  cursor: pointer;
  font-size: 11px;
  line-height: 13px;
`;
