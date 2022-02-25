import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { mediaQuery } from "../../constants";

const items = [
  {
    icon: "star.png",
    title: "Animado",
    description:
      "Déjalo en manos un profesional. Un animador elite o VIP dirigirá tu evento en vivo que unirá a tu equipo en una experiencia colaborativa y divertida.",
  },
  {
    icon: "user.png",
    title: "Piloto",
    description:
      "Es tu momento. Lo hemos hecho fácil e intuitivo para que tú u otra persona del equipo sea quien dirija las dinámicas, juegos y actividades en grupo.",
  },
];

export const EventsInformation = (props) => {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <EventsInformationStyled>
      <div className="title">Dirige como quieras las dinámicas virtuales</div>

      <div className="events-content">
        <div className="items">
          {items.map((item, index) => (
            <div
              className={`item ${currentItem === index ? "active" : ""}`}
              key={item.title}
              onClick={() => setCurrentItem(index)}
            >
              <div className="title-item">
                <Image
                  src={`${config.storageUrl}/resources/icons/${item.icon}`}
                  width="20px"
                  height="20px"
                  size="contain"
                  margin="0 8px 0 0"
                />
                {item.title}
              </div>
              <div className="description">{item.description}</div>
            </div>
          ))}
        </div>

        <div>
          <Image
            src={`${config.storageUrl}/resources/video-lading.gif`}
            width="100%"
            height="250px"
            desktopHeight="450px"
            size="contain"
          />
        </div>
      </div>
    </EventsInformationStyled>
  );
};

const EventsInformationStyled = styled.div`
  padding: 2rem 1.5rem;
  background: linear-gradient(270deg, #1d1138 0%, #331e6d 31.25%, #1e1239 100%);

  .title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 15px;
    color: ${(props) => props.theme.basic.white};
  }

  .events-content {
    display: grid;
    grid-gap: 10px;
    cursor: pointer;

    ${mediaQuery.afterTablet} {
      grid-template-columns: 1fr 2fr;
    }

    .items {
      .item {
        margin: 5px 0;
        padding: 15px 10px;
        border-radius: 5px;
        color: ${(props) => props.theme.basic.white};

        .title-item {
          font-size: 1rem;
          font-weight: bold;
          display: inline-flex;
        }

        .description {
          font-size: 0.7rem;
        }
      }

      .active {
        background: ${(props) => props.theme.basic.primaryDark};
      }
    }
  }
`;
