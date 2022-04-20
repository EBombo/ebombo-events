import React, { useGlobal, useState } from "reactn";
import { Anchor, ButtonAnt, TextArea } from "../../../components/form";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import { useTranslation } from "../../../hooks";

export const interactions = [
  {
    icon: "/resources/events/enjoy.svg",
    title: "sit-and-enjoy",
    key: "sit-back-and-enjoy",
  },
  {
    icon: "/resources/events/iteraction.svg",
    title: "lot-interaction",
    key: "lots-of-interaction",
  },
];

export const gifts = [
  {
    icon: "/resources/events/star.svg",
    title: "yes-of-course",
    key: "yes",
  },
  {
    icon: "/resources/events/no-thanks.svg",
    title: "no-thanks",
    key: "no",
  },
];

export const goals = [
  {
    title: "have-fun",
    key: "have-fun",
  },
  {
    title: "celebrate-a-date",
    key: "celebrate-a-date",
  },
  {
    title: "training-onboarding",
    key: "training-onboarding",
  },
  {
    title: "anniversary",
    key: "anniversary",
  },
  {
    title: "relax",
    key: "relax",
  },
  {
    title: "see-a-show",
    key: "see-a-show",
  },
  {
    title: "recognitions",
    key: "recognitions",
  },
  {
    title: "others",
    key: "others",
  },
];

export const DetailsEvent = (props) => {
  const [games] = useGlobal("adminGames");

  const { t } = useTranslation("pages.events");

  const [currentInteraction, setCurrentCurrentInteraction] = useState(props.details?.interaction ?? null);
  const [currentGift, setCurrentCurrentGift] = useState(props.details?.gift ?? null);
  const [currentGoals, setCurrentCurrentGoals] = useState(props.details?.goals ?? []);
  const [currentGames, setCurrentGames] = useState(props.details?.games ?? []);
  const [additional, setAdditional] = useState(props.details?.additional ?? null);

  return (
    <div>
      <div className="text-primary text-4xl mb-6">{t("event-details")}</div>

      <div className="grid md:flex gap-14 mb-4">
        <div>
          <div className="text-secondary mb-4">{t("want-interaction")}</div>

          <div className="grid md:flex gap-2">
            {interactions.map((interaction) => (
              <div
                key={interaction.key}
                onClick={() => setCurrentCurrentInteraction(interaction.key)}
                className={`w-full md:w-52 text-base text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer relative flex ${
                  currentInteraction === interaction.key ? "border-primary" : "border-grayLighten"
                }`}
              >
                <img src={`${config.storageUrl}${interaction.icon}`} className=" w-6 h-6 mx-3" />

                {t(interaction.title)}

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
          <div className="text-secondary mb-4">{t("want-add-gifts")}</div>

          <div className="grid md:flex gap-2">
            {gifts.map((gift) => (
              <div
                key={gift.key}
                onClick={() => setCurrentCurrentGift(gift.key)}
                className={`w-full md:w-52 text-base text-center bg-white rounded-md border-2 py-4 px-1 cursor-pointer relative flex ${
                  currentGift === gift.key ? "border-primary" : "border-grayLighten"
                }`}
              >
                <img src={`${config.storageUrl}${gift.icon}`} className=" w-6 h-6 mx-3" />

                {t(gift.title)}

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
        <div className="text-secondary mb-4">{t("event-objectives")}</div>

        <div className="grid md:grid-cols-4 gap-2">
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
              {t(goal.title)}

              {currentGoals.includes(goal.key) && (
                <img
                  src={`${config.storageUrl}/resources/events/check.svg`}
                  className="absolute top-px right-px w-6 h-6"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="text-secondary mb-4">{t("virtual-dynamic")}</div>

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
          <div className="text-secondary mb-4">{t("additional-comments")}</div>

          <TextArea
            rows={7}
            variant="primary"
            color="black"
            defaultValue={additional}
            onChange={(event) => setAdditional(event.target.value)}
          />
        </div>
      </div>

      <div className="flex mt-4">
        <Anchor
          underlined
          margin="auto 0"
          variant="secondary"
          onClick={() => props.setCurrentTab(props.eventSteps[props.position - 1]?.key)}
        >
          {t("back")}
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

            props.setCurrentTab(props.eventSteps[props.position + 1]?.key);
          }}
          color="primary"
          variant="contained"
          disabled={!currentInteraction || !currentGift || !currentGoals?.length || !currentGames?.length}
          fontSize="18px"
          size="big"
          margin="1rem 0 auto auto"
        >
          {t("next")}
        </ButtonAnt>
      </div>
    </div>
  );
};
