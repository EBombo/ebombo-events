import React, { useEffect, useGlobal, useState } from "reactn";
import { Table } from "antd";
import { gamesFirestore, tableEventsColumns } from "../../../../components/common/DataList";
import { Image } from "../../../../components/common/Image";
import { config, firestore } from "../../../../firebase";
import capitalize from "lodash/capitalize";
import defaultTo from "lodash/defaultTo";
import { Anchor, ButtonAnt, Switch } from "../../../../components/form";
import { useRouter } from "next/router";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import { useSendError, useTranslation } from "../../../../hooks";
import get from "lodash/get";
import { useFetch } from "../../../../hooks/useFetch";
import { gaEvent } from "../../../../utils";

export const EventStepFour = (props) => {
  const router = useRouter();

  const { eventId } = router.query;

  const { t } = useTranslation("pages.library.event");
  const { sendError } = useSendError();
  const { Fetch } = useFetch();

  const [authUser] = useGlobal("user");
  const [isBdev] = useGlobal("isBdev");
  const [games] = useGlobal("userGames");

  const [isLoading, setIsLoading] = useState(false);
  const [eventGames, setEventGames] = useState([]);
  const [sendEmail, setSendEmail] = useState(true);

  useEffect(() => {
    router.prefetch("/library/events/[eventId]/view");
  }, []);

  useEffect(() => {
    const _eventGames = defaultTo(games, []).filter((game) => game.eventId === eventId);

    setEventGames(_eventGames);
  }, [eventId, games]);

  const createEvent = async () => {
    try {
      setIsLoading(true);

      const newEvent = {
        ...props.event,
        adminGamesIds: props.event?.adminGames.map((game) => game.id),
        id: props.documentId,
        userId: authUser?.id,
        deleted: false,
        manageByUser: true,
        sendEmail,
        members: props.members,
        isBdev,
      };

      const adminGames = newEvent?.adminGames;

      delete newEvent.adminGames;

      const { error } = await Fetch(
        eventId === "new" ? `${config.serverUrl}/api/events` : `${config.serverUrl}/api/events/${newEvent.id}`,
        eventId === "new" ? "POST" : "PUT",
        newEvent
      );

      if (error) throw get(error, "message", "ha ocurrido un problema");

      delete newEvent.members;

      await createEventGames(newEvent, adminGames);

      props.fetchGames();

      const membersPromise = props.members.map(
        async (member) =>
          await firestore
            .collection("events")
            .doc(newEvent.id)
            .collection("members")
            .doc(member.id)
            .set({ ...member, updateAt: new Date() }, { merge: true })
      );

      await Promise.all(membersPromise);

      /** Google event. **/
      gaEvent("user", "create-event", "create-event-manage-by-user");

      await router.push(`/library/events/${props.documentId}/view?manageBy=user`);
    } catch (error) {
      await sendError(error, "createEvent");
    } finally {
      setIsLoading(false);
    }
  };

  const createEventGames = async (event, adminGames) => {
    const adminGamesIds = adminGames.map((adminGame) => adminGame.id);

    let newAdminGames = [...adminGames];

    const deletePromise = eventGames.map(async (game) => {
      let currentFirestore = gamesFirestore(game?.adminGame?.name);

      if (adminGamesIds.includes(game.adminGame?.id))
        return (newAdminGames = newAdminGames.filter((adminGame) => adminGame.id !== game.adminGame?.id));

      await currentFirestore.collection("games").doc(game.id).update({
        deleted: true,
      });
    });

    await Promise.all(deletePromise);

    const gamesPromises = newAdminGames.map(async (adminGame) => {
      const currentFirebase = gamesFirestore(adminGame.name);

      const newId = currentFirebase.collection("games").doc().id;

      await currentFirebase
        .collection("games")
        .doc(newId)
        .set(
          {
            name: props.event?.name,
            deleted: false,
            user: authUser,
            usersIds: [authUser?.id],
            createAt: new Date(),
            updateAt: new Date(),
            id: newId,
            eventId: event.id,
            adminGame,
          },
          { merge: true }
        );
    });

    await Promise.all(gamesPromises);
  };

  return (
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        {t("step-four.name")}
      </div>

      <div className="w-full overflow-auto">
        <div className="grid max-w-[1200px] gap-4 items-start md:grid-cols-[400px_500px_200px]">
          <div className="w-full flex flex-col">
            <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
              {t("step-four.title")}
            </div>
            <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] md:text-[18px] md:leading-[22px]">
              {props.event?.name}
            </div>
            <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
              {t("step-four.date")}
            </div>
            <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] md:text-[18px] md:leading-[22px]">
              {`${moment(props.event?.currentDate?.month).format("D MMMM yyyy")} ${moment(
                props.event?.currentDate?.start
              ).format("hh:mm a")} - ${moment(props.event?.currentDate?.end).format("hh:mm a")}`}
            </div>
            {!isEmpty(props.event?.link) && (
              <>
                <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
                  {t("step-four.link")}
                </div>
                <div className="text-secondary text-['Lato'] font-[700] text-[16px] leading-[20px] md:text-[18px] md:leading-[22px] break-words ">
                  {props.event?.link}
                </div>
              </>
            )}

            <div className="text-blackDarken text-['Lato'] font-[700] text-[14px] leading-[16px] md:text-[16px] md:leading-[18px] my-2 md:my-4">
              {t("step-four.email-label")}
            </div>
            <div>
              <Switch
                variant="switcher"
                size="medium"
                type="checkbox"
                label1="OFF"
                label2="ON"
                defaultChecked={sendEmail}
                onChange={(event) => {
                  event.preventDefault();
                  setSendEmail(!sendEmail);
                }}
              />
            </div>
          </div>
          <div className="w-full overflow-auto">
            <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
              {t("step-two.name")}
            </div>
            <div className="min-w-[500px]">
              <Table columns={tableEventsColumns(t)} dataSource={props.members} className="rounded-[6px]" />
            </div>
          </div>
          <div className="flex flex-col md:h-[350px] md:overflow-auto md:overflow-x-hidden">
            <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
              {t("step-three.subtitle-one")}
            </div>
            {defaultTo(props.event?.adminGames, []).map((game, index) => (
              <div
                className="bg-white rounded-[6px] flex items-center p-2 border-grayLighten border-[2px] w-[170px] my-2"
                key={`${game.id}-${index}`}
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
      </div>
      <div className="flex w-full items-center justify-between mt-4">
        <Anchor underlined variant="secondary" onClick={() => props.setCurrentStep(3)}>
          {t("step-two.go-back")}
        </Anchor>
        <ButtonAnt color="success" onClick={() => createEvent()} loading={isLoading} disabled={isLoading}>
          <div className="w-[120px] text-['Lato'] font-[700] text-[18px] leading-[20px] text-blackDarken">
            {eventId === "new" ? t("step-four.create") : t("step-four.save-changes")}
          </div>
        </ButtonAnt>
      </div>
    </div>
  );
};
