import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import moment from "moment";
import { Table } from "antd";
import { tableEventsColumns } from "../../../../../components/common/DataList";
import defaultTo from "lodash/defaultTo";
import { Image } from "../../../../../components/common/Image";
import { config, firestore } from "../../../../../firebase";
import capitalize from "lodash/capitalize";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { Anchor, ButtonAnt } from "../../../../../components/form";
import { snapshotToArray } from "../../../../../utils";
import { useTranslation } from "../../../../../hooks";

export const EventView = (props) => {
  const router = useRouter();

  const { eventId } = router.query;

  const { t } = useTranslation("pages.library.event");

  const [events] = useGlobal("userEvents");
  const [games] = useGlobal("userGames");
  const [adminGames] = useGlobal("adminGames");

  const [adminGamesHash, setAdminGamesHash] = useState({});
  const [members, setMembers] = useState([]);
  const [releases, setReleases] = useState([]);
  const [eventGames, setEventGames] = useState([]);

  const event = useMemo(() => {
    if (!eventId) return {};
    if (!events?.length) return {};

    const _event = events.find((event) => event.id === eventId);

    return _event ?? {};
  }, [events, eventId]);

  useEffect(() => {
    router.prefetch("/library/games/[gameId]");
    router.prefetch("/library/events/[eventId]");
    router.prefetch("/library/events/[eventId]/release/[releaseId]");
  }, []);

  useEffect(() => {
    const _adminGamesHash = {};
    adminGames.map((game) => (_adminGamesHash[game.id] = game));

    setAdminGamesHash(_adminGamesHash);
  }, [adminGames]);

  useEffect(() => {
    const fetchMembers = () =>
      firestore
        .collection("events")
        .doc(eventId)
        .collection("members")
        .where("deleted", "==", false)
        .onSnapshot((membersSnapshot) => {
          const _members = snapshotToArray(membersSnapshot);
          setMembers(_members);
        });

    const unsubscribeMembers = fetchMembers();

    return () => unsubscribeMembers && unsubscribeMembers();
  }, [eventId]);

  useEffect(() => {
    const fetchReleases = () =>
      firestore
        .collection("events")
        .doc(eventId)
        .collection("releases")
        .where("deleted", "==", false)
        .onSnapshot((releasesQuery) => {
          setReleases(snapshotToArray(releasesQuery));
        });

    const unsubscribeReleases = fetchReleases();

    return () => unsubscribeReleases && unsubscribeReleases();
  }, [eventId]);

  useEffect(() => {
    const _eventGames = defaultTo(games, []).filter((game) => game.eventId === eventId);

    setEventGames(_eventGames);
  }, [eventId, games]);

  return (
    <div className="w-full flex flex-col items center bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 min-h-[calc(100vh-50px)] overflow-auto">
      <div className="flex items-start justify-between">
        <div className="flex flex-col-reverse gap-[10px] md:flex-row md:items-end">
          <Image
            src={!isEmpty(event.imageUrl) ? event.imageUrl : `${config.storageUrl}/resources/event-default.svg`}
            width="290px"
            height="150px"
            size="cover"
            margin="0"
            borderRadius="8px"
          />
          <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
            {event?.name}
          </div>
        </div>
        <div className="hidden md:block">
          <ButtonAnt
            onClick={(e) => {
              e.preventDefault();
              router.push(`/library/events/${event.id}?manageBy=user`);
            }}
          >
            <div className="text-['Lato'] font-[500] text-[18px] leading-[22px] px-8">{t("edit")}</div>
          </ButtonAnt>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:gap-8 md:flex-row">
        <div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px]  my-2 md:my-4">Fecha</div>
          <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px]">
            {`${moment(event?.startAt?.toDate()).format("DD/MM/YYYY h:mm a")} ${moment(event?.endAt?.toDate()).format(
              "hh:mm a"
            )}`}
          </div>
        </div>
        {!isEmpty(event.link) && (
          <div>
            <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] my-2 md:my-4">
              {t("step-four.link")}
            </div>
            <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] no-wrap">
              {event?.link}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:overflow-x-auto md:overflow-y-hidden">
        <div className="max-w-[500px] w-full overflow-x-auto">
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            {t("step-two.title")}
          </div>
          <div className="min-w-[500px]">
            <Table columns={tableEventsColumns(t)} dataSource={members} className="rounded-[6px]" />
          </div>
        </div>

        <div className="min-w-[250px]">
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            {t("step-three.subtitle-one")}
          </div>
          <div
            className="flex flex-col md:pr-[10px] md:h-[350px] md:overflow-auto md:overflow-x-hidden"
            key={eventGames.length}
          >
            {eventGames.map((game) => (
              <div
                className="bg-white rounded-[6px] grid items-center grid-cols-[auto_auto_60px] p-2 border-grayLighten border-[1px] w-[320px] my-2"
                key={game.id}
              >
                <Image
                  src={`${config.storageUrl}/resources/games/${adminGamesHash[game?.adminGame?.id]?.name}.png`}
                  height={"60px"}
                  width={"80px"}
                  borderRadius="4px"
                  margin="0"
                  size="cover"
                />

                <div className="text-['Lato'] font-[400] text-[14px] leading-[16px] text-grayLight">
                  {capitalize(game.name)}
                </div>

                <ButtonAnt
                  size="small"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/library/games/${game.id}?adminGameId=${game.adminGame.id}`);
                  }}
                >
                  {t("edit")}
                </ButtonAnt>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            {t("releases")}
          </div>
          <div className="flex flex-col md:h-[350px] md:overflow-auto md:overflow-x-hidden">
            {releases.map((release) => (
              <div
                className="bg-white rounded-[6px] flex items-center p-2 border-grayLighten border-[1px] w-[350px] my-2 flex items-center gap-4"
                key={release.id}
              >
                <div className="text-['Lato'] font-[400] text-[14px] leading-[16px] text-grayLight no-wrap">
                  {capitalize(release.subject)}
                </div>
                <Anchor
                  underlined
                  variant="secondary"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/library/events/${eventId}/releases/${release.id}`);
                  }}
                >
                  Ver
                </Anchor>
              </div>
            ))}
          </div>
          <ButtonAnt
            onClick={(e) => {
              e.preventDefault();
              router.push(`/library/events/${event.id}/releases/new`);
            }}
            margin="1rem auto"
          >
            <div className="text-['Lato'] font-[500] text-[13px] leading-[15px]">{t("create-release")}</div>
          </ButtonAnt>
        </div>
      </div>

      <div className="block md:hidden w-full">
        <ButtonAnt
          onClick={(e) => {
            e.preventDefault();
            router.push(`/library/events/${event.id}?manageBy=user`);
          }}
          margin="1rem auto"
        >
          <div className="text-['Lato'] font-[500] text-[18px] leading-[22px] px-8">{t("edit")}</div>
        </ButtonAnt>
      </div>
    </div>
  );
};
