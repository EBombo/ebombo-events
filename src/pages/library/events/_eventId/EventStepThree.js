import React, { useState, useGlobal } from "reactn";
import { Image } from "../../../../components/common/Image";
import { Anchor, ButtonAnt } from "../../../../components/form";
import { config } from "../../../../firebase";
import capitalize from "lodash/capitalize";

export const EventStepThree = (props) => {
  const [adminGames] = useGlobal("adminGames");

  const [selectedGames, setSelectedGames] = useState(props.event?.adminGames ?? []);

  const addGame = (game) => {
    if (selectedGames.map((game) => game.id).includes(game.id)) {
      const _games = [...selectedGames];

      const newGames = _games.filter((_game) => game.id !== _game.id);

      return setSelectedGames(newGames);
    }

    setSelectedGames([...selectedGames, game]);
  };

  const validateStepThree = () => {
    props.setEvent({
      ...props.event,
      adminGames: selectedGames,
    });

    props.setCurrentStep(4);
  };

  return (
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        Actividades
      </div>

      <div className="my-4 md:my-8 max-w-[750px] text-['Lato'] font-[400] text-secondary text-[15px] leading-[18px] md:text-[18px] md:leading-[22px]">
        Elige las dinámicas virtuales para tu evento. Una vez agendado el evento, puedes crear los juegos en la ventana
        resumen de tu evento.
      </div>

      <div className="grid gap-4 md:grid-cols-[auto_250px] max-w-[1200px] md:h-[400px]">
        <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,minmax(230px,240px))] md:max-h-[400px] md:overflow-auto">
          {adminGames.map((game) => (
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
          <div className=" text-['Lato] font-[400] text-[18px] leading-[22px] text-secondary">Juegos seleccionados</div>
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
        <Anchor underlined variant="secondary" onClick={() => props.setCurrentStep(1)}>
          Volver
        </Anchor>
        <ButtonAnt onClick={() => validateStepThree()}>Siguiente</ButtonAnt>
      </div>
    </div>
  );
};
