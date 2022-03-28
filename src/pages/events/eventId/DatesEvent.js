import React, { useState } from "reactn";
import { Anchor, ButtonAnt, DatePicker } from "../../../components/form";
import { config, firestore } from "../../../firebase";
import { Image } from "../../../components/common/Image";
import { TimePicker } from "antd";

export const DatesEvent = (props) => {
  const [currentDate, setCurrentDate] = useState({});

  return (
    <div>
      <div className="text-primary text-4xl mb-6">¿Cuándo planeas hacer tu evento?</div>

      <div className="text-secondary mb-4 text-xl">
        Elige fechas tentativas para tu evento. De esa forma podremos realizar tu evento sin que haya un cruce.
      </div>

      <div className="grid grid-cols-4 gap-3 w-9/12 rounded-md border-2 border-grayLighten py-6 px-4 mb-9">
        <div>
          <div className="text-secondary mb-4">Día del evento</div>
          <DatePicker format="ll" onChange={(event) => setCurrentDate({ ...currentDate, month: event })} />
        </div>

        <div>
          <div className="text-secondary mb-4">Inicio del evento</div>
          <TimePicker className="w-full" onChange={(event) => setCurrentDate({ ...currentDate, start: event })} />
        </div>

        <div>
          <div className="text-secondary mb-4">Fin del evento</div>
          <TimePicker className="w-full" onChange={(event) => setCurrentDate({ ...currentDate, end: event })} />
        </div>

        <div className="flex">
          <ButtonAnt
            margin="auto"
            color="primary"
            variant="contained"
            disabled={!currentDate?.month && !currentDate?.start && !currentDate?.end}
            onClick={() =>
              props.setDates([...(props.dates ?? []), { id: firestore.collection("event").doc().id, ...currentDate }])
            }
          >
            Adicionar fecha
          </ButtonAnt>
        </div>
      </div>

      {props.dates?.length ? (
        <>
          <div className="text-secondary mb-4 text-xl">Fechas tentativas elegidas</div>

          {props.dates.map((date) => (
            <div
              className="grid grid-cols-5 gap-3 w-9/12 rounded-md border-2 border-grayLighten py-6 px-4 mb-4"
              key={date.id}
            >
              <div>
                <div className="text-grayDarken mb-4">Día del evento</div>
                <div className="text-secondary text-base mb-4">{date.month.format("LLL")}</div>
              </div>

              <div>
                <div className="text-grayDarken mb-4">Inicio del evento</div>
                <div className="text-secondary text-base mb-4">Fecha...</div>
              </div>

              <div>
                <div className="text-grayDarken mb-4">Fin del evento</div>
                <div className="text-secondary text-base mb-4">Fecha...</div>
              </div>

              <Anchor underlined margin="auto 0" variant="secondary">
                Editar
              </Anchor>

              <Image
                src={`${config.storageUrl}/resources/delete.svg`}
                width="16px"
                height="16px"
                size="contain"
                margin="auto"
                cursor="pointer"
              />
            </div>
          ))}
        </>
      ) : null}

      <div className="flex mt-4">
        <Anchor
          underlined
          margin="auto 0"
          variant="secondary"
          onClick={() => props.setCurrentTab(props.eventSteps[props.position - 1].key)}
        >
          Volver
        </Anchor>

        <ButtonAnt
          onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1].key)}
          color="primary"
          variant="contained"
          disabled={!props.dates?.length}
          fontSize="18px"
          size="big"
          margin="1rem 0 auto auto"
        >
          Siguiente
        </ButtonAnt>
      </div>
    </div>
  );
};
