import React, { useState } from "reactn";
import { FileUpload } from "../../../../components/common/FileUpload";
import { DatePicker, TimePicker } from "antd";
import { ButtonAnt, Input } from "../../../../components/form";
import moment from "moment";

export const EventStepOne = (props) => {
  const [name, setName] = useState(props.event?.name ?? "");
  const [link, setLink] = useState(props.event?.link ?? "");
  const [imageUrl, setImageUrl] = useState(props.event?.imageUrl ?? "");
  const [eventDate, setEventDate] = useState(props.event?.eventDate ?? "");
  const [startAt, setStartAt] = useState(props.event?.startAt ?? "");
  const [endAt, setEndAt] = useState(props.event?.endAt ?? "");

  const [errorEventDate, setErrorEventDate] = useState(false);

  const saveStepOne = async (data) => {
    if (!startAt || !endAt || !eventDate) {
      setErrorEventDate(true);
      return props.showNotification("Error", "Completa la fecha y las horas del evento");
    }

    if (!name) {
      return props.showNotification("Error", "Completa el nombre del evento");
    }

    const _event = props.event;
    console.log(_event);
    props.setEvent({ ..._event, imageUrl, eventDate, startAt, endAt, name, link });
    props.setCurrentStep(2);
  };

  return (
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        Detalles básicos
      </div>

      <div className="flex flex-col gap-4 md:items-end md:flex-row">
        <div className="m-auto md:m-0">
          <FileUpload
            width="300px"
            height="170px"
            preview={true}
            file={imageUrl}
            fileName="imageUrl"
            filePath={`/events/${props.documentId}`}
            bucket="landings"
            sizes="300x350"
            afterUpload={(imageUrls) => setImageUrl(imageUrls[0].url)}
          />
        </div>

        <div className="flex flex-col gap-4 gap-[5px] w-full max-w-[630px]">
          <label htmlFor="name" className="text-secondary text-['Lato'] font-[400] text-[18px] leading-[22px]">
            Título de tu evento
          </label>
          <Input
            type="text"
            name="name"
            height="60px"
            background="white"
            value={name}
            onChange={(e) => {
              e.preventDefault();
              setName(e.target.value);
            }}
            placeholder="Escribe aquí...."
          />
        </div>
      </div>

      <div className="my-4 text-['Lato'] font-[400] text-secondary text-[18px] leading-[22px]">Fecha del evento</div>

      <div
        className={`p-4 ${
          errorEventDate ? "border-danger" : "border-grayLighten"
        } border-[2px] flex items-center gap-[10px] bg-white w-full md:w-fit rounded-[6px] flex-col md:flex-row`}
      >
        <div className="flex flex-col gap-[5px] w-full md:w-fit">
          <div className="text-['Lato'] font-[400] text-secondary text-[16px] leading-[18px]">Día del evento</div>
          <DatePicker
            onChange={(value) => {
              setEventDate(value.toDate());
            }}
            style={{
              border: "1px solid #C4C4C4",
              borderRadius: "4px",
              height: "33px",
              width: "200px",
              background: "#FAFAFA",
            }}
            placeholder="Fecha del evento"
          />
        </div>
        <div className="flex items-center gap-[10px] w-full md:w-fit">
          <div className="flex flex-col gap-[5px]">
            <div className="text-['Lato'] font-[400] text-secondary text-[16px] leading-[18px]">Inicio del evento</div>

            <TimePicker
              use12Hours
              format="h:mm a"
              placeholder="Hora de Inicio"
              onChange={(value) => setStartAt(value.format("hh:mm:ss a"))}
              style={{
                border: "1px solid #C4C4C4",
                borderRadius: "4px",
                height: "33px",
                width: "130px",
                background: "#FAFAFA",
              }}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <div className="text-['Lato'] font-[400] text-secondary text-[16px] leading-[18px]">Fin del evento</div>
            <TimePicker
              use12Hours
              format="h:mm a"
              placeholder="Hora de fin"
              onChange={(value) => setEndAt(value.format("hh:mm:ss a"))}
              style={{
                border: "1px solid #C4C4C4",
                borderRadius: "4px",
                height: "33px",
                width: "130px",
                background: "#FAFAFA",
              }}
            />
          </div>
        </div>
      </div>

      <div className="my-4 text-['Lato'] font-[400] text-secondary text-[18px] leading-[22px]">
        Link de la reunión (Zoom, Cisco, Teams, Meets, etc)
      </div>

      <div className="w-full max-w-[500px]">
        <Input
          type="url"
          name="link"
          height="60px"
          background="white"
          value={link}
          onChange={(e) => {
            e.preventDefault();
            setLink(e.target.value);
          }}
          placeholder="Escribe aquí...."
        />
      </div>
      <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] mt-[5px]">
        *Puedes agregarlo después de crear el evento
      </div>

      <div className="flex w-full items-center justify-end">
        <ButtonAnt onClick={() => saveStepOne()}>Siguiente</ButtonAnt>
      </div>
    </div>
  );
};
