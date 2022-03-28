import React from "reactn";
import moment from "moment";
import { Table } from "antd";
import { columns } from "../EventStepTwo";
import defaultTo from "lodash/defaultTo";
import { Image } from "../../../../../components/common/Image";
import { config } from "../../../../../firebase";
import capitalize from "lodash/capitalize";
import { Anchor, ButtonAnt } from "../../../../../components/form";

export const EventView = props => {
  return(
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        Resumen
      </div>

      <div className="grid max-w-[1200px] gap-4 items-start md:grid-cols-[400px_500px_auto]">
        <div className="w-full flex flex-col">
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Título
          </div>
          <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] md:text-[18px] md:leading-[22px]">
            {props.event?.name}
          </div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Fecha
          </div>
          <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] md:text-[18px] md:leading-[22px]">
            {`${moment(props.event?.eventDate ?? "").format(
              "LL"
            )} ${props.event?.startAt?.toUpperCase()} ${props.event?.endAt?.toUpperCase()}`}
          </div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Link de la reunión
          </div>
          <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] md:text-[18px] md:leading-[22px]">
            {props.event?.link}
          </div>
        </div>
        <div className="w-full overflow-auto">
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Invitados
          </div>
          <div className="min-w-[500px]">
            <Table columns={columns} dataSource={props.event?.members ?? []} className="rounded-[6px]" />
          </div>
        </div>
        <div className="flex flex-col md:h-[350px] md:overflow-auto md:overflow-x-hidden">
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Juegos seleccionados
          </div>
          {defaultTo(props.event?.adminGames, []).map((game) => (
            <div
              className="bg-white rounded-[6px] flex items-center p-2 border-grayLighten border-[2px] w-[170px] my-2"
              key={game.id}
            >
              <Image
                src={`${config.storageUrl}/resources/games/${game.name}-icon.svg`}
                height={"20px"}
                width={"20px"}
                borderRadius={game.name === "hanged" ? "0" : "50%"}
                margin={"0 5px 0 0"}
                size="contain"
              />

              <div className="text-['Lato'] font-[400] text-[14px] leading-[16px] text-grayLight">
                {capitalize(game.title)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <Anchor underlined variant="secondary" onClick={() => props.setCurrentStep(3)}>
          Volver
        </Anchor>
        <ButtonAnt color="success" onClick={() => console.log("something")} >
          <div className="w-[120px] text-['Lato'] font-[700] text-[18px] leading-[20px] text-blackDarken">Crear</div>
        </ButtonAnt>
      </div>
    </div>
  )
}