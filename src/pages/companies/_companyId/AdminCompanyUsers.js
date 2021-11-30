import React from "reactn";
import styled from "styled-components";
import { Tablet } from "../../../constants";
import { Tabs } from "antd";

export const AdminCompanyUsers = (props) => {
  const { TabPane } = Tabs;

  return (
    <AdminContainer>
      <div className="admin-content">
        <Tablet>
          <div className="title">Administración de usuarios</div>
        </Tablet>
        <Tabs defaultActiveKey="1" >
          <TabPane tab="Tab 1" key="1">
            Content of Tab Pane 1
          </TabPane>
          <TabPane tab="Tab 2" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="Tab 3" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </div>
    </AdminContainer>
  );
};

const AdminContainer = styled.div`
  width: 100%;

  .admin-content {
    .title {
      padding: 0.5rem;
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.blackLighten};
      border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
    }
  }
`;
