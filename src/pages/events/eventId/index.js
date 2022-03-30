import React, { useMemo, useState } from "reactn";
import styled from "styled-components";
import { Tabs } from "antd";
import { config } from "../../../firebase";
import { SizeEvent } from "./SizeEvent";
import { CheckOutlined } from "@ant-design/icons";
import { BudgetEvent } from "./BudgetEvent";
import { DetailsEvent } from "./DetailsEvent";
import { DatesEvent } from "./DatesEvent";
import { ResumeEvent } from "./ResumeEvent";

const { TabPane } = Tabs;

const defaultTab = "size";

export const EventContainer = (props) => {
  const [currentTab, setCurrentTab] = useState(defaultTab);

  const [size, setSize] = useState(null);
  const [budget, setBudget] = useState(null);
  const [details, setDetails] = useState(null);
  const [dates, setDates] = useState(null);
  const [resume, setResume] = useState(null);
  const [register, setRegister] = useState(null);

  const createEventSteps = useMemo(() => {
    console.log("size", size);
    console.log("budget", budget);
    console.log("details", details);
    console.log("dates", dates);

    return [
      {
        tab: !!size ? (
          <div className="text-success">
            <CheckOutlined /> Tamaño
          </div>
        ) : (
          <div className="text-secondary">Tamaño</div>
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
            <CheckOutlined /> Presupuesto
          </div>
        ) : (
          <div className="text-secondary">Presupuesto</div>
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
            <CheckOutlined /> Detalles
          </div>
        ) : (
          <div className="text-secondary">Detalles</div>
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
            <CheckOutlined /> Fecha
          </div>
        ) : (
          <div className="text-secondary">Fecha</div>
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
            <CheckOutlined /> Resumen
          </div>
        ) : (
          <div className="text-secondary">Resumen</div>
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
          />
        ),
      },
      {
        tab: !!register ? (
          <div className="text-success">
            <CheckOutlined /> Registro
          </div>
        ) : (
          <div className="text-secondary">Registro</div>
        ),
        key: "register",
        content: (eventSteps, position) => "register",
      },
    ];
  }, [size, setSize, budget, setBudget, details, setDetails, dates, setDates]);

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
  background-image: ${(props) => `url('${props.tapiz}')`};

  .ant-tabs-nav {
    margin-bottom: 0;
    padding-top: 3rem;
    padding-left: 4rem;
    background: ${(props) => props.theme.basic.white};

    .ant-tabs-tab-active {
      .ant-tabs-tab-btn {
        color: ${(props) => props.theme.basic.nada};
      }
    }

    .ant-tabs-ink-bar {
      background: ${(props) => props.theme.basic.secondary}!important;
    }
  }
`;
