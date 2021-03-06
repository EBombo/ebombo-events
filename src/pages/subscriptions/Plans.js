import React, { useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { PlansTable } from "./PlansTable";
import { PlanTabContent } from "./PlanTabContent";

export const Plans = (props) => {
  const [tab, setTab] = useState(props.tab ?? "online");
  const [isMonthly, setIsMonthly] = useState(false);

  return (
    <PlansContainerCss>
      <PlansContainer>
        <div className="title">¿Quieres conocer tu plan perfecto? Contáctanos</div>

        {/*
        <div className="tabs">
          <div
            className={`tab ${tab === "online" && "active"}`}
            onClick={() => {
              setTab("online");
            }}
          >
            Evento
            <Tablet>
              <br />
            </Tablet>
            {" Virtual"}
          </div>

          <div
            className={`tab ${tab === "games" && "active"}`}
            onClick={() => {
              setTab("games");
            }}
          >
            Juegos de
            <Tablet>
              <br />
            </Tablet>
            {" integración"}
          </div>
        </div>
         */}

        <PlanTabContent {...props} tab={tab} isMonthly={isMonthly} setIsMonthly={setIsMonthly} />
      </PlansContainer>

      {tab === "games" && (
        <section id="plans-table">
          <TableContainer>
            <PlansTable {...props} showMostPopularBadge isMonthly={isMonthly} setIsMonthly={setIsMonthly} />
          </TableContainer>
        </section>
      )}
    </PlansContainerCss>
  );
};

const PlansContainerCss = styled.div`
  background: ${(props) => props.theme.basic.whiteLighten};
  max-width: 100vw;
`;

const PlansContainer = styled.div`
  width: 100%;
  padding: 2rem 1rem;

  .more-info {
    display: flex;
    align-items: center;
    justify-content: center;

    .btn-subs {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 20px;
      line-height: 23px;
      color: ${(props) => props.theme.basic.secondary};
      background: none;
      border: none;
    }
  }

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    color: ${(props) => props.theme.basic.secondary};
    text-align: center;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    align-items: center;
    background: transparent;
    border: 2px solid ${(props) => props.theme.basic.primary};
    box-sizing: border-box;
    border-radius: 8px;
    margin: 1rem auto;
    max-width: 1100px;

    .tab {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.primary};
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    .middle-tab {
      border-left: 2px solid ${(props) => props.theme.basic.primary};
      border-right: 2px solid ${(props) => props.theme.basic.primary};
    }

    .active {
      color: ${(props) => props.theme.basic.whiteLight};
      background: ${(props) => props.theme.basic.primary};
    }
  }

}

${mediaQuery.afterTablet} {
  padding: 2rem;

  .title {
    font-size: 34px;
    line-height: 41px;
  }

  .tabs {
    margin: 2rem auto;
    border: 4px solid ${(props) => props.theme.basic.primary};

    .tab {
      font-size: 24px;
      line-height: 28px;
    }

    .middle-tab {
      border-left: 4px solid ${(props) => props.theme.basic.primary};
      border-right: 4px solid ${(props) => props.theme.basic.primary};
    }
  }
}
`;

const TableContainer = styled.div`
  width: 100%;
  overflow: auto;
  margin: 0 auto;
`;
