import React, { useEffect } from "react";
import { Carousel, Layout } from "antd";
import { useHistory } from "react-router-dom";
import { useGlobal, useRef } from "reactn";
import styled from "styled-components";
import { LandingGames } from "./Games";
import { Container } from "../../components/common/Container";
import { mediaQuery } from "../../styles/constants";
import { SliderContainer } from "./SliderContainer";
import { CardItem } from "./CardItem";
import { ItemsHowToPlay } from "./ItemsHowToPlay";
import { ContentAchievements } from "./ContentAchievements";
import { TipsForNew } from "./TipsForNew";
import { ContentSectionContact } from "./ContentSectionContact";
import { ContentSuggestions } from "./ContentSuggestions";
import isEmpty from "lodash/isEmpty";

export const Landing = (props) => {
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [landing] = useGlobal("landing");

  useEffect(() => {
    authUser && history.push("/games");
  }, [authUser]); //eslint-disable-line react-hooks/exhaustive-deps

  const currentElement = (elementType) =>
    landing.filter((landing) => landing.elementType === elementType);

  return (
    <Layout>
      {!isEmpty(currentElement("slider")) && (
        <ContainerItemSlider>
          <SliderContainer slider={currentElement("slider")[0]} />
        </ContainerItemSlider>
      )}

      {!isEmpty(currentElement("first-section")) && (
        <ContainerFirstSection>
          <section className="content-cards-items">
            {currentElement("first-section").map((card, index) => (
              <CardItem
                key={"key-first-section-" + index + 1}
                numItem={index + 1}
                card={card}
              />
            ))}
          </section>
        </ContainerFirstSection>
      )}

      <ContainerHowToPlay>
        <div className="content-items-how-to-play">
          <div className="item-title">¿Cómo jugar?</div>
          <ItemsHowToPlay />
        </div>
      </ContainerHowToPlay>

      <LandingGames />

      <ContentAchievements />

      <TipsForNew />

      <ContentSuggestions />

      <ContentSectionContact />
    </Layout>
  );
};

const ContainerHowToPlay = styled(Container)`
  background: ${(props) => props.theme.basic.blackDarken};
  color: ${(props) => props.theme.basic.white};
  padding: 1rem;

  ${mediaQuery.afterTablet} {
    padding: 3rem 2.5rem;
  }

  .content-items-how-to-play {
    width: 100%;
    text-align: left;

    .item-title {
      text-align: center;
      font-weight: 500;
      padding-left: 0;
      padding-bottom: 1rem;
      font-size: 16px;

      ${mediaQuery.afterTablet} {
        font-size: 21px;
        text-align: left;
      }
    }
  }
`;

const ContainerFirstSection = styled.section`
  display: flex;
  justify-content: center;
  background: ${(props) => props.theme.basic.default};
  padding: 1rem;

  ${mediaQuery.afterTablet} {
    padding: 3rem 2.5rem;
  }

  .content-cards-items {
    width: 100%;
    overflow-x: scroll;
    padding: 1rem 0;
    display: flex;
  }
`;

const ContainerItemSlider = styled.section`
  position: relative;
  width: 100vw;
  height: 70vh;

  ${mediaQuery.afterTablet} {
    height: 68vh;
  }
`;

const ContainerCarousel = styled(Carousel)`
  width: auto;
  height: auto;
  background: ${(props) => props.theme.basic.blackDarken};
  overflow: hidden;

  .slick-dots-bottom {
    bottom: 20px;

    ${mediaQuery.afterTablet} {
      bottom: 30px;
    }
  }

  .slick-active {
    button {
      background: ${(props) => props.theme.basic.primary};
      width: 8px !important;
      height: 8px !important;
      border-radius: 50%;

      ${mediaQuery.afterTablet} {
        width: 10px !important;
        height: 10px !important;
      }
    }
  }

  .slick-dots li {
    margin: 0 4px;

    button {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: ${(props) => props.theme.basic.whiteDarken};

      ${mediaQuery.afterTablet} {
        width: 10px;
        height: 10px;
      }
    }

    ${mediaQuery.afterTablet} {
      margin: 0 7px;
    }
  }
`;
