import React, { useEffect, useGlobal } from "reactn";
import { ModalContainer } from "../../../components/common/ModalContainer";
import { darkTheme } from "../../../theme";
import { useRouter } from "next/router";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import { useTranslation } from "../../../hooks";

export const ModalNewEvent = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const { t } = useTranslation("modals.new-event");

  useEffect(() => {
    router.prefetch("/events/[eventId]");
    router.prefetch("/library/events/[eventId]");
  }, []);

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
        <div className="text-blackDarken text-['Lato'] font-[700] text-[25px] leading-[30px] p-2 shadow-[0_4px_4px_rgba(0,0,0,0.25)] border-b-[1px] border-primary md:py-4">
          {t("create-event")}
        </div>

        <div
          className={`grid w-full max-w-[950px] gap-4 md:grid-cols-[${
            props.hiddeMySelfOption ? "1fr" : "1fr_1fr"
          }] p-8`}
        >
          {props.hiddeMySelfOption ? (
            <div />
          ) : (
            <div
              className="flex flex-col rounded-[6px] overflow-hidden cursor-pointer border-solid border border-gray mx-auto"
              onClick={() => {
                const url = !!authUser ? "/library/events/new?manageBy=user" : "/events/new";
                router.push(url);
              }}
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
                {t("do-it-myself")}
              </div>
            </div>
          )}
          <div
            className="flex flex-col rounded-[6px] overflow-hidden cursor-pointer border-solid border border-gray mx-auto"
            onClick={() => {
              const url = !!authUser ? "/library/events/new?manageBy=ebombo" : "/events/new";
              router.push(url);
            }}
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
              {t("leave-ebombo-hands")}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
