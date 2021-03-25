import React, {useGlobal} from "reactn";
import styled from "styled-components";
import {Collapse} from "antd";
import {mediaQuery} from "../../styles/constants";
import defaultTo from "lodash/defaultTo";
import {WhiteSpace} from "./WhiteSpace";

export const GeneralInfo = (props) => {
  const [matchInstructions] = useGlobal("matchInstructions");
  const Panel = Collapse.Panel;

  return (
    <Container>
      <Collapse
        bordered={false}
        defaultActiveKey={[]}
        expandIconPosition={"right"}
      >
        {defaultTo(matchInstructions, []).map((matchInstruction, index) => (
          <Panel
            header={matchInstruction.title}
            key={index}
            className="pre-wrap"
          >
            {matchInstruction.content}
          </Panel>
        ))}
        <WhiteSpace />
      </Collapse>
    </Container>
  );
};

const Container = styled.div`
  .ant-collapse-borderless {
    background-color: ${(props) => props.theme.basic.default};
    border: 0;
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header
    .ant-collapse-arrow {
    color: ${(props) => props.theme.basic.primary};
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item
    > .ant-collapse-header {
    color: ${(props) => props.theme.basic.white};
    padding: 0.5rem 1rem;
    ${mediaQuery.afterTablet} {
      padding: 0.5rem 2rem;
    }
  }

  .ant-collapse-icon-position-right
    > .ant-collapse-item-active
    > .ant-collapse-header {
    color: ${(props) => props.theme.basic.action};
  }

  .ant-collapse-borderless
    > .ant-collapse-item
    > .ant-collapse-content
    > .ant-collapse-content-box {
    color: ${(props) => props.theme.basic.white};
    padding: 0.5rem 1rem;
    ${mediaQuery.afterTablet} {
      padding: 0.5rem 2rem;
    }
  }

  .ant-collapse-borderless > .ant-collapse-item {
    border-bottom: 0.5px solid ${(props) => props.theme.basic.whiteDarken};
  }
`;
