import React, { useEffect } from "reactn";
import { ButtonAnt } from "../../components/form";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import styled from "styled-components";
import { useTranslation } from "../../hooks";
import { Image } from "../../components/common/Image";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel } from "../../components/common/Carousel";

const firstColumn = ["trivia", "roulette", "rouletteQuestions", "hanged"];
const secondColumn = ["triviaCrack", "bingo", "drawAndGuess", "scrabble"];
const thirdColumn = ["movie", "triviaOnboarding", "domesticMovie", "song"];

const firstRow = ["trivia", "bingo", "roulette", "domesticMovie"];
const secondRow = ["triviaCrack", "song", "scrabble", "imagesZoom"];
const thirdRow = ["rouletteQuestions", "triviaOnboarding", "charade", "emoji"];

export const Experience = (props) => {
  const router = useRouter();

  const { t } = useTranslation("pages.experience");

  useEffect(() => {
    router.prefetch("/login");
  }, []);

  const scrollElement = (to, section) => {
    const element = document.getElementById(section);

    const width = element.offsetWidth;

    element.scrollTo(to === "left" ? -width : width, 0);
  };

  const content = (gameName, carousel = false) => (
    <div
      className={`flex flex-col items-center md:items-start ${!carousel && "w-[calc(100vw-2rem)] md:w-[370px]"}`}
      key={gameName}
    >
      <Image
        width="270px"
        height="270px"
        desktopHeight="370px"
        desktopWidth="370px"
        margin="0"
        size="cover"
        src={`${config.storageUrl}/resources/games/${gameName}.svg`}
        borderRadius="10px"
        className="aspect-square w-full"
      />
      <div className="text-['Lato'] text-blackDarken font-[900] text-[20px] leading-[24px] lg:text-[32px] lg:leading-[36px] my-2">
        {t(`games[${gameName}]`)}
      </div>
      <div className="text-['Lato'] text-secondary font-[400] text-[16px] leading-[19px] lg:text-[20px] lg:leading-[24px] text-center md:text-left">
        {t(gameName)}
      </div>
    </div>
  );

  return (
    <ExperienceContainer>
      <div className="w-full bg-cover bg-no-repeat bg-secondary bg-pattern grid gap-4 p-2 md:p-4 lg:grid-cols-[auto_670px] lg:h-[800px]">
        <div className="p-4 flex flex-col items-center justify-center min-h-[450px]">
          <div className="w-full text-['Lato'] font-[900] text-white text-[25px] leading-[35px] md:text-[40px] md:leading-[48px] text-center lg:text-left lg:text-[50px] lg:leading-[55px]">
            {t("title")}
          </div>
          <div className="w-full text-['Lato'] font-[400] text-white text-[16px] leading-[18px] md:text-[20px] md:leading-[25px] my-4 text-center lg:text-left lg:text-[25px] lg:leading-[28px]">
            {t("subtitle")}
          </div>
          <div className="w-full flex items-center justify-center lg:justify-start">
            <ButtonAnt color="success" onClick={() => router.push("/login")} margin="0">
              <div className="text-['Lato'] font-[700] text-blackDarken text-[16px] leading-[18px] md:text-[20px] md:leading-[25px] py-2 px-4">
                {t("loginButton")}
              </div>
            </ButtonAnt>
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
              {t("freeTrial").toUpperCase()}
              <span className="text-secondary ml-[5px]">{t("freeTrial-time").toUpperCase()}</span>
            </p>
          </div>
        </div>
        <div className="flex justify-center mt-2 lg:mt-0 lg:ml-4 lg:justify-start">
          <ButtonAnt color="success" onClick={() => router.push("/login")} margin="0">
            <div className="text-['Lato'] font-[700] text-blackDarken text-[16px] leading-[18px] md:text-[20px] md:leading-[25px] py-2 px-4">
              {t("loginButton")}
            </div>
          </ButtonAnt>
        </div>
      </div>

      <div className="w-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8">
        <div className="flex items-center gap-[10px] mt-8">
          <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
            {t("firstSection")}
          </div>
          <div className="items-center gap-[5px] hidden md:flex">
            <ButtonAnt padding="0.5rem" onClick={() => scrollElement("left", "firstSection")}>
              <LeftOutlined style={{ color: "white" }} />
            </ButtonAnt>
            <ButtonAnt padding="0.5rem" onClick={() => scrollElement("right", "firstSection")}>
              <RightOutlined style={{ color: "white" }} />
            </ButtonAnt>
          </div>
        </div>

        <div className="block md:hidden">
          <Carousel
            showArrows
            components={firstRow.map((gameName, index) => content(gameName, true))}
            hideIndicators={false}
          />
        </div>

        <div className="w-full no-scrollbar overflow-auto hidden md:block" id="firstSection">
          <div className="grid items-start gap-4 grid-cols-[repeat(4,calc(100vw-2rem))] md:grid-cols-[repeat(auto-fit,370px)] w-[1550px] my-4">
            {firstRow.map((gameName) => content(gameName))}
          </div>
        </div>

        <div className="flex items-center gap-[10px] mt-8">
          <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
            {t("secondSection")}
          </div>
          <div className="items-center gap-[5px] hidden md:flex">
            <ButtonAnt padding="0.5rem" onClick={() => scrollElement("left", "secondSection")}>
              <LeftOutlined style={{ color: "white" }} />
            </ButtonAnt>
            <ButtonAnt padding="0.5rem" onClick={() => scrollElement("right", "secondSection")}>
              <RightOutlined style={{ color: "white" }} />
            </ButtonAnt>
          </div>
        </div>

        <div className="block md:hidden">
          <Carousel
            showArrows
            components={secondRow.map((gameName, index) => content(gameName, true))}
            hideIndicators={false}
          />
        </div>

        <div className="w-full no-scrollbar overflow-auto hidden md:block" id="secondSection">
          <div className="grid items-start gap-4 grid-cols-[repeat(4,calc(100vw-2rem))] md:grid-cols-[repeat(auto-fit,370px)] w-[1550px] my-4">
            {secondRow.map((gameName) => content(gameName))}
          </div>
        </div>

        <div className="flex items-center gap-[10px] mt-8">
          <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
            {t("thirdSection")}
          </div>
          <div className="items-center gap-[5px] hidden md:flex">
            <ButtonAnt padding="0.5rem" onClick={() => scrollElement("left", "thirdSection")}>
              <LeftOutlined style={{ color: "white" }} />
            </ButtonAnt>
            <ButtonAnt padding="0.5rem" onClick={() => scrollElement("right", "thirdSection")}>
              <RightOutlined style={{ color: "white" }} />
            </ButtonAnt>
          </div>
        </div>

        <div className="block md:hidden">
          <Carousel
            showArrows
            components={thirdRow.map((gameName, index) => content(gameName, true))}
            hideIndicators={false}
          />
        </div>

        <div className="w-full no-scrollbar overflow-auto hidden md:block" id="thirdSection">
          <div className="grid items-start gap-4 grid-cols-[repeat(4,calc(100vw-2rem))] md:grid-cols-[repeat(auto-fit,370px)] w-[1550px] my-4">
            {thirdRow.map((gameName) => content(gameName))}
          </div>
        </div>
      </div>

      <StyledFooter className="p-4 lg:p-8">
        <div className="text-white mb-4 text-['Lato'] font-[900] text-[26px] leading-[31px] lg:text-[100px] lg:leading-[120px]">
          {t("lastTitle")}
        </div>
        <ButtonAnt color="success" onClick={() => router.push("/login")}>
          <div className="text-['Lato'] font-[700] text-blackDarken text-[16px] leading-[18px] md:text-[20px] md:leading-[25px] py-2 px-4">
            {t("loginButton")}
          </div>
        </ButtonAnt>
      </StyledFooter>
    </ExperienceContainer>
  );
};

const StyledFooter = styled.div`
  background: linear-gradient(270deg, #1d1138 0%, #331e6d 31.25%, #1e1239 100%);
`;

const ExperienceContainer = styled.div`
  width: 100vw;

  .slider {
    width: 220px;
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
    height: calc(220px * 8);
    animation: scroll 30s linear infinite;
  }

  .slide-track-middle {
    display: flex;
    flex-direction: column;
    height: calc(220px * 8);
    animation: vertical-scroll 30s linear infinite;
  }

  .slide {
    width: 220px;
    height: 220px;
    display: flex;
    align-items: center;
    padding: 10px 0;
    perspective: 100px;
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
      transform: translateY(calc(-220px * 4));
    }
  }

  @keyframes vertical-scroll {
    0% {
      transform: translateY(calc(-220px * 4));
    }
    100% {
      transform: translateY(0);
    }
  }
`;
