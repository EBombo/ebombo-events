import React, { useGlobal, useState, useEffect } from "reactn";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { darkTheme } from "../../../theme";
import { useRouter } from "next/router";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";

export const ModalNewEvent = (props) => {
  const router = useRouter();

  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={props.isVisibleModalEvents}
      padding={"0 0 1rem 0"}
      top="10%"
      width="fit-content"
      background={darkTheme.basic.whiteLight}
      onCancel={() => props.setIsVisibleModalEvents(!props.isVisibleModalEvents)}
    >
      <div>
        <div className="text-blackDarken text-['Lato'] font-[700] text-[25px] leading-[30px] p-2 box-shadow-[0_4px_4px_rgba(0,0,0,0.25)] border-b-[1px] border-primary md:py-4">
          Crear un evento nuevo
        </div>

        <div className="grid w-full max-w-[950px] gap-4 md:grid-cols-[1fr_1fr] p-8">
          <div
            className="flex flex-col rounded-[6px] overflow-hidden cursor-pointer border-solid border border-gray"
            onClick={() => router.push("/events/new")}
          >
            <Image
              src={`${config.storageUrl}/resources/own-event.svg`}
              width="100%"
              height="190px"
              size="cover"
              margin="0"
              cursor="pointer"
            />
            <div className="h-[40px] w-full flex items-center justify-center text-['Lato'] font-[700] text-[18px] leading-[22px] text-secondary">
              Hacerlo yo mismo
            </div>
          </div>
          <div
            className="flex flex-col rounded-[6px] overflow-hidden cursor-pointer border-solid border border-gray"
            onClick={() => router.push("/events/new")}
          >
            <Image
              src={`${config.storageUrl}/resources/ebombo-event.svg`}
              width="100%"
              height="190px"
              size="cover"
              margin="0"
              cursor="pointer"
            />
            <div className="h-[40px] w-full flex items-center justify-center text-['Lato'] font-[700] text-[18px] leading-[22px] text-secondary">
              Dejarlo en manos de ebombo
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
