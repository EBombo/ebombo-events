import React, { useState } from "reactn";
import styled from "styled-components";

const options = {
  participants: {
    title: "Por participante",
    key: "participants",
    budgets: ["$10 - $40", "$40 - $70", "$70 - $100", "Más de $100"],
  },
  events: {
    title: "Para el evento",
    key: "events",
    budgets: ["$500 - $1000", "$1000 - $3000", "$3000 - $6000", "$3000 - $6000", "$3000 - $6000"],
  },
};

export const BudgetEvent = (props) => {
  const [currentTab, setCurrentTab] = useState(Object.values(options)[0].key);

  return (
    <BudgetEventStyled>
      <div>¿Cuánto es tu presupuesto?</div>

      <div>
        {Object.values(options).map((option) => (
          <div key={option.key} onClick={() => setCurrentTab(option.key)}>
            {option.title}
          </div>
        ))}
      </div>

      {options[currentTab].budgets.map((budget) => (
        <div key={budget}>{budget}</div>
      ))}
    </BudgetEventStyled>
  );
};

const BudgetEventStyled = styled.div``;
