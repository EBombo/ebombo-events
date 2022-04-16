import React from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { mediaQuery } from "../../constants";
import { useTranslation } from "../../hooks";

const EbomboItems = [
  {
    title: "training-and-orientation",
    description: "training-and-orientation",
    img: "orientacion.svg",
    color: "#4FBA6F",
  },
  {
    title: "onboardings",
    description: "onboardings",
    img: "onboarding.svg",
    color: "#FFD15B",
  },
  {
    title: "activities",
    description: "games",
    img: "games.svg",
    color: "#FFD15B",
  },
  {
    title: "happy-hour",
    description: "happy-hour",
    img: "happy-hour.svg",
    color: "#FFD15B",
  },
  {
    title: "holidays",
    description: "holidays",
    img: "dias-festivos.svg",
    color: "#E3954E",
  },
  {
    title: "benefit-plan",
    description: "benefit-plan",
    img: "beneficios.svg",
    color: "#93D8E4",
  },
  {
    title: "weather-activities",
    description: "weather-activities",
    img: "clima.svg",
    color: "#74829C",
  },
  {
    title: "awards",
    description: "awards",
    img: "premiacion.svg",
    color: "#E12AFF",
  },
  {
    title: "icebreaker-activities",
    description: "icebreaker-activities",
    img: "hielo.svg",
    color: "#7AFFE4",
  },
  {}, // This is necessary for center item.
  {
    title: "connect",
    description: "connect",
    img: "conecta.svg",
    color: "#98B3F9",
  },
];

export const EbomboStyle = (props) => {
  const { t } = useTranslation("landing.style");

  return (
    <EbomboStyleStyled>
      <div className="content">
        <div className="title">{t("title")}</div>

        <div className="items">
          {EbomboItems.map((item, index) =>
            item?.title ? (
              <ItemStyled color={item.color} key={`item-styled-${index}`}>
                <div className="title-item">{t(`items.titles.${item.title}`)}</div>

                <div className="description-item">{t(`items.descriptions.${item.description}`)}</div>

                <Image
                  src={`${config.storageUrl}/resources/ebombo-style/${item.img}`}
                  width="100%"
                  height="200px"
                  size="content"
                  className="image"
                />
              </ItemStyled>
            ) : (
              <div key={`item-styled-${index}`} />
            )
          )}
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
