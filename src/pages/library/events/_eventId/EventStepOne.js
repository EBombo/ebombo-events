import React from "reactn";
import { FileUpload } from "../../../../components/common/FileUpload";
import { Input } from "../../../../components/form";
import { DatePicker, TimePicker } from "antd";

export const EventStepOne = (props) => {
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
            filePath={`/events/${documentId}`}
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
            id="name"
            type="text"
            name="name"
            label="Route"
            height="60px"
            background="white"
            placeholder="Escribe aquí...."
          />
        </div>
      </div>

      <div className="my-4 text-['Lato'] font-[400] text-secondary text-[18px] leading-[22px]">Fecha del evento</div>

      <div className="p-4 border-grayLighten border-[2px] flex items-center gap-[10px] bg-white w-full md:w-fit rounded-[6px] flex-col md:flex-row">
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
              onChange={(value) => setStartAt(value)}
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
              onChange={() => setEndAt(value)}
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
          id="name"
          type="text"
          name="name"
          label="Route"
          height="60px"
          background="white"
          placeholder="Escribe aquí...."
        />
      </div>
      <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] mt-[5px]">
        *Puedes agregarlo después de crear el evento
      </div>
    </div>
  );
};
