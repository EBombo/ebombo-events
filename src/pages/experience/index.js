import React, { useEffect } from "reactn";
import { ButtonAnt } from "../../components/form";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import styled from "styled-components";
import { useTranslation } from "../../hooks";

export const Experience = (props) => {
  const router = useRouter();

  const { t } = useTranslation("pages.experience");

  useEffect(() => {
    router.prefetch("/login");
  }, []);

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
            <ButtonAnt color="orange" onClick={() => router.push("/login")} margin="0">
              <div className="text-['Lato'] font-[700] text-blackDarken text-[16px] leading-[18px] md:text-[20px] md:leading-[25px] py-2 px-4">
                {t("loginButton")}
              </div>
            </ButtonAnt>
          </div>
        </div>

        <div className="hidden h-full overflow-hidden lg:flex lg:gap-[5px]">
          <div className="slider ">
            <div className="slide-track">
              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/trivia.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/roulette.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/rouletteQuestions.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/hanged.svg`} />
              </div>

              {/*  repeat 4 images*/}

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/trivia.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/roulette.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/rouletteQuestions.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/hanged.svg`} />
              </div>
            </div>
          </div>

          <div className="slider">
            <div className="slide-track-middle">
              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaCrack.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/bingo.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/drawAndGuess.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/scrabble.svg`} />
              </div>

              {/*  repeat 4 images*/}

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaCrack.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/bingo.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/drawAndGuess.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/scrabble.svg`} />
              </div>
            </div>
          </div>

          <div className="slider ">
            <div className="slide-track">
              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/movie.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaOnboarding.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/domesticMovie.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/song.svg`} />
              </div>

              {/*  repeat 4 images*/}

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/movie.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaOnboarding.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/domesticMovie.svg`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/song.svg`} />
              </div>
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
          <ButtonAnt color="orange" onClick={() => router.push("/login")} margin="0">
            <div className="text-['Lato'] font-[700] text-blackDarken text-[16px] leading-[18px] md:text-[20px] md:leading-[25px] py-2 px-4">
              {t("loginButton")}
            </div>
          </ButtonAnt>
        </div>
      </div>

      <div className="w-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8">
        <div>
          <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
            Más populares
          </div>

          <div>

          </div>
        </div>

        <div>
          <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
            Entre empresas
          </div>
        </div>

        <div>
          <div className="text-['Lato'] font-[700] text-primary text-[30px] leading-[36px] lg:text-[44px] lg:leading-[53px]">
            Team building
          </div>
        </div>
      </div>
    </ExperienceContainer>
  );
};

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
