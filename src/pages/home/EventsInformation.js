import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { Desktop, mediaQuery, Tablet } from "../../constants";
import { useTranslation } from "../../hooks";

const items = [
  {
    icon: "star.png",
    title: "pro-hosted",
    description: "pro-hosted",
    image: `${config.storageUrl}/resources/videos-landing/video-5.gif`,
  },
  {
    icon: "user.png",
    title: "self-hosted",
    description: "self-hosted",
    image: `${config.storageUrl}/resources/videos-landing/video-6.gif`,
  },
];

export const EventsInformation = (props) => {
  const [currentItem, setCurrentItem] = useState(0);

  const { t } = useTranslation("landing.information");

  return (
    <EventsInformationStyled>
      <div className="content-information">
        <div className="title">{t("title")}</div>

        <div className="events-content">
          <Tablet>
            <img src={items[currentItem].image} width="100%" height="250px" className="rounded-md" />
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
                  {t(`titles.${item.title}`)}
                </div>
                <div className="description">{t(`descriptions.${item.description}`)}</div>
              </div>
            ))}
          </div>

          <Desktop>
            <img src={items[currentItem].image} width="580px" height="350px" className="rounded-md m-0" />
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
