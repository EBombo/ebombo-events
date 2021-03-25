import React from "react";
import {Collapse} from "antd";
import {defaultTo, get} from "lodash";
import styled from "styled-components";
import {Anchor} from "../common/Anchor";

export const BurgerMenuAccordion = (props) => {
  const Panel = Collapse.Panel;

  return (
    <Container>
      <Collapse
        bordered={false}
        defaultActiveKey={[]}
        expandIconPosition={"right"}
      >
        {defaultTo(props.howItWorks, []).map((item, index) => (
          <Panel
            header={
              <Anchor type="default" textAlign="left" fontSize="14px">
                {item.title}
              </Anchor>
            }
            key={index}
            className="pre-wrap"
          >
            {get(item, "content", []).map((item_, idx) => (
              <div key={`item-content-${idx}`}>
                <h2 className="subtitle">{item_.subtitle}</h2>
                <p className="description pre-wrap">{item_.description}</p>
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>
    </Container>
  );
};

const Container = styled.div`
  margin: 1.5rem 0;

  .subtitle {
    font-weight: bold;
    font-size: 12px;
    line-height: 11px;
    color: ${(props) => props.theme.basic.white};
  }

  .description {
    font-size: 12px;
    color: ${(props) => props.theme.basic.white};
  }

  .ant-collapse-borderless {
    background-color: inherit;
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header
    .ant-collapse-arrow {
    margin: 0;
    padding: 0;
    color: ${(props) => props.theme.colorGrey.grey};
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item-active
    > .ant-collapse-header
    .ant-collapse-arrow {
    margin: 0;
    padding: 0;
    color: ${(props) => props.theme.basic.action};
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header {
    margin: 0 1.5rem;
    padding: 0;
    color: ${(props) => props.theme.colorGrey.grey};
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item-active
    > .ant-collapse-header {
    margin: 0 1.5rem;
    padding: 0;
    color: ${(props) => props.theme.basic.action};
  }

  .ant-collapse-borderless
    > .ant-collapse-item
    > .ant-collapse-content
    > .ant-collapse-content-box {
    margin: 8px 0;
    padding: 10px 1.5rem;
    color: ${(props) => props.theme.basic.white};
    background-color: ${(props) => props.theme.basic.blackDarken};
  }

  .ant-collapse-borderless > .ant-collapse-item {
    margin-bottom: 13px;

    border-bottom: none;
  }
`;
