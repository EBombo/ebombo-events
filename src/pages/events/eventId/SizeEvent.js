import React from "reactn";
import { ButtonAnt } from "../../../components/form";
import { config } from "../../../firebase";
import { useTranslation } from "../../../hooks";

const options = ["0 - 10", "11 - 25", "26 - 50", "51 - 100", "100 - 500", "500 +"];

export const SizeEvent = (props) => {
  const { t } = useTranslation("pages.events");

  return (
    <div>
      <div className="text-secondary text-sm mb-3">{t("prepare-you-event")}</div>

      <div className="text-primary text-4xl mb-6">{t("how-many-people")}</div>

      <div className="grid gap-3 md:flex">
        {options.map((option) => (
          <div
            className={`w-full text-2xl bg-white rounded-md relative md:w-52 ${
              props.size === option ? "border-primary" : "border-grayLighten"
            } border-2 py-2 px-1 cursor-pointer text-bold text-secondary pl-2`}
            key={option}
            onClick={() => props.setSize(option)}
          >
            {option}

            {props.size === option ? (
              <img
                src={`${config.storageUrl}/resources/events/check.svg`}
                className="absolute top-px right-px w-6 h-6"
              />
            ) : null}
          </div>
        ))}
      </div>

      <ButtonAnt
        onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1]?.key)}
        color="primary"
        disabled={!props.size}
        variant="contained"
        fontSize="18px"
        size="big"
        margin="1rem 0 auto auto"
      >
        {t("next")}
      </ButtonAnt>
    </div>
  );
};
