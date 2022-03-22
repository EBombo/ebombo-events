import React, { useState } from "reactn";
import { ButtonAnt } from "../../../components/form";

const options = {
  participants: {
    title: "Por participante",
    key: "participants",
    budgets: ["$10 - $40", "$40 - $70", "$70 - $100", "Más de $100"],
  },
  events: {
    title: "Para el evento",
    key: "events",
    budgets: ["$500 - $1000", "$1000 - $3000", "$3000 - $6000", "Más de $6000", "No estoy seguro"],
  },
};

export const BudgetEvent = (props) => {
  const [currentTab, setCurrentTab] = useState(Object.values(options)[0].key);

  return (
    <div>
      <div className="text-primary text-4xl mb-6">¿Cuánto es tu presupuesto?</div>

      <div className="flex mb-4">
        {Object.values(options).map((option) => (
          <div
            className={`w-52 py-3 mx-2 text-center rounded-md cursor-pointer ${
              currentTab === option.key ? "bg-primary text-white" : "bg-gray text-primary"
            }`}
            key={option.key}
            onClick={() => setCurrentTab(option.key)}
          >
            {option.title}
          </div>
        ))}
      </div>

      <div className="flex gap-4" key={currentTab}>
        {options[currentTab].budgets.map((budget) => (
          <div
            className={`w-52 text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer ${
              props.budget === budget ? "border-primary" : "border-grayLighten"
            }`}
            key={budget}
            onClick={() => props.setBudget(budget)}
          >
            {budget}
          </div>
        ))}
      </div>

      <ButtonAnt
        onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1].key)}
        color="primary"
        disabled={!props.budget}
        variant="contained"
        fontSize="18px"
        size="big"
        margin="1rem 0 auto auto"
      >
        Siguiente
      </ButtonAnt>
    </div>
  );
};
