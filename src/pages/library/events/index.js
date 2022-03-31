import React, { useEffect, useGlobal, useState } from "reactn";
import { Anchor, ButtonAnt } from "../../../components/form";
import { config, firestore } from "../../../firebase";
import { ModalNewEvent } from "./ModalNewEvent";
import { Image } from "../../../components/common/Image";
import { darkTheme } from "../../../theme";
import { Tooltip } from "antd";
import { Desktop } from "../../../constants";
import capitalize from "lodash/capitalize";
import { useRouter } from "next/router";
import moment from "moment";

export const Events = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");
  const [events] = useGlobal("userEvents");
  const [adminGames] = useGlobal("adminGames");
  const [adminGamesHash, setAdminGamesHash] = useState({});

  useEffect(() => {
    const _adminGamesHash = {};
    adminGames.map((game) => (_adminGamesHash[game.id] = game));

    setAdminGamesHash(_adminGamesHash);
  }, [adminGames]);

  const [isVisibleModalEvents, setIsVisibleModalEvents] = useState(false);

  const deleteEvent = async (event) => await firestore.collection("events").doc(event.id).update({ deleted: true });

  return (
    <div className="p-4 bg-whiteDark min-h-[calc(100vh-100px)] md:p-8 md:h-full overflow-auto">
      {isVisibleModalEvents && (
        <ModalNewEvent
          {...props}
          isVisibleModalEvents={isVisibleModalEvents}
          setIsVisibleModalEvents={setIsVisibleModalEvents}
        />
      )}

      <ButtonAnt onClick={() => setIsVisibleModalEvents(true)}>Crear</ButtonAnt>

      <div className="my-4 md:my-8">
        {events.map((event) => (
          <div
            className="w-full h-[110px] grid grid-cols-[95px_auto] bg-whiteLight rounded-[6px] md:grid-cols-[164px_auto] md:h-[140px] overflow-hidden shadow-[2px_2px_4px_rgb(0,0,0,0.25)] cursor-pointer"
            onClick={() => {
              if (!event.manageByUser) return;

              router.push(`/library/events/${event.id}/view`);
            }}
            key={event.id}
          >
            <Image src={event.imageUrl} width="100%" height="100%" size="cover" margin="0" cursor="pointer" />
            <div className="grid grid-rows-[auto_35px] md:grid-rows-[auto_45px]">
              <div className="p-2 md:p-3 flex justify-between">
                <div>
                  <div className="text-['Lato'] font-[700] text-[16px] leading-[18px] md:text-[20px] md:leading-[22px]">
                    {event.manageByUser
                      ? event.name
                      : `Solicitud de evento al equipo de Ebombo - ${moment(event.createAt.toDate()).format(
                          "DD/MM/YYYY HH:MM a"
                        )}`}
                  </div>
                  {event.link && (
                    <div className="flex items-center gap-[5px] text-['Lato'] font-[400] text-[13px] leading-[15px] text-blackDarken mt-[10px] max-w-[200px]">
                      Link:{" "}
                      <Anchor variant="primary" href={event.link} className="no-wrap">
                        {event.link}
                      </Anchor>
                    </div>
                  )}
                </div>
                <Tooltip
                  placement="bottomRight"
                  trigger="click"
                  title={
                    <div className="flex flex-col">
                      <div
                        className="flex items-center font-[normal] text-['Lato'] p-2 text-[16px] leading-[19px]"
                        onClick={() => deleteEvent(event)}
                      >
                        <Image
                          src={`${config.storageUrl}/resources/delete.svg`}
                          width={"16px"}
                          height={"16px"}
                          size={"contain"}
                          margin={"0 15px 0 0"}
                        />
                        Borrar
                      </div>
                    </div>
                  }
                  color={darkTheme.basic.whiteLight}
                >
                  <div className="w-[10px] h-[18px] flex flex-col justify-evenly items-center">
                    <div className="w-[4px] h-[4px] bg-black rounded-[50%]" />
                    <div className="w-[4px] h-[4px] bg-black rounded-[50%]" />
                    <div className="w-[4px] h-[4px] bg-black rounded-[50%]" />
                  </div>
                </Tooltip>
              </div>
              <div className="p-2 bg-whiteDark flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <Image
                    src={`${config.storageUrl}/resources/time.svg`}
                    width="20px"
                    height="20px"
                    size="contain"
                    margin="0"
                  />
                  <div className="text-black text-['Lato'] text-[13px] leading[16px]">
                    {`${
                      event.startAt?.toDate ? moment(event.startAt.toDate()).format("HH:MM:SS a") : event.startAt
                    } - ${event.endAt?.toDate ? moment(event.endAt.toDate()).format("HH:MM:SS a") : event.endAt}`}
                  </div>
                </div>
                <div className="flex items-center gap-[10px]">
                  {event.manageByUser ? (
                    <>
                      <Desktop>
                        {event.adminGamesIds.map((gameId) => (
                          <div className="bg-gray rounded-[6px] flex items-center p-2 w-[100px]" key={gameId}>
                            <Image
                              src={`${config.storageUrl}/resources/games/${adminGamesHash[gameId]?.name}-icon.svg`}
                              height={"20px"}
                              width={"20px"}
                              borderRadius={adminGamesHash[gameId]?.name === "hanged" ? "0" : "50%"}
                              margin={"0 5px 0 0"}
                              size="contain"
                            />

                            <div className="text-['Lato'] font-[400] text-[14px] leading-[16px] text-grayLight no-wrap">
                              {capitalize(adminGamesHash[gameId]?.title)}
                            </div>
                          </div>
                        ))}
                      </Desktop>
                      <ButtonAnt color="secondary" onClick={() => router.push(`/library/events/${event.id}`)}>
                        Editar
                      </ButtonAnt>
                    </>
                  ) : (
                    <div className="flex items-center gap-[5px]">
                      <div className="text-black text-['Lato'] text-[13px] leading[16px]">
                        Organizado por el equipo de
                      </div>
                      <Image
                        src={`${config.storageUrl}/resources/ebombo.svg`}
                        width="114px"
                        height="30px"
                        size="contain"
                        margin="0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
