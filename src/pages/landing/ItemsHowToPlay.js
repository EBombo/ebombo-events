import React from "reactn";
import { CardCustom } from "../../components/common";
import styled from "styled-components";
import { config } from "../../firebase";
import { darkTheme } from "../../styles/theme";

const dataHowToPlay = [
  {
    title: "Elige tu juego",
    description:
      "Selecciona tu juego favorito, coloca tus reglas preferidas  y decide el monto que deseas jugar en ebombo.",
    icon: "/resources/mando.svg",
  },
  {
    title: "Encuentra un rival",
    description:
      "Puedes crear una sala con tus propias reglas, entrar a la sala de alguien más para encontrar a un oponente o buscar un rival por el chat.",
    icon: "/resources/vs.svg",
  },
  {
    title: "Sigue estos pasos",
    description:
      "1. Agrega a tu opente al juego que vas a competir \n" +
      "2. Jueguen el encuentro por el monto que tu desees\n" +
      "3. Coloquen los resultados",
    icon: "/resources/steps.svg",
  },
  {
    title: "No te preocupes",
    description:
      "ebombo se encarga de que todos los ganadores reciban su dinero de una manera segura ",
    icon: "/resources/escudo.svg",
  },
];

export const ItemsHowToPlay = () => (
  <ContainerItemCardHowToPlay gridColumns={dataHowToPlay.length}>
    {dataHowToPlay.map((item, index) => (
      <CardCustom
        key={"data-how-to-play" + index + 1}
        borderRadius="11px"
        border="none"
        width="300px"
        height="150px"
        margin="1rem 0.5rem"
        background={darkTheme.basic.blackLighten}
      >
        <div className="content-card">
          <ul>
            <li className="title-card">
              <span>{index + 1}.</span>
              {item.title}
            </li>
            <li className="description-card">
              <p>
                {item.description.split("*").map((description) => (
                  <div key={`key-description-${description}`}>
                    {description}
                  </div>
                ))}
              </p>
            </li>
          </ul>
          <div className="item-icon">
            <img src={`${config.storageUrl + item.icon}`} alt="" />
          </div>
        </div>
      </CardCustom>
    ))}
  </ContainerItemCardHowToPlay>
);

const ContainerItemCardHowToPlay = styled.section`
  width: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(${(props) => props.gridColumns}, auto);

  .content-card {
    display: flex;
    align-items: center;
    justify-content: space-between;

    ul {
      margin: 0;
      padding: 0;
      list-style: none;

      .title-card {
        span {
          color: ${(props) => props.theme.basic.primary};
          margin-right: 5px;
        }

        font-weight: 800;
        font-size: 16px;
      }

      .description-card {
        padding: 1rem 0;

        p {
          font-weight: normal;
          font-size: 10px;
        }
      }
    }

    .item-icon {
      margin: 0.7rem;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 40px;
        height: auto;
        object-fit: cover;
      }
    }
  }
`;
