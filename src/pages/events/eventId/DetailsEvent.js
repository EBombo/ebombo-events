import React, { useGlobal, useState } from "reactn";
import { Anchor, ButtonAnt, TextArea } from "../../../components/form";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";

export const interactions = [
  {
    icon: "/resources/events/enjoy.svg",
    title: "Sentarse y disfrutar",
    key: "sit-back-and-enjoy",
  },
  {
    icon: "/resources/events/iteraction.svg",
    title: "Mucha interacción",
    key: "lots-of-interaction",
  },
];

export const gifts = [
  {
    icon: "/resources/events/star.svg",
    title: "!Sí, claro!",
    key: "yes",
  },
  {
    icon: "/resources/events/no-thanks.svg",
    title: "No, gracias",
    key: "no",
  },
];

export const goals = [
  {
    title: "Divertirnos",
    key: "have-fun",
  },
  {
    title: "Celebrar una fecha",
    key: "celebrate-a-date",
  },
  {
    title: "Training / Onboarding",
    key: "training-onboarding",
  },
  {
    title: "Aniversario",
    key: "anniversary",
  },
  {
    title: "Relajarnos",
    key: "relax",
  },
  {
    title: "Ver un show",
    key: "see-a-show",
  },
  {
    title: "Reconocimientos",
    key: "recognitions",
  },
  {
    title: "Otros",
    key: "others",
  },
];

export const DetailsEvent = (props) => {
  const [games] = useGlobal("adminGames");

  const [currentInteraction, setCurrentCurrentInteraction] = useState(props.details?.Interaction ?? null);
  const [currentGift, setCurrentCurrentGift] = useState(props.details?.Gift ?? null);
  const [currentGoals, setCurrentCurrentGoals] = useState(props.details?.Goals ?? []);
  const [currentGames, setCurrentGames] = useState(props.details?.Games ?? []);
  const [additional, setAdditional] = useState(null);

  return (
    <div>
      <div className="text-primary text-4xl mb-6">Detalles del evento</div>

      <div className="flex gap-5 mb-4">
        <div>
          <div className="text-secondary mb-4">¿Quieres que haya iteracción?</div>

          <div className="flex gap-2">
            {interactions.map((interaction) => (
              <div
                key={interaction.key}
                onClick={() => setCurrentCurrentInteraction(interaction.key)}
                className={`w-52 text-base text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer relative flex ${
                  currentInteraction === interaction.key ? "border-primary" : "border-grayLighten"
                }`}
              >
                <img src={`${config.storageUrl}${interaction.icon}`} className=" w-6 h-6 mx-3" />

                {interaction.title}

                {currentInteraction === interaction.key ? (
                  <img
                    src={`${config.storageUrl}/resources/events/check.svg`}
                    className="absolute top-px right-px w-6 h-6"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">¿Quieres adicionar regalos, premio o algún elemento físico?</div>

          <div className="flex gap-2">
            {gifts.map((gift) => (
              <div
                key={gift.key}
                onClick={() => setCurrentCurrentGift(gift.key)}
                className={`w-52 text-base text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer relative flex ${
                  currentGift === gift.key ? "border-primary" : "border-grayLighten"
                }`}
              >
                <img src={`${config.storageUrl}${gift.icon}`} className=" w-6 h-6 mx-3" />

                {gift.title}

                {currentGift === gift.key ? (
                  <img
                    src={`${config.storageUrl}/resources/events/check.svg`}
                    className="absolute top-px right-px w-6 h-6"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-secondary mb-4">¿Cuáles son los objetivos de tu evento?</div>

        <div className="grid grid-cols-4 gap-2">
          {goals.map((goal) => (
            <div
              key={goal.key}
              onClick={() => {
                if (currentGoals.includes(goal.key)) {
                  const currentGoalsUpdated = currentGoals.filter((goal_) => goal_ !== goal.key);
                  return setCurrentCurrentGoals(currentGoalsUpdated);
                }

                setCurrentCurrentGoals([...currentGoals, goal.key]);
              }}
              className={`text-xl text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer relative ${
                currentGoals.includes(goal.key) ? "border-primary" : "border-grayLighten"
              }`}
            >
              {goal.title}

              {currentGoals.includes(goal.key) ? (
                <img
                  src={`${config.storageUrl}/resources/events/check.svg`}
                  className="absolute top-px right-px w-6 h-6"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-10">
        <div>
          <div className="text-secondary mb-4">¿Cuáles de nuestras dinámicas virtuales quisieras en tu eveno?</div>

          <div className="grid grid-cols-4 gap-2">
            {games
              .filter((game) => !game.isDisabled)
              .map((game) => (
                <div
                  key={game.id}
                  className={`text-center rounded-md shadow-md cursor-pointer ${
                    currentGames.includes(game.id) ? "text-white bg-primary" : ""
                  }`}
                  onClick={() => {
                    if (currentGames.includes(game.id))
                      return setCurrentGames([...currentGames.filter((gameId) => gameId !== game.id)]);

                    setCurrentGames([game.id, ...currentGames]);
                  }}
                >
                  <Image src={game.coverUrl} width="100%" height="4rem" cursor="pointer" borderRadius="10px 10px 0 0" />

                  <div>{game.name}</div>
                </div>
              ))}
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">
            Escribenos comentarios adiciones de tu evento para tenerlos en cuenta
          </div>

          <TextArea rows={7} variant="primary" color="black" onChange={(event) => setAdditional(event.target.value)} />
        </div>
      </div>

      <div className="flex mt-4">
        <Anchor
          underlined
          margin="auto 0"
          variant="secondary"
          onClick={() => props.setCurrentTab(props.eventSteps[props.position - 1].key)}
        >
          Volver
        </Anchor>

        <ButtonAnt
          onClick={() => {
            props.setDetails({
              interaction: currentInteraction,
              gift: currentGift,
              goals: currentGoals,
              games: currentGames,
              additional: additional,
            });

            props.setCurrentTab(props.eventSteps[props.position + 1].key);
          }}
          color="primary"
          variant="contained"
          disabled={!currentInteraction || !currentGift || !currentGoals?.length || !currentGames?.length}
          fontSize="18px"
          size="big"
          margin="1rem 0 auto auto"
        >
          Siguiente
        </ButtonAnt>
      </div>
    </div>
  );
};
