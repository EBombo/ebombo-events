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
    img: "orientacion.png",
    color: "#4FBA6F",
  },
  {
    title: "Onboardings",
    description:
      "Ofrecemos actividades virtuales de capacitación para nuevos trabajadores, pero de una manera super divertida",
    img: "happy-hour.png",
    color: "#FFD15B",
  },
  {
    title: "Juegos",
    description: 'Tenemos varios juegos creados por nosotros como "Bingo, Hangman, Ruletas, Trivias y más"',
    img: "happy-hour.png",
    color: "#FFD15B",
  },
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
      "Ya sea estés celebrando Navidad, Día de la Mujer, Día del Trabajador, Día de la comunidad LGTBI, Aniversarios, Día de la Madre, Día del Padre, Día del Niño y más, contamos con las mejores opciones.",
    img: "dias-festivos.png",
    color: "#E3954E",
  },
  {
    title: "Plan de beneficios",
    description:
      "Por cada actividad que se use, tus trabajadores irán acumulando puntos y luego lo podrán canjear por premios increíbles",
    img: "hielo.png",
    color: "#93D8E4",
  },
  {
    title: "Actividades de clima",
    description: "Realiza actividades para tu equipo de una forma divertida, auténtica e innovadora.",
    img: "clima.png",
    color: "#74829C",
  },
  {
    title: "Premiaciones",
    description: "Hacemos premiaciones para festejar los logros de tus trabajadores",
    img: "corporativos.png",
    color: "#E12AFF",
  },
  {
    title: "Actividades rompe hielo",
    description:
      "Tenemos muchas actividades para fortalecer el clima laboral en la empresa. Realiza divertidas dinámicas para motivar tu equipo   y ayudar a tus compañeros a entenderse más entre ellos. ",
    img: "reuniones.png",
    color: "#7AFFE4",
  },
  {},
  {
    title: "Conecta",
    description:
      "Conectar a tu equipo de manera virtual no tiene porque ser un desafío. Hemos construído actividades innovadoras con tecnología que une personas en cualquier lugar, en cualquier momento y en cualquier ocasión.",
    img: "conecta.png",
    color: "#98B3F9",
  },
];

export const EbomboStyle = (props) => {
  return (
    <EbomboStyleStyled>
      <div className="content">
        <div className="title">El estilo ebombo</div>

        <div className="items">
          {EbomboItems.map((item) => {
            return item?.title ? (
              <ItemStyled color={item.color}>
                <div className="title-item">{item.title}</div>
                <div className="description-item">{item.description}</div>
                <Image
                  src={`${config.storageUrl}/resources/ebombo-style/${item.img}`}
                  width="150px"
                  height="150px"
                  size="content"
                  margin="0"
                  className="image"
                />
              </ItemStyled>
            ) : (
              <div />
            );
          })}
        </div>
      </div>
    </EbomboStyleStyled>
  );
};

const ItemStyled = styled.div`
  height: 350px;
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
    font-size: 17px;
  }

  .image {
    position: absolute;
    bottom: 0;
    left: 0;
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
