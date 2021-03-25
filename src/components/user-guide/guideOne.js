import {darkTheme} from "../../styles/theme";
import React from "reactn";
import {ACTIONS, EVENTS, STATUS} from "react-joyride";
import {timeoutPromise} from "../../utils";

export const handleGuideOne = async ({
  data,
  setRunGuide,
  openSidebarMobile,
  setOpenSidebarMobile,
  setStepIndex,
  history,
}) => {
  const { action, index, status, type } = data;

  if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
    // Update state to advance the tour
    const stepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

    if (action === ACTIONS.CLOSE) return;
    console.log("index->", index);

    if (index === 3) {
      history.push({
        hash: "#right-menu",
      });
      await timeoutPromise(1500);
    } else {
      history.push({
        hash: "",
      });
      setOpenSidebarMobile(false);
    }

    setStepIndex(stepIndex);
  }
  if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
    // Need to set our running state to false, so we can restart if we click start again.
    setRunGuide(false);
  }

  console.log(data);
};

export const guideOneContent = [
  {
    content: (
      <h2
        style={{
          textAlign: "center",
          color: `${darkTheme.basic.white}`,
          padding: "10px 10px",
          fontSize: "15px",
        }}
      >
        ¡Bienvenido!
        <br />
        Para aprender a jugar en ebombo te recomendamos seguir con este tutorial
      </h2>
    ),
    placement: "center",
    target: "body",
  },
  {
    target: ".first-step",
    title: "Juegos",
    content:
      "Aquí encontrarás los videojuegos con los que puedes jugar en ebombo",
  },
  {
    target: ".second-step",
    title: "Chat",
    content: "Aquí podrás coordinar partidas rápidas con otros jugadores",
  },
  {
    target: ".third-step",
    title: "Salas",
    content:
      "Aquí encontrarás salas creadas por otros usuarios esperándote para jugar o puedes crear tu propia sala con tus reglas y esperar que un rival ingrese",
  },
  {
    target: ".fourth-step",
    title: "Dinero",
    content:
      "Dinero disponible para jugar, puedes jugar con dinero real o con crédito regalado por ebombo.",
  },
  {
    target: ".fifth-step",
    title: "Encuentros",
    content:
      "Aquí podras ver los encuentros que tienes en juego y las invitaciones recibidas de otros jugadores",
  },
];
