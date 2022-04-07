import React, { useEffect } from "reactn";
import { ButtonAnt } from "../components/form";
import { useRouter } from "next/router";
import { config } from "../firebase";
import styled from "styled-components";

export const Experience = (props) => {
  const router = useRouter();

  useEffect(() => {
    router.prefetch("/login");
  }, []);

  return (
    <ExperienceContainer>
      <div className="w-full bg-cover bg-no-repeat bg-secondary bg-pattern grid gap-4 md:grid-cols-[1fr_1fr] md:h-[800px]">
        <div className="p-4 flex flex-col items-center justify-center">
          <div className="text-['Lato'] font-[900] text-white text-[40px] leading-[48px] text-center md:text-left md:text-[50px] md:leading-[55px]">
            LAS ACTIVIDADES MÁS DIVERTIDAS QUE TE PUEDAS ENCONTRAR
          </div>
          <div className="text-['Lato'] font-[400] text-white text-[16px] leading-[19px] my-4 text-center md:text-left md:text-[25px] md:leading-[28px]">
            Establecemos el estándar para el compromiso virtual y mejora la cultura de la oficina remota.
          </div>
          <div className="w-full flex items-center justify-center md:justify-start">
            <ButtonAnt color="danger" onClick={() => router.push("/login")} margin="0">
              <div className="text-['Lato'] font-[400] text-blackDarkent text-[25px] leading-[28px] py-2 px-4">
                Iniciar sesión
              </div>
            </ButtonAnt>
          </div>
        </div>

        <div className="hidden h-full overflow-hidden md:flex md:gap-4">
          <div className="slider ">
            <div className="slide-track">
              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/trivia.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/roulette.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/rouletteQuestions.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/hanged.png`} />
              </div>

              {/*  repeat 4 images*/}

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/trivia.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/roulette.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/rouletteQuestions.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/hanged.png`} />
              </div>
            </div>
          </div>

          <div className="slider ">
            <div className="slide-track-middle">
              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaCrack.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/bingo.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/drawAndGuess.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/scrabble.png`} />
              </div>

              {/*  repeat 4 images*/}

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaCrack.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/bingo.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/drawAndGuess.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/scrabble.png`} />
              </div>
            </div>
          </div>

          <div className="slider ">
            <div className="slide-track">
              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/movie.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaOnboarding.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/domesticMovie.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/song.png`} />
              </div>

              {/*  repeat 4 images*/}

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/movie.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/triviaOnboarding.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/domesticMovie.png`} />
              </div>

              <div className="slide">
                <img src={`${config.storageUrl}/resources/games/song.png`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ExperienceContainer>
  );
};

const ExperienceContainer = styled.div`
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
  
  .slide-track-middle{
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
      transform: translateY(0);
    }
    100% {
      transform: translateY(calc(+220px * 4));
    }
  }
`;
