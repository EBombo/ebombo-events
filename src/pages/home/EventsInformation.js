import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { Desktop, mediaQuery, Tablet } from "../../constants";

const items = [
  {
    icon: "star.png",
    title: "Pro Hosted",
    description:
      "Déjalo en manos de un miembro del equipo de Customer Success de ebombo. Además, un animador elite o VIP dirigirá tu evento en vivo que unirá a tu equipo en una experiencia colaborativa y divertida.",
  },
  {
    icon: "user.png",
    title: "Self hosted",
    description:
      "Es tu momento. Lo hemos hecho fácil e intuitivo para que tú u otra persona de tu equipo sea quien cree y dirija las actividades virtuales que ebombo ofrece. ",
  },
];

export const EventsInformation = (props) => {
  const [currentItem, setCurrentItem] = useState(0);

  return (
    <EventsInformationStyled>
      <div className="content-information">
        <div className="title">Dirige como quieras las dinámicas virtuales</div>

        <div className="events-content">
          <Tablet>
            <Image
              src={`${config.storageUrl}/resources/video-lading.gif`}
              width="100%"
              height="250px"
              desktopHeight="450px"
              size="contain"
            />
          </Tablet>
          <div className="items">
            {items.map((item, index) => (
              <div
                key={item.title}
                onClick={() => setCurrentItem(index)}
                className={`item ${currentItem === index ? "active" : ""}`}
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

          <Desktop>
            <Image
              src={`${config.storageUrl}/resources/video-lading.gif`}
              margin="0"
              width="580px"
              height="350px"
              size="cover"
            />
          </Desktop>
        </div>
      </div>
    </EventsInformationStyled>
  );
};

const EventsInformationStyled = styled.div`
  padding: 3rem 1.5rem;
  background: linear-gradient(270deg, #1d1138 0%, #331e6d 31.25%, #1e1239 100%);

  .content-information {
    margin: auto;

    ${mediaQuery.afterTablet} {
      max-width: 70vw;
    }

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 15px;
      text-align: center;
      color: ${(props) => props.theme.basic.white};

      ${mediaQuery.afterTablet} {
        font-size: 25px;
        text-align: left;
      }
    }

    .events-content {
      display: grid;
      grid-gap: 10px 25px;

      ${mediaQuery.afterTablet} {
        grid-template-columns: 1fr 1.5fr;
      }

      .items {
        .item {
          margin: 5px 0;
          cursor: pointer;
          padding: 15px 10px;
          border-radius: 5px;
          color: ${(props) => props.theme.basic.white};

          .title-item {
            font-size: 1rem;
            font-weight: bold;
            display: inline-flex;
          }

          .description {
            font-size: 15px;
          }
        }

        .active {
          background: ${(props) => props.theme.basic.primaryDark};
        }
      }
    }
  }
`;
