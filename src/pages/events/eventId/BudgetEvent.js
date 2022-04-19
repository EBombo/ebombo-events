import React, { useState } from "reactn";
import { Anchor, ButtonAnt } from "../../../components/form";
import { config } from "../../../firebase";
import { useTranslation } from "../../../hooks";

const options = {
  participants: {
    title: "for-participant",
    key: "participants",
    budgets: ["$1 - $10", "$11 - $40", "$41 - $70", "$71 - $100", "$100 +"],
  },
  events: {
    title: "for-event",
    key: "events",
    budgets: ["$500 - $1000", "$1000 - $3000", "$3000 - $6000", "Más de $6000", "not-sure"],
  },
};

export const BudgetEvent = (props) => {
  const { t } = useTranslation("pages.events");

  const [currentTab, setCurrentTab] = useState(props.budget.currentTab ?? Object.values(options)[0].key);

  return (
    <div>
      <div className="text-primary text-4xl mb-6">{t("how-budget")}</div>

      <div className="flex mb-4">
        {Object.values(options).map((option) => (
          <div
            className={`w-52 py-3 mx-2 text-center rounded-md cursor-pointer ${
              currentTab === option.key ? "bg-primary text-white" : "bg-gray text-primary"
            }`}
            key={option.key}
            onClick={() => setCurrentTab(option.key)}
          >
            {t(option.title)}
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:flex" key={currentTab}>
        {options[currentTab].budgets.map((budget) => (
          <div
            className={`w-full text-2xl bg-white rounded-md border-2 py-2 px-1 cursor-pointer relative md:w-52 text-bold text-secondary pl-2 ${
              props.budget?.budget === budget ? "border-primary" : "border-grayLighten"
            }`}
            key={budget}
            onClick={() => props.setBudget({ budget, currentTab })}
          >
            {t(budget, budget)}

            {props.budget?.budget === budget ? (
              <img
                src={`${config.storageUrl}/resources/events/check.svg`}
                className="absolute top-px right-px w-6 h-6"
              />
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex mt-4">
        <Anchor
          underlined
          margin="auto 0"
          variant="secondary"
          onClick={() => props.setCurrentTab(props.eventSteps[props.position - 1]?.key)}
        >
          {t("back")}
        </Anchor>

        <ButtonAnt
          onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1]?.key)}
          color="primary"
          disabled={!props.budget}
          variant="contained"
          fontSize="18px"
          size="big"
          margin="1rem 0 auto auto"
        >
          {t("next")}
        </ButtonAnt>
      </div>
    </div>
  );
};
