import React from "reactn";
import { Anchor, ButtonAnt } from "../../../components/form";
import { DateEvent } from "./DateEvent";
import { DateItemList } from "./DateItemList";
import orderBy from "lodash/orderBy";
import { useTranslation } from "../../../hooks";

export const DatesEvent = (props) => {
  const { t } = useTranslation("pages.events");

  return (
    <div>
      <div className="text-primary text-4xl mb-6">{t("when-plan-hold-event")}</div>

      <div className="text-secondary mb-4 text-xl">{t("choose-tentative-date")}</div>

      <DateEvent {...props} />

      {props.dates?.length ? (
        <>
          <div className="text-secondary mb-4 text-xl">{t("tentative-dates")}</div>

          {orderBy(props.dates, ["createAt", "asc"]).map((date) => (
            <DateItemList {...props} key={date.id} date={date} />
          ))}
        </>
      ) : null}

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
          variant="contained"
          disabled={!props.dates?.length}
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
