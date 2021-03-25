import React, {useEffect, useState} from "react";
import {Tabs} from "antd";
import {spinLoader} from "../../../../utils";
import {useHistory, useParams} from "react-router";
import {AdminRules} from "./rules";
import {AdminFormats} from "./formats";
import {Icon} from "../../../../components/common/Icons";

export const GameTabsContainer = (props) => {
  const { gameId } = useParams();
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {
    const getCurrentTab = () =>
      history.location.pathname.includes("rules")
        ? setCurrentTab("rules")
        : setCurrentTab("formats");

    getCurrentTab();
  }, [currentTab]); //eslint-disable-line react-hooks/exhaustive-deps

  return !currentTab ? (
    spinLoader()
  ) : (
    <React.Fragment>
      <Tabs
        defaultActiveKey={currentTab}
        onChange={(currentTab) =>
          history.push(`/admin/games/${gameId}/${currentTab}`)
        }
      >
        <Tabs.TabPane
          tab={
            <div>
              <Icon type="gold" />
              REGLAS
            </div>
          }
          key="rules"
        >
          <AdminRules {...props} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <div>
              <Icon type="gold" />
              FORMATOS
            </div>
          }
          key="formats"
        >
          <AdminFormats {...props} />
        </Tabs.TabPane>
      </Tabs>
    </React.Fragment>
  );
};
