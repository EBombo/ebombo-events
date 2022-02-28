import React from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { mediaQuery } from "../../constants";

const EbomboItems = [
  {
    title: "Happy Hour",
    description:
      "Reúne a tu equipo en una happy hour virtual y olvídate de la distancia. Diversión asegurada con o sin bebidas, tú decides.",
    img: "happy-hour.png",
    color: "#FFD15B",
  },
  {
    title: "Días festivos",
    description:
      "Ya sea estés celebrando Navidad, el día de la madre, halloween, el día de los muertos, el día del minero o cualquier día festivo, tenemos experiencia para celebrar estas fechas.",
    img: "dias-festivos.png",
    color: "#E3954E",
  },
  {
    title: "Actividades rompe hielo",
    description:
      "Tenemos muchas actividades para fortalecer el clima laboral en la empresa. Realiza divertidas dinámicas para motivar tu equipo   y ayudar a tus compañeros a entenderse más entre ellos. ",
    img: "hielo.png",
    color: "#93D8E4",
  },
  {
    title: "Eventos corporativos",
    description:
      "ebombo crea inolvidables experiencias y momentos íntimos para ti y tus compañeros donde todos puedan ser parte de las actividades y jugar desde su celular nuestros juegos.",
    img: "corporativos.png",
    color: "#E12AFF",
  },
  {
    title: "Reuniones",
    description: "Dale ese toque divertido a tus reuniones de siempre con nuestras actividades virtuales. ",
    img: "reuniones.png",
    color: "#7AFFE4",
  },
  {
    title: "Training y Orientación",
    description:
      "Nada como jugar para aprender actividades y tareas importantes. Empieza con el pie derecho con los nuevos contratados, enséñales todo lo que necesitan saber, involúcralos y ténlos enganchados.",
    img: "orientacion.png",
    color: "#4FBA6F",
  },
  {
    title: "Conecta",
    description:
      "Conectar a tu equipo de manera virtual no tiene porque ser un desafío. Hemos construído actividades innovadoras con tecnología que une personas en cualquier lugar, en cualquier momento y en cualquier ocasión.",
    img: "conecta.png",
    color: "#98B3F9",
  },
  {
    title: "Reconocimientos",
    description:
      "Reconoce y premia a tus empleados en un divertido y entretenido evento. Mantén a tus participantes enganchados de una manera que otra plataforma no puede.",
    img: "reconocimiento.png",
    color: "#EE4541",
  },
  {
    title: "Actividades de clima",
    description: "Realiza actividades para tu equipo de una forma divertida, auténtica e innovadora.",
    img: "clima.png",
    color: "#74829C",
  },
];

export const EbomboStyle = (props) => {
  return (
    <EbomboStyleStyled>
      <div className="title">El estilo ebombo</div>

      <div className="items">
        {EbomboItems.map((item) => {
          return (
            <ItemStyled color={item.color}>
              <div className="title-item">{item.title}</div>
              <div className="description-item">{item.description}</div>
              <Image
                src={`${config.storageUrl}/resources/ebombo-style/${item.img}`}
                width="150px"
                height="150px"
                size="content"
                margin="0"
              />
            </ItemStyled>
          );
        })}
      </div>
    </EbomboStyleStyled>
  );
};

const ItemStyled = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  border-top: 5px solid ${(props) => props.color};
  background: ${(props) => props.theme.basic.white};

  .title-item {
    margin: 10px 0;
    font-weight: bold;
    color: ${(props) => props.theme.basic.primary};
  }
`;

const EbomboStyleStyled = styled.div`
  padding: 1rem 2rem;
  background: linear-gradient(276.15deg, #331e6d 0%, #6646b7 100%);
  padding-bottom: 1rem;

  .title {
    margin: 2rem 0;
    text-align: center;
    font-size: xx-large;
    color: ${(props) => props.theme.basic.white};
  }

  .items {
    display: grid;
    grid-gap: 25px;
    grid-template-columns: 1fr;

    ${mediaQuery.afterTablet} {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
`;
