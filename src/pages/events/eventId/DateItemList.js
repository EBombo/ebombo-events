import React, { useState } from "reactn";
import { Anchor } from "../../../components/form";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import { DateEvent } from "./DateEvent";

export const DateItemList = (props) => {
  const [isEdit, setIsEdit] = useState(false);

  return isEdit ? (
    <DateEvent currentDate={props.date} setIsEdit={setIsEdit} {...props} />
  ) : (
    <div className="grid grid-cols-5 gap-3 w-9/12 rounded-md border-2 border-grayLighten py-6 px-4 mb-4">
      <div>
        <div className="text-grayDarken mb-4">Día del evento</div>
        <div className="text-secondary text-base mb-4">{props.date.month.format("dddd DD MMMM")}</div>
      </div>

      <div>
        <div className="text-grayDarken mb-4">Inicio del evento</div>
        <div className="text-secondary text-base mb-4">{props.date.start.format("h:mm a")}</div>
      </div>

      <div>
        <div className="text-grayDarken mb-4">Fin del evento</div>
        <div className="text-secondary text-base mb-4">{props.date.end.format("h:mm a")}</div>
      </div>

      <Anchor underlined margin="auto 0" variant="secondary" onClick={() => setIsEdit((prev) => !prev)}>
        Editar
      </Anchor>

      <Image
        src={`${config.storageUrl}/resources/delete.svg`}
        width="16px"
        height="16px"
        size="contain"
        margin="auto"
        cursor="pointer"
        onClick={() => props.setDates([...props.dates.filter((date_) => date_.id !== props.date.id)])}
      />
    </div>
  );
};
