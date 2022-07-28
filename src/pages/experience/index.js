import React, { useEffect, useGlobal } from "reactn";
import { Image as ImageV2 } from "ebombo-components";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import styled from "styled-components";
import { useTranslation } from "../../hooks";
import { Carousel } from "../../components/common/Carousel";
import { BetweenCompaniesGames, MostPopularGames, TeamBuildingGames } from "../../components/common/DataList";
import { SharpButton } from "../../components/common/SharpButton";
import { EbomboMessage } from "../../components/EbomboMessage";

const firstColumn = ["trivia", "roulette", "rouletteQuestions", "hanged"];
const secondColumn = ["triviaCrack", "bingo", "drawAndGuess", "scrabble"];
const thirdColumn = ["movie", "triviaOnboarding", "domesticMovie", "song"];

export const Experience = (props) => {
  const router = useRouter();

  const { t } = useTranslation();

  const [authUser] = useGlobal("user");

  useEffect(() => {
    router.prefetch("/login");
    router.prefetch("/contact");
  }, []);

  const CarouselContent = ({ gameContent, className }) => (
    <div>
      <div className={`${className} text-white`}>
        <div className="aspect-square w-full mb-4">
          <ImageV2 src={gameContent.img} placeholderUrl={gameContent.placeholderUrl} alt="" />
        </div>
        <div className="text-secondary text-2xl mb-4">{t(gameContent.title)}</div>
        <p className="text-blackDarken text-base">{t(gameContent.description)}</p>
      </div>
    </div>
  );

  return (
    <ExperienceContainer>
      <div className="w-full bg-cover bg-no-repeat bg-secondary bg-pattern grid gap-4 p-2 md:p-4 lg:overflow-hidden lg:grid-cols-[50%_1050px] lg:h-[800px]">
        <div className="p-4 flex flex-col items-center justify-center min-h-[450px]">
          <div className="w-full text-['Lato'] font-[900] text-white text-[25px] leading-[35px] md:text-[40px] md:leading-[48px] text-center lg:text-left lg:text-[50px] lg:leading-[55px]">
            {t("pages.experience.title")}
          </div>
          <div className="w-full text-['Lato'] font-[400] text-white text-[16px] leading-[18px] md:text-[20px] md:leading-[25px] my-4 text-center lg:text-left lg:text-[25px] lg:leading-[28px]">
            {t("pages.experience.subtitle")}
          </div>
          <div className="w-full flex items-center justify-center gap-[5px] lg:justify-start">
            {!authUser && (
              <SharpButton
                prefixIcon="wink"
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/login");
                }}
              >
                {t("pages.experience.sign-in-button")}
              </SharpButton>
            )}
            <SharpButton
              prefixIcon="satisfied"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                router.push("/contact");
              }}
            >
              {t("pages.experience.contact-button")}
            </SharpButton>
          </div>
        </div>

        <div className="hidden h-full overflow-hidden lg:flex lg:gap-[5px]">
          <div className="slider ">
            <div className="slide-track">
              {firstColumn.map((gameName, index) => (
                <div className="slide" key={`${gameName}-${index}`}>
                  <img src={`${config.storageUrl}/resources/games/${gameName}.svg`} />
                </div>
              ))}

              {firstColumn.map((gameName, index) => (
                <div className="slide" key={`${gameName}-${index}`}>
                  <img src={`${config.storageUrl}/resources/games/${gameName}.svg`} />
                </div>
              ))}
            </div>
          </div>

          <div className="slider">
            <div className="slide-track-middle">
              {secondColumn.map((gameName, index) => (
                <div className="slide" key={`${gameName}-${index}`}>
                  <img src={`${config.storageUrl}/resources/games/${gameName}.svg`} />
                </div>
              ))}
              {secondColumn.map((gameName, index) => (
                <div className="slide" key={`${gameName}-${index}`}>
                  <img src={`${config.storageUrl}/resources/games/${gameName}.svg`} />
                </div>
              ))}
            </div>
          </div>

          <div className="slider ">
            <div className="slide-track">
              {thirdColumn.map((gameName, index) => (
                <div className="slide" key={`${gameName}-${index}`}>
                  <img src={`${config.storageUrl}/resources/games/${gameName}.svg`} />
                </div>
              ))}
              {thirdColumn.map((gameName, index) => (
                <div className="slide" key={`${gameName}-${index}`}>
                  <img src={`${config.storageUrl}/resources/games/${gameName}.svg`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-primary p-4 w-full md:flex md:items-center gap-[5px] md:justify-center">
        <div className="flex gap-[5px] items-center justify-center">
          <div className="hidden border-[1px] border-white bg-success w-[10px] h-[10px] rounded-[50%] lg:block" />
          <div className="text-['Lato'] font-[800] text-[24px] leading-[29px] flex gap-[5px] lg:text-[42px] lg:leading-[50px]">
            <p className="text-white text-center m-0">
              {t("pages.experience.free-trial").toUpperCase()}
              <span className="text-secondary ml-[5px]">{t("pages.experience.free-trial-time").toUpperCase()}</span>
            </p>
          </div>
        </div>
        {!authUser && (
          <div className="flex justify-center mt-2 lg:mt-0 lg:ml-4 lg:justify-start">
            <SharpButton
              prefixIcon="wink"
              onClick={(e) => {
                e.preventDefault();
                router.push("/login");
              }}
            >
              {t("pages.experience.sign-in-button")}
            </SharpButton>
          </div>
        )}
      </div>

      <div className="w-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8">
        <div className="mx-auto max-w-[1110px]">
          <div>
            <div className="flex items-center gap-[10px] mt-8">
              <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
                {t("pages.experience.first-section")}
              </div>
            </div>
            <div className="">
              <Carousel
                showArrows
                hideIndicators
                components={MostPopularGames.map((_, index) => (
                  <div key={`carousel-wrapper-${index}`} className="md:grid md:grid-cols-[1fr_1fr_1fr] gap-8">
                    <CarouselContent gameContent={MostPopularGames[index % MostPopularGames.length]} />

                    <CarouselContent
                      className="hidden md:block"
                      gameContent={MostPopularGames[(index + 1) % MostPopularGames.length]}
                    />

                    <CarouselContent
                      className="hidden md:block"
                      gameContent={MostPopularGames[(index + 2) % MostPopularGames.length]}
                    />
                  </div>
                ))}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-[10px] mt-8">
              <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
                {t("pages.experience.second-section")}
              </div>
            </div>
            <div className="">
              <Carousel
                showArrows
                hideIndicators
                components={BetweenCompaniesGames.map((_, index) => (
                  <div key={`carousel-wrapper-${index}`} className="md:grid md:grid-cols-[1fr_1fr_1fr] gap-8">
                    <CarouselContent gameContent={BetweenCompaniesGames[index % BetweenCompaniesGames.length]} />

                    <CarouselContent
                      className="hidden md:block"
                      gameContent={BetweenCompaniesGames[(index + 1) % BetweenCompaniesGames.length]}
                    />

                    <CarouselContent
                      className="hidden md:block"
                      gameContent={BetweenCompaniesGames[(index + 2) % BetweenCompaniesGames.length]}
                    />
                  </div>
                ))}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-[10px] mt-8">
              <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
                {t("pages.experience.third-section")}
              </div>
            </div>
            <div>
              <Carousel
                showArrows
                hideIndicators
                components={TeamBuildingGames.map((_, index) => (
                  <div key={`carousel-wrapper-${index}`} className="md:grid md:grid-cols-[1fr_1fr_1fr] gap-8">
                    <CarouselContent gameContent={TeamBuildingGames[index % TeamBuildingGames.length]} />

                    <CarouselContent
                      className="hidden md:block"
                      gameContent={TeamBuildingGames[(index + 1) % TeamBuildingGames.length]}
                    />

                    <CarouselContent
                      className="hidden md:block"
                      gameContent={TeamBuildingGames[(index + 2) % TeamBuildingGames.length]}
                    />
                  </div>
                ))}
              />
            </div>
          </div>
        </div>
      </div>

      <EbomboMessage {...props} />
    </ExperienceContainer>
  );
};

const ExperienceContainer = styled.div`
  width: 100vw;

  .slider {
    width: 350px;
    margin: auto;
    position: relative;
    display: grid;
    place-items: center;
    height: 100%;
    overflow: hidden;
  }

  .slide-track {
    display: flex;
    flex-direction: column;
    height: calc(350px * 8);
    animation: scroll 30s linear infinite;
  }

  .slide-track-middle {
    display: flex;
    flex-direction: column;
    height: calc(350px * 8);
    animation: vertical-scroll 30s linear infinite;
  }

  .slide {
    width: 350px;
    height: 350px;
    display: flex;
    align-items: center;
    padding: 5px 0;
    border-radius: 10px;

    img {
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
  }

  @keyframes scroll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(calc(-350px * 4));
    }
  }

  @keyframes vertical-scroll {
    0% {
      transform: translateY(calc(-350px * 4));
    }
    100% {
      transform: translateY(0);
    }
  }
`;
