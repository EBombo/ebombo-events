import styled from "styled-components";
import { Collapse as AntCollapse } from "antd";

export const Collapse = styled(AntCollapse)`
  background: none;
  border: none;
  width: 100%;
  .ant-collapse {
    .ant-collapse-item {
      border-radius: 7px;
      border-bottom: none;
    }
  }
`;

export const CollapsePanel = styled(AntCollapse.Panel)`
  background: ${(props) => props.theme.basic.blackDarken};
  border-radius: 7px;
  margin-bottom: 10px;
  border-bottom: none !important;

  .margin-item {
    margin: 10px;
    text-align: justify;
    display: flex;
    justify-content: flex-start;

    .span-margin {
      margin-top: 2px;
      margin-right: 10px;
    }

    .index-item {
      border: 2px solid ${(props) => props.theme.basic.white};
      border-radius: 50%;
      padding: 2px 8px;
      text-align: center;
    }
  }

  .ant-collapse-header {
    border-radius: 7px;
    font-size: 17px;
    /*@include fontWeightFont(600);*/
    font-weight: 600;
    display: flex;
    justify-content: space-between;
    color: ${(props) => props.theme.basic.white} !important;
  }

  .ant-collapse-header .ant-collapse-arrow {
    color: ${(props) => props.theme.basic.primary};
    font-size: 17px;
    font-weight: 500;
    padding: 10px 0 10px 0;
  }

  .ant-collapse-content {
    background: ${(props) => props.theme.basic.default};
    color: ${(props) => props.theme.basic.white};
    border-bottom-left-radius: 7px;
    border-bottom-right-radius: 7px;
    border-top: none;
  }
`;
