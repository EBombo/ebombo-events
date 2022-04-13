import React, { useEffect, useGlobal } from "reactn";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import { ButtonAnt } from "../../components/form";
import { Image as ImageV2 } from "ebombo-components";
import { useTranslation } from "../../hooks";

const EbomboStyleGames = [
  {
    toplineColor: "bg-cyan-300",
    title: "landing.activities.ebombo-style.items-1.title",
    description: "landing.activities.ebombo-style.items-1.description",
    img: `${config.storageUrl}/resources/trivia-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/trivia-game_12x12.webp`,
  },
  {
    toplineColor: "bg-rose-300",
    title: "landing.activities.ebombo-style.items-2.title",
    description: "landing.activities.ebombo-style.items-2.description",
    img: `${config.storageUrl}/resources/sing-and-win-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/trivia-game_12x12.webp`,
  },
  {
    toplineColor: "bg-sky-300",
    title: "landing.activities.ebombo-style.items-3.title",
    description: "landing.activities.ebombo-style.items-3.description",
    img: `${config.storageUrl}/resources/whom-brings-to-me-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/trivia-game_12x12.webp`,
  },
  {
    toplineColor: "bg-fuchsia-300",
    title: "landing.activities.ebombo-style.items-4.title",
    description: "landing.activities.ebombo-style.items-4.description",
    img: `${config.storageUrl}/resources/guess-song-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/song-guess-game_12x12.webp`,
  },
  {
    toplineColor: "bg-indigo-300",
    title: "landing.activities.ebombo-style.items-5.title",
    description: "landing.activities.ebombo-style.items-5.description",
    img: `${config.storageUrl}/resources/domestic-movie-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/pelicula-domestica-game_12x12.webp`,
  },
  {
    toplineColor: "bg-lime-300",
    title: "landing.activities.ebombo-style.items-6.title",
    description: "landing.activities.ebombo-style.items-6.description",
    img: `${config.storageUrl}/resources/zoom-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/zoom-game_12x12.webp`,
  },
  {
    toplineColor: "bg-emerald-300",
    title: "landing.activities.ebombo-style.items-7.title",
    description: "landing.activities.ebombo-style.items-7.description",
    img: `${config.storageUrl}/resources/2-true-1-false-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/2-true-1-false-game_12x12.webp`,
  },
  {
    toplineColor: "bg-pink-300",
    title: "landing.activities.ebombo-style.items-8.title",
    description: "landing.activities.ebombo-style.items-8.description",
    img: `${config.storageUrl}/resources/roulette-icebreaker-icon.svg`,
    // placeholderUrl: `${config.storageUrl}/resources/ruleta-rompehielo-game_12x12.webp`,
  },
];

export const Activities = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const { t } = useTranslation();

  useEffect(() => {
    router.prefetch("/events/[eventId]");
    router.prefetch("/library/events/[eventId]");
  }, []);

  const GameContentItem = ({ gameContent, className }) => (
    <div>
      <div className={`${className} bg-white shadow rounded-lg overflow-hidden h-full`}>
        <div className={`${gameContent.toplineColor} h-[8px]`}></div>
        <div className="px-8 py-4 grid grid-rows-[min-content_min-content_auto] h-full">
          <div className="text-2xl mb-4 font-bold text-primary">{t(gameContent.title)}</div>
          <p className="text-base">{t(gameContent.description)}</p>
          <div className="mb-4 pt-8 self-end">
            <ImageV2
              src={gameContent.img}
              placeholderUrl={gameContent.placeholderUrl}
              alt=""
              aspectRatio="1/1"
              width="120px"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <section className="bg-tapiz-1 bg-white md:h-[calc(100vh-100px)] flex flex-col justify-center pt-14 md:pt-0">
        <div className="grid md:grid-cols-[4fr_6fr] max-w-[1500px] mx-auto">
          <div className="px-8">
            <h3 className="text-primary font-bold text-3xl md:text-5xl">{t("landing.activities.intro-subheading")}</h3>
            <h2 className="text-secondary text-5xl md:text-7xl font-bold uppercase">
              {t("landing.activities.intro-title")}
            </h2>
            <p className="text-secondary text-base md:text-2xl">{t("landing.activities.intro-description")}</p>
            <div className="hidden md:inline-grid md:grid-cols-[min-content_min-content] gap-8">
              <ButtonAnt
                size="big"
                color="success"
                onClick={() => {
                  const url = !!authUser ? "/library/events/new?manageBy=ebombo" : "/events/new";
                  router.push(url);
                }}
              >
                <span className="text-lg font-bold">{t("landing.activities.sign-in-button-label")}</span>
              </ButtonAnt>
            </div>
          </div>

          <div className="px-8">
            <ImageV2
              placeholderUrl={`${config.storageUrl}/resources/feature-activities-video-snapshot.jpg`}
              src={`${config.storageUrl}/resources/feature-activities-video.gif`}
              className="w-full aspect-video rounded-2xl"
              width="100%"
              aspectRatio="16 / 9"
            />
          </div>

          <div className="md:hidden inline-flex flex-cols flex-wrap gap-4 px-8 py-8">
            <ButtonAnt size="big" color="success">
              <span className="text-lg font-bold">{t("landing.activities.sign-in-button-label")}</span>
            </ButtonAnt>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary-to-secondary relative">
        <div className="max-w-[1200px] md:mx-auto items-center mx-4 sm:mx-8">
          <div className="mx-auto py-8 px-8">
            <div className="grid grid-cols-[1fr] md:grid-cols-[1fr_1fr_1fr] gap-8">
              {EbomboStyleGames.map((_, index) => (
                <GameContentItem
                  key={`content-${index}`}
                  gameContent={EbomboStyleGames[index % EbomboStyleGames.length]}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-black-to-secondary">
        <div className="max-w-[1500px] mx-auto py-8 px-8">
          <div className="text-white font-bold text-3xl md:text-7xl">
            {t("landing.activities.virtual-event-you-love.title")}
          </div>
          <div className="py-8">
            <ButtonAnt
              size="big"
              color="success"
              onClick={() => {
                const url = !!authUser ? "/library/events/new?manageBy=ebombo" : "/events/new";
                router.push(url);
              }}
            >
              <span className="text-lg font-bold">{t("landing.activities.sign-in-button-label")}</span>
            </ButtonAnt>
          </div>
        </div>
      </section>
    </div>
  );
};
