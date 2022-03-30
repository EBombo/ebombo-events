import React, { useGlobal, useState } from "reactn";
import { Anchor, ButtonAnt, Input, TextArea } from "../../../components/form";
import { config } from "../../../firebase";
import { gifts, goals, interactions } from "./DetailsEvent";
import get from "lodash/get";

const eventBy = {
  participants: "asistente",
  events: "evento",
};

export const ResumeEvent = (props) => {
  const [games] = useGlobal("adminGames");

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <div className="text-secondary mb-4 text-base">
        Manda tu resumen al equipo de ebombo y nos pondremos lo antes posible en contacto contigo
      </div>

      <div className="text-primary text-4xl mb-6">Resumen de tu evento</div>

      <div className="grid md:grid-cols-2 gap-5 mb-4">
        <div className="block">
          <div className="w-full grid md:flex gap-4 mb-4">
            <div className="w-full text-base text-center bg-white rounded-md border-2 border-grayLighten py-4 px-1 grid grid-cols-[1fr_4fr]">
              <img src={`${config.storageUrl}/resources/events/user.svg`} className=" w-6 h-6 mx-3" />

              <div>
                {props.size} {eventBy.participants}s
              </div>
            </div>

            <div className="w-full text-base text-center bg-white rounded-md border-2 border-grayLighten py-4 px-1 grid grid-cols-[1fr_4fr]">
              <img src={`${config.storageUrl}/resources/events/event.svg`} className=" w-6 h-6 mx-3" />
              {props.budget.budget} por {eventBy[props.budget.currentTab]}
            </div>
          </div>

          <div className="w-full h-auto rounded-md border-2 border-grayLighten py-4 px-1 grayLighten px-3">
            <div className="grid grid-cols-2">
              <div>
                <div className="text-secondary">Detalles</div>
                <div className="text-xl text-secondary">
                  {interactions.find((interaction) => interaction.key === props.details.interaction)?.title}
                </div>
              </div>

              <div>
                <div className="text-secondary">Regalo/Premio/Elemento fisico</div>
                <div className="text-xl text-secondary">
                  {gifts.find((gift) => gift.key === props.details.gift)?.title}
                </div>
              </div>
            </div>

            {goals
              .filter((goal) => props.details.goals.includes(goal.key))
              .map((goal) => (
                <div key={goal.title} className="flex text-secondary">
                  <div className="bg-primary w-2 h-2 mt-2 mr-2 ml-4 rounded-md" /> {goal.title}
                </div>
              ))}
          </div>
        </div>

        <div>
          <div className="text-secondary mb-4">Comentarios adicionales</div>
          <TextArea rows={7} disabled variant="primary" defaultValue={props.details.additional} />
        </div>
      </div>

      <div className="text-secondary mb-4 text-base">Fechas tentativas</div>

      <div className="grid md:flex gap-3">
        {props.dates.map((date) => (
          <div
            key={date.id}
            className="w-full md:w-[200px] text-base text-center bg-white rounded-md border-2 border-grayLighten py-2 px-1 mb-4"
          >
            <div className="text-secondary font-bold">{date.month.format("DD MMMM YYYY")}</div>
            <div className="text-secondary">
              {date.start.format("h:mm a")} - {date.end.format("h:mm a")}
            </div>
          </div>
        ))}
      </div>

      <div className="text-secondary mb-4 text-base mt-4">Dinamicas escogidas</div>

      <div className="grid md:flex gap-3">
        {games
          .filter((game) => props.details.games.includes(game.id))
          .map((game) => (
            <div
              key={game.id}
              className="w-full md:w-[300px] text-base bg-white rounded-md border-2 border-grayLighten py-2 px-1 mb-4 grid grid-cols-[1fr_3fr]"
            >
              <img
                src={`${config.storageUrl}/resources/games/${get(game, "name", "")}-icon.svg`}
                className=" w-6 h-6 mx-3"
              />

              {game.name}
            </div>
          ))}
      </div>

      <div className="text-secondary mb-4 text-base mt-4">Regístrate y manda el resumen de tu evento</div>

      <div className="grid md:grid-cols-2 gap-2 md:w-9/12">
        <Input placeholder="Nombre" onChange={(event) => setName(event.target.value)} />
        <Input placeholder="Apellidos" onChange={(event) => setLastName(event.target.value)} />
        <Input placeholder="Correo" onChange={(event) => setEmail(event.target.value)} />
        <Input placeholder="Contraseña" type="password" onChange={(event) => setPassword(event.target.value)} />
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
            // TODO: Enviar los datos del registro a la API que Sebas envia.
            /*
            {
              size: props.size,
              budget: props.budget,
              details: props.details,
              dates: props.dates,
              resume: props.resume,
            }
             */
            props.setRegister({
              name: name,
              lastName: lastName,
              email: email,
              password: password,
            });
            props.setResume(true);
            props.setCurrentTab(props.eventSteps[props.position + 1].key);
          }}
          color="primary"
          variant="contained"
          fontSize="18px"
          size="big"
          margin="1rem 0 auto auto"
        >
          Enviar
        </ButtonAnt>
      </div>
    </div>
  );
};
