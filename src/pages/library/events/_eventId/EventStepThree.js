import React, { useEffect, useGlobal, useState } from "reactn";
import { Image } from "../../../../components/common/Image";
import { Anchor, ButtonAnt } from "../../../../components/form";
import { config } from "../../../../firebase";
import capitalize from "lodash/capitalize";
import isEmpty from "lodash/isEmpty";
import { useTranslation } from "../../../../hooks";

export const EventStepThree = (props) => {
  const { t } = useTranslation("pages.library.event");

  const [adminGames] = useGlobal("adminGames");

  const [selectedGames, setSelectedGames] = useState([]);

  useEffect(() => {
    if (!props.event?.adminGamesIds) return;

    setSelectedGames(adminGames.filter((game) => props.event.adminGamesIds.includes(game.id)));
  }, [props.event]);

  useEffect(() => {
    if (!props.event?.adminGames) return;

    setSelectedGames(adminGames.filter((game) => props.event.adminGames.map((game) => game.id).includes(game.id)));
  }, [props.event]);

  const addGame = (game) => {
    if (selectedGames.map((game) => game.id).includes(game.id)) {
      const _games = [...selectedGames];

      const newGames = _games.filter((_game) => game.id !== _game.id);

      return setSelectedGames(newGames);
    }

    setSelectedGames([...selectedGames, game]);
  };

  const validateStepThree = () => {
    if (isEmpty(selectedGames)) return props.showNotification("Error", "Debe seleccionar al menos 1 juego");

    props.setEvent({
      ...props.event,
      adminGames: selectedGames,
    });

    props.setCurrentStep(4);
  };

  return (
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        {t("step-three.name")}
      </div>

      <div className="my-4 md:my-8 max-w-[750px] text-['Lato'] font-[400] text-secondary text-[15px] leading-[18px] md:text-[18px] md:leading-[22px]">
        {t("step-three.description")}
      </div>

      <div className="grid gap-4 md:grid-cols-[auto_250px] max-w-[1200px] md:h-[400px]">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(230px,240px))] md:max-h-[400px] md:overflow-auto">
          {adminGames
            .filter((game) => !game.isDisabled)
            .map((game) => (
              <div
                className="h-[135px] w-full flex flex-col rounded-[6px] overflow-hidden cursor-pointer"
                onClick={() => addGame(game)}
                key={game.id}
              >
                <Image src={game.coverUrl} height="100px" width="100%" size="cover" margin="0" cursor="pointer" />
                <div
                  className={`w-full ${
                    selectedGames.map((game) => game.id).includes(game.id)
                      ? "bg-primary text-white"
                      : "bg-white text-secondary"
                  } text-['Lato] font-[700] text-[15px] leading-[18px] p-2 text-center`}
                >
                  {game.title}
                </div>
              </div>
            ))}
        </div>

        <div className="flex flex-col gap-4 md:max-h-[350px] md:overflow-y-auto md:overflow-x-hidden">
          <div className=" text-['Lato] font-[400] text-[18px] leading-[22px] text-secondary">
            {t("step-three.subtitle-one")}
          </div>
          {selectedGames.map((game) => (
            <div
              className="bg-white rounded-[6px] flex items-center p-2 border-grayLighten border-[2px] w-[170px]"
              key={game.id}
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
        <Anchor underlined variant="secondary" onClick={() => props.setCurrentStep(2)}>
          {t("step-two.go-back")}
        </Anchor>
        <ButtonAnt onClick={() => validateStepThree()}>{t("step-two.next")}</ButtonAnt>
      </div>
    </div>
  );
};
