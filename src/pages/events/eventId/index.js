import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import styled from "styled-components";
import { Tabs } from "antd";
import { config } from "../../../firebase";
import { SizeEvent } from "./SizeEvent";
import { CheckOutlined } from "@ant-design/icons";
import { BudgetEvent } from "./BudgetEvent";
import { DetailsEvent } from "./DetailsEvent";
import { DatesEvent } from "./DatesEvent";
import { ResumeEvent } from "./ResumeEvent";
import { mediaQuery } from "../../../constants";
import { useRouter } from "next/router";
import { useTranslation } from "../../../hooks";

const { TabPane } = Tabs;

const defaultTab = "size";

export const EventContainer = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const { t } = useTranslation("pages.events");

  const [currentTab, setCurrentTab] = useState(defaultTab);

  const [size, setSize] = useState(null);
  const [budget, setBudget] = useState(null);
  const [details, setDetails] = useState(null);
  const [dates, setDates] = useState(null);
  const [resume, setResume] = useState(null);

  useEffect(() => {
    router.prefetch("/library");
  }, []);

  const createEventSteps = useMemo(() => {
    return [
      {
        tab: !!size ? (
          <div className="text-success">
            <CheckOutlined /> {t("size")}
          </div>
        ) : (
          <div className="text-secondary">{t("size")}</div>
        ),
        key: defaultTab,
        content: (eventSteps, position) => (
          <SizeEvent
            {...props}
            setCurrentTab={setCurrentTab}
            eventSteps={eventSteps}
            position={position}
            setSize={setSize}
            size={size}
          />
        ),
      },
      {
        tab: !!budget ? (
          <div className="text-success">
            <CheckOutlined /> {t("budget")}
          </div>
        ) : (
          <div className="text-secondary">{t("budget")}</div>
        ),
        key: "budget",
        content: (eventSteps, position) => (
          <BudgetEvent
            {...props}
            setCurrentTab={setCurrentTab}
            eventSteps={eventSteps}
            position={position}
            setBudget={setBudget}
            budget={budget}
          />
        ),
      },
      {
        tab: !!details ? (
          <div className="text-success">
            <CheckOutlined /> {t("details")}
          </div>
        ) : (
          <div className="text-secondary">{t("details")}</div>
        ),
        key: "details",
        content: (eventSteps, position) => (
          <DetailsEvent
            {...props}
            setCurrentTab={setCurrentTab}
            eventSteps={eventSteps}
            position={position}
            details={details}
            setDetails={setDetails}
          />
        ),
      },
      {
        tab: !!dates ? (
          <div className="text-success">
            <CheckOutlined /> {t("date")}
          </div>
        ) : (
          <div className="text-secondary">{t("date")}</div>
        ),
        key: "date",
        content: (eventSteps, position) => (
          <DatesEvent
            {...props}
            setCurrentTab={setCurrentTab}
            eventSteps={eventSteps}
            position={position}
            dates={dates}
            setDates={setDates}
          />
        ),
      },
      {
        tab: !!resume ? (
          <div className="text-success">
            <CheckOutlined /> {t("resume")}
          </div>
        ) : (
          <div className="text-secondary">{t("resume")}</div>
        ),
        key: "resume",
        content: (eventSteps, position) => (
          <ResumeEvent
            {...props}
            setCurrentTab={setCurrentTab}
            eventSteps={eventSteps}
            position={position}
            size={size}
            budget={budget}
            details={details}
            dates={dates}
            setResume={setResume}
          />
        ),
      },
      {
        tab: authUser ? null : <div className="text-secondary">{t("register")}</div>,
        key: "register",
        content: () => null,
      },
    ];
  }, [size, setSize, budget, setBudget, details, setDetails, dates, setDates, resume, setResume]);

  return (
    <EventContainerStyled tapiz={`${config.storageUrl}/resources/tapiz-v2.svg`} className="w-full bg-white">
      <Tabs activeKey={currentTab}>
        {createEventSteps.map((step, position) => (
          <TabPane key={step.key} tab={step.tab}>
            <div className="py-8 px-10">{step.content(createEventSteps, position)}</div>
          </TabPane>
        ))}
      </Tabs>
    </EventContainerStyled>
  );
};

const EventContainerStyled = styled.div`
  display: flex;
  max-width: 100vw;
  background-image: ${(props) => `url('${props.tapiz}')`};

  .ant-tabs {
    width: 100%;
  }

  .ant-tabs-nav {
    margin-bottom: 0;
    padding-top: 3rem;
    background: ${(props) => props.theme.basic.white};

    ${mediaQuery.afterTablet} {
      padding-left: 4rem;
    }

    .ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${(props) => props.theme.basic.secondary};
      }
    }

    .ant-tabs-ink-bar {
      background: ${(props) => props.theme.basic.secondary} !important;
    }
  }
`;
