import React from "reactn";
import styled from "styled-components";

const EbomboItems = [
  {
    title: "Happy Hour",
    description:
      "Reúne a tu equipo en una happy hour virtual y olvídate de la distancia. Diversión asegurada con o sin bebidas, tú decides.",
    img: "",
  },
  {
    title: "Días festivos",
    description:
      "Ya sea estés celebrando Navidad, el día de la madre, halloween, el día de los muertos, el día del minero o cualquier día festivo, tenemos experiencia para celebrar estas fechas.",
    img: "",
  },
  {
    title: "Actividades rompe hielo",
    description:
      "Tenemos muchas actividades para fortalecer el clima laboral en la empresa. Realiza divertidas dinámicas para motivar tu equipo   y ayudar a tus compañeros a entenderse más entre ellos. ",
    img: "",
  },
  {
    title: "Eventos corporativos",
    description:
      "ebombo crea inolvidables experiencias y momentos íntimos para ti y tus compañeros donde todos puedan ser parte de las actividades y jugar desde su celular nuestros juegos.",
    img: "",
  },
  {
    title: "Reuniones",
    description: "Dale ese toque divertido a tus reuniones de siempre con nuestras actividades virtuales. ",
    img: "",
  },
  {
    title: "Training y Orientación",
    description:
      "Nada como jugar para aprender actividades y tareas importantes. Empieza con el pie derecho con los nuevos contratados, enséñales todo lo que necesitan saber, involúcralos y ténlos enganchados.",
    img: "",
  },
  {
    title: "Conecta",
    description:
      "Conectar a tu equipo de manera virtual no tiene porque ser un desafío. Hemos construído actividades innovadoras con tecnología que une personas en cualquier lugar, en cualquier momento y en cualquier ocasión.",
    img: "",
  },
  {
    title: "Reconocimientos",
    description:
      "Reconoce y premia a tus empleados en un divertido y entretenido evento. Mantén a tus participantes enganchados de una manera que otra plataforma no puede.",
    img: "",
  },
  {
    title: "Actividades de clima",
    description: "Realiza actividades para tu equipo de una forma divertida, auténtica e innovadora.",
    img: "",
  },
];

export const EbomboStyle = (props) => {
  return (
    <EbomboStyleStyled>
      <div className="title">El estilo ebombo</div>

      <div className="items">
        {EbomboItems.map((item) => {
          return (
            <div className="item">
              <div className="title-item">{item.title}</div>
              <div className="description-item">{item.description}</div>
              <div>img</div>
            </div>
          );
        })}
      </div>
    </EbomboStyleStyled>
  );
};

const EbomboStyleStyled = styled.div`
  padding: 1rem 2rem;
  background: linear-gradient(276.15deg, #331e6d 0%, #6646b7 100%);

  .title {
    font-size: xx-large;
    text-align: center;
    color: ${(props) => props.theme.basic.white};
  }

  .items {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }
`;
