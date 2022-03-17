import React from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { mediaQuery } from "../../constants";

const EbomboItems = [
  {
    title: "Training y Orientación",
    description:
      "Ayudamos a que tus trabajadores tengan entrenamientos para conocer más temas técnicos de una manera super divertida y que permite tener una alta tasa de engagement.",
    img: "orientacion.svg",
    color: "#4FBA6F",
  },
  {
    title: "Onboardings",
    description:
      "Ofrecemos actividades virtuales de capacitación para nuevos trabajadores, pero de una manera super divertida",
    img: "onboarding.svg",
    color: "#FFD15B",
  },
  {
    title: "Juegos",
    description: 'Tenemos varios juegos creados por nosotros como "Bingo, Hangman, Ruletas, Trivias y más"',
    img: "games.svg",
    color: "#FFD15B",
  },
  {
    title: "Happy Hour",
    description:
      "Reúne a tu equipo en una happy hour virtual y olvídate de la distancia. Diversión asegurada con o sin bebidas, tú decides.",
    img: "happy-hour.svg",
    color: "#FFD15B",
  },
  {
    title: "Días festivos",
    description:
      "Ya sea estés celebrando Navidad, Día de la Mujer, Día del Trabajador, Día de la comunidad LGTBI, Aniversarios, Día de la Madre, Día del Padre, Día del Niño y más, contamos con las mejores opciones.",
    img: "dias-festivos.svg",
    color: "#E3954E",
  },
  {
    title: "Plan de beneficios",
    description:
      "Por cada actividad que se use, tus trabajadores irán acumulando puntos y luego lo podrán canjear por premios increíbles",
    img: "beneficios.svg",
    color: "#93D8E4",
  },
  {
    title: "Actividades de clima",
    description: "Realiza actividades para tu equipo de una forma divertida, auténtica e innovadora.",
    img: "clima.svg",
    color: "#74829C",
  },
  {
    title: "Premiaciones",
    description: "Hacemos premiaciones para festejar los logros de tus trabajadores",
    img: "premiacion.svg",
    color: "#E12AFF",
  },
  {
    title: "Actividades rompe hielo",
    description:
      "Tenemos muchas actividades para fortalecer el clima laboral en la empresa. Realiza divertidas dinámicas para motivar tu equipo   y ayudar a tus compañeros a entenderse más entre ellos. ",
    img: "hielo.svg",
    color: "#7AFFE4",
  },
  {}, // This is necessary for center item.
  {
    title: "Conecta",
    description:
      "Conectar a tu equipo de manera virtual no tiene porque ser un desafío. Hemos construído actividades innovadoras con tecnología que une personas en cualquier lugar, en cualquier momento y en cualquier ocasión.",
    img: "conecta.svg",
    color: "#98B3F9",
  },
];

export const EbomboStyle = (props) => {
  return (
    <EbomboStyleStyled>
      <div className="content">
        <div className="title">Al estilo ebombo</div>

        <div className="items">
          {EbomboItems.map((item, index) => {
            return item?.title ? (
              <ItemStyled color={item.color} key={`${item.title}-${index}`}>
                <div className="title-item">{item.title}</div>
                <div className="description-item">{item.description}</div>
                <Image
                  src={`${config.storageUrl}/resources/ebombo-style/${item.img}`}
                  width="100%"
                  height="200px"
                  size="content"
                  className="image"
                />
              </ItemStyled>
            ) : (
              <div key={index} />
            );
          })}
        </div>
      </div>
    </EbomboStyleStyled>
  );
};

const ItemStyled = styled.div`
  padding: 20px 30px;
  border-radius: 5px;
  position: relative;
  border-top: 5px solid ${(props) => props.color};
  background: ${(props) => props.theme.basic.white};

  .title-item {
    margin: 10px 0;
    font-size: 20px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.primary};
  }

  .description-item {
    height: 150px;
    font-size: 17px;
  }

  .image {
    background-position-x: left;
    background-position-y: bottom;
  }
`;

const EbomboStyleStyled = styled.div`
  padding: 3rem 2rem;
  background: linear-gradient(276.15deg, #331e6d 0%, #6646b7 100%);

  .content {
    ${mediaQuery.afterTablet} {
      margin: auto;
      max-width: 80vw;
    }

    .title {
      text-align: center;
      margin-bottom: 3rem;
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
  }
`;
