import React, { useState } from "reactn";
import { ConfigProvider, TimePicker } from "antd";
import locale from "antd/lib/locale/es_ES";
import { ButtonAnt, DatePicker } from "../../../components/form";
import { firestore } from "../../../firebase";
import moment from "moment";

export const DateEvent = (props) => {
  const [currentDate, setCurrentDate] = useState(props.currentDate ?? {});

  // Only allow days after today.
  const disabledDate = (current) => current && current < moment().endOf("day");

  return (
    <div className="grid md:grid-cols-4 gap-3 w-full md:w-9/12 rounded-md border-2 border-grayLighten py-6 px-4 mb-9">
      <div>
        <div className="text-secondary mb-4">Día del evento</div>
        <ConfigProvider locale={locale}>
          <DatePicker
            format="dddd DD MMMM"
            value={currentDate?.month}
            disabledDate={disabledDate}
            onChange={(event) => setCurrentDate({ ...currentDate, month: event })}
          />
        </ConfigProvider>
      </div>

      <div>
        <div className="text-secondary mb-4">Inicio del evento</div>
        <TimePicker
          format="h:mm a"
          className="w-full"
          value={currentDate?.start}
          onChange={(event) => setCurrentDate({ ...currentDate, start: event })}
        />
      </div>

      <div>
        <div className="text-secondary mb-4">Fin del evento</div>
        <TimePicker
          format="h:mm a"
          className="w-full"
          value={currentDate?.end}
          onChange={(event) => setCurrentDate({ ...currentDate, end: event })}
        />
      </div>

      <div className="flex">
        <ButtonAnt
          margin="auto"
          color="primary"
          variant="contained"
          disabled={!currentDate?.month || !currentDate?.start || !currentDate?.end}
          onClick={() => {
            // Edit date.
            if (props.currentDate?.id) {
              const newDates = props.dates.filter((date) => date.id !== props.currentDate.id);
              props.setDates([...newDates, currentDate]);
              return props.setIsEdit((prev) => !prev);
            }

            // Add date.
            props.setDates([
              ...(props.dates ?? []),
              { id: firestore.collection("event").doc().id, createAt: new Date(), ...currentDate },
            ]);

            setCurrentDate({});
          }}
        >
          {props.currentDate?.id ? "Guardar fecha" : "Adicionar fecha"}
        </ButtonAnt>
      </div>
    </div>
  );
};
