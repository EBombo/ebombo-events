import React, { useEffect, useGlobal, useState } from "reactn";
import { Table } from "antd";
import { columns } from "./EventStepTwo";
import { Image } from "../../../../components/common/Image";
import { config, firestore } from "../../../../firebase";
import { gamesFirestore } from "../../../../components/common/DataList";
import capitalize from "lodash/capitalize";
import defaultTo from "lodash/defaultTo";
import { Anchor, ButtonAnt } from "../../../../components/form";
import { useRouter } from "next/router";

export const EventStepFour = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    router.prefetch("/library/events/[eventId]/view");
  }, []);

  const createEvent = async () => {
    setIsLoading(true);

    const eventRef = await firestore.collection("events").doc(props.documentId);

    const event = {
      ...props.event,
      adminGamesIds: props.event?.adminGames.map((game) => game.id),
      id: props.documentId,
      userId: authUser?.id,
      deleted: false,
      manageByUser: true,
    };

    const adminGames = props.event?.adminGames;

    delete event.adminGames;

    if (!eventRef.exist) {
      await eventRef.set({ ...event, createAt: new Date(), updateAt: new Date() });
    }

    if (eventRef.exist) {
      await eventRef.update({ ...event, updateAt: new Date() });
    }

    await createEventGames(event, adminGames);

    const membersPromise = props.members.map(
      async (member) =>
        await firestore
          .collection("events")
          .doc(event.id)
          .collection("members")
          .doc(member.id)
          .set({ ...member, updateAt: new Date() }, { merge: true })
    );

    await Promise.all(membersPromise);

    setIsLoading(false);
    router.push(`/library/events/${props.documentId}/view?manageBy=user`);
  };

  const createEventGames = async (event, adminGames) => {
    const gamesPromises = adminGames.map(async (adminGame) => {
      const currentFirebase = gamesFirestore(adminGame.name);

      const newId = currentFirebase.collection("games").doc().id;

      await currentFirebase
        .collection("games")
        .doc(newId)
        .set(
          {
            name: `Juego ${adminGame.title} sin nombre`,
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
    <div className="w-full flex flex-col items center bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 h-[calc(100vh-180px)] overflow-auto">
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
            {`${props.event?.eventDate} ${props.event?.startAt?.toUpperCase()} ${props.event?.endAt?.toUpperCase()}`}
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
            <Table columns={columns} dataSource={props.members} className="rounded-[6px]" />
          </div>
        </div>
        <div className="flex flex-col md:h-[350px] md:overflow-auto md:overflow-x-hidden">
          <div className="text-secondary text-['Lato'] font-[400] text-[14px] leading-[17px] md:text-[16px] md:leading-[19px] my-2 md:my-4">
            Juegos seleccionados
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

      <div className="flex w-full items-center justify-between">
        <Anchor underlined variant="secondary" onClick={() => props.setCurrentStep(3)}>
          Volver
        </Anchor>
        <ButtonAnt color="success" onClick={() => createEvent()} loading={isLoading} disabled={isLoading}>
          <div className="w-[120px] text-['Lato'] font-[700] text-[18px] leading-[20px] text-blackDarken">Crear</div>
        </ButtonAnt>
      </div>
    </div>
  );
};
