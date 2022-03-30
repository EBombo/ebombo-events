import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import moment from "moment";
import { Table } from "antd";
import { columns } from "../EventStepTwo";
import defaultTo from "lodash/defaultTo";
import { Image } from "../../../../../components/common/Image";
import { config, firestore } from "../../../../../firebase";
import capitalize from "lodash/capitalize";
import { useRouter } from "next/router";
import { ButtonAnt } from "../../../../../components/form";
import { snapshotToArray } from "../../../../../utils";

export const EventView = (props) => {
  const router = useRouter();

  const { eventId } = router.query;

  const [events] = useGlobal("userEvents");
  const [adminGames] = useGlobal("adminGames");
  const [adminGamesHash, setAdminGamesHash] = useState({});

  const [releases, setReleases] = useState([]);

  const event = useMemo(() => {
    if (!eventId) return {};
    if (!events?.length) return {};

    const _event = events.find((event) => event.id === eventId);

    return _event ?? {};
  }, [events, eventId]);

  useEffect(() => {
    router.prefetch("/library/events/[eventId]");
  }, []);

  useEffect(() => {
    const _adminGamesHash = {};
    adminGames.map((game) => (_adminGamesHash[game.id] = game));

    setAdminGamesHash(_adminGamesHash);
  }, [adminGames]);

  useEffect(() => {
    const fetchReleases = firestore
      .collection("events")
      .doc(eventId)
      .collection("releases")
      .where("deleted", "==", false)
      .onSnapshot((releasesQuery) => {
        setReleases(snapshotToArray(releasesQuery));
      });

    const unsubscribeReleases = fetchReleases();

    return unsubscribeReleases();
  }, [eventId]);

  return (
    <div className="w-full flex flex-col items center bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 h-[calc(100vh-50px)] overflow-auto">
      <div className="flex items-start justify-between">
        <div className="flex flex-col-reverse gap-[10px] md:flex-row md:items-end">
          <Image src={event.imageUrl} width="290px" height="150px" size="cover" margin="0" borderRadius="8px" />
          <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
            {event?.name}
          </div>
        </div>
        <div className="hidden md:block">
          <ButtonAnt onClick={() => router.push(`/library/events/${event.id}?manageBy=user`)}>
            <div className="text-['Lato'] font-[500] text-[18px] leading-[22px] px-8">Editar</div>
          </ButtonAnt>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:gap-8 md:flex-row">
        <div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px]  my-2 md:my-4">Fecha</div>
          <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px]">
            {`${moment(event?.eventDate).format("LL")} ${event?.startAt?.toUpperCase()} ${event?.endAt?.toUpperCase()}`}
          </div>
        </div>
        <div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] my-2 md:my-4">
            Link de la reunión
          </div>
          <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] no-wrap">
            {event?.link}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:overflow-x-auto md:overflow-y-hidden">
        <div className="max-w-[500px] w-full overflow-x-auto">
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Invitados
          </div>
          <div className="min-w-[500px]">
            <Table columns={columns} dataSource={event?.members ?? []} className="rounded-[6px]" />
          </div>
        </div>

        <div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Juegos seleccionados
          </div>
          <div className="flex flex-col md:h-[350px] md:overflow-auto md:overflow-x-hidden">
            {defaultTo(event?.adminGamesIds, []).map((gameId) => (
              <div
                className="bg-white rounded-[6px] flex items-center p-2 border-grayLighten border-[1px] w-[320px] my-2"
                key={gameId}
              >
                <Image
                  src={`${config.storageUrl}/resources/games/${adminGamesHash[gameId]?.name}.png`}
                  height={"60px"}
                  width={"80px"}
                  borderRadius="4px"
                  margin={"0 5px 0 0"}
                  size="cover"
                />

                <div className="text-['Lato'] font-[400] text-[14px] leading-[16px] text-grayLight">
                  {capitalize(adminGamesHash[gameId]?.title)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Comunicados
          </div>
          <div className="flex flex-col md:h-[350px] md:overflow-auto md:overflow-x-hidden">
            {defaultTo(event?.releases, []).map((release) => (
              <div
                className="bg-white rounded-[6px] flex items-center p-2 border-grayLighten border-[1px] w-[350px] my-2"
                key={release.id}
              >
                <div className="text-['Lato'] font-[400] text-[14px] leading-[16px] text-grayLight">
                  {capitalize(release.name)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="block md:hidden w-full">
        <ButtonAnt onClick={() => router.push(`/library/events/${event.id}?manageBy=user`)} margin="1rem auto">
          <div className="text-['Lato'] font-[500] text-[18px] leading-[22px] px-8">Editar</div>
        </ButtonAnt>
      </div>
    </div>
  );
};
