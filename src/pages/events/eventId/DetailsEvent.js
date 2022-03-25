import React, { useState } from "reactn";
import { Anchor, ButtonAnt, TextArea } from "../../../components/form";

const interactions = [
  {
    title: "Sentarse y disfrutar",
    key: "sit back and enjoy",
  },
  {
    title: "Mucha interacción",
    key: "lots of interaction",
  },
];

const gifts = [
  {
    title: "!Sí, claro!",
    key: "yes",
  },
  {
    title: "No, gracias",
    key: "no",
  },
];

const goals = [
  {
    title: "Divertirnos",
    key: "have fun",
  },
  {
    title: "Celebrar una fecha",
    key: "celebrate a date",
  },
  {
    title: "Training / Onboarding",
    key: "training / onboarding",
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
    key: "see a show",
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
  const [currentInteraction, setCurrentCurrentInteraction] = useState(null);
  const [currentGift, setCurrentCurrentGift] = useState(null);
  const [currentGoals, setCurrentCurrentGoals] = useState([]);

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
                className={`text-1xl text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer ${
                  currentInteraction === interaction.key ? "border-primary" : "border-grayLighten"
                }`}
              >
                {interaction.title}
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
                className={`text-1xl text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer ${
                  currentGift === gift.key ? "border-primary" : "border-grayLighten"
                }`}
              >
                {gift.title}
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
              className={`text-1xl text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer ${
                currentGoals.includes(goal.key) ? "border-primary" : "border-grayLighten"
              }`}
            >
              {goal.title}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-10">
        <div>
          <div className="text-secondary mb-4">¿Cuáles de nuestras dinámicas virtuales quisieras en tu eveno?</div>
          <div className="grid grid-cols-4 gap-2">
            <div>game1</div>
            <div>game2</div>
            <div>game3</div>
            <div>game4</div>
            <div>game1</div>
            <div>game2</div>
            <div>game3</div>
            <div>game4</div>
            <div>....</div>
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">
            Escribenos comentarios adiciones de tu evento para tenerlos en cuenta
          </div>
          <TextArea rows={7} variant="primary" />
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
          onClick={() => props.setCurrentTab(props.eventSteps[props.position + 1].key)}
          color="primary"
          disabled={!props.budget}
          variant="contained"
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
