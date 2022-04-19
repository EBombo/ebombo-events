import React, { useEffect, useGlobal } from "reactn";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { ButtonAnt } from "../../components/form";
import { SharpButton } from "../../components/common/SharpButton";
import { LandingGames, OnBoardingLiterals } from "../../components/common/DataList";
import { Carousel } from "../../components/common/Carousel";
import { Image as ImageV2 } from "ebombo-components";
import { useTranslation } from "../../hooks";

export const OnBoarding = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const { t } = useTranslation();

  useEffect(() => {
    router.prefetch("/events/[eventId]");
    router.prefetch("/library/events/[eventId]");
  }, []);

  const createEvent = () => {
    const url = !!authUser ? "/library/events/new?manageBy=ebombo" : "/events/new";
    router.push(url);
  };

  const GameContentItem = ({ gameContent, className }) => (
    <div>
      <div className={`${className} text-white`}>
        <div className="aspect-square w-full mb-4">
          <ImageV2 src={gameContent.img} placeholderUrl={gameContent.placeholderUrl} alt="" />
        </div>
        <div className="text-2xl mb-4">{t(gameContent.title)}</div>
        <p className="text-base">{t(gameContent.description)}</p>
      </div>
    </div>
  );

  return (
    <div className="w-[100vw]">
      <section className="bg-tapiz-1 bg-white flex flex-col justify-center p-4 lg:p-8 lg:min-h-[calc(100vh-100px)]">
        <div className="w-full lg:grid lg:grid-cols-[3fr_4fr] gap-8 max-w-[1500px] mx-auto">
          <div className="w-full">
            <h3 className="text-primary font-bold text-2xl md:text-4xl">{t("landing.on-boarding.intro-subheading")}</h3>
            <h2 className="text-secondary text-3xl md:text-5xl font-bold uppercase break-words">
              {t("landing.on-boarding.intro-title")}
            </h2>
            <p className="text-secondary text-base md:text-xl mb-8">{t("landing.on-boarding.intro-description")}</p>
            <div className="hidden lg:inline-grid lg:grid-cols-[min-content_min-content] gap-8">
              <SharpButton
                prefixIcon="wink"
                className="min-w-[180px]"
                onClick={() => createEvent()}
              >
                <span className="text-lg font-bold">{t("landing.on-boarding.sign-in-button-label")}</span>
              </SharpButton>
            </div>
          </div>

          <div className="lg:h-full lg:flex lg:items-center px-8">
            <ImageV2
              placeholderUrl={`${config.storageUrl}/resources/on-boarding-video-snapshot.jpg`}
              src={`${config.storageUrl}/resources/on-boarding-video.gif`}
              className="w-full aspect-video rounded-2xl mx-auto"
              width="100%"
              aspectRatio="16 / 9"
            />
          </div>

          <div className="lg:hidden inline-flex flex-wrap gap-4 py-8">
            <SharpButton
                prefixIcon="wink"
                className="min-w-[180px]"
                onClick={() => createEvent()}
            >
              <span className="text-lg font-bold">{t("landing.on-boarding.sign-in-button-label")}</span>
            </SharpButton>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary-to-secondary">
        <div className="max-w-[1500px] mx-auto py-16 px-8 grid md:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-[15px_auto] mb-8 mt-0 md:mt-8">
            <div className="bg-successLight" />
            <div className="text-white font-bold text-3xl md:text-7xl self-center px-8 md:px-12">
              {t("landing.on-boarding.why-ebombo-works.title")}
            </div>
          </div>

          <div>
            <div className="mb-6 text-white text-base md:text-2xl">
              {t("landing.on-boarding.why-ebombo-works.description")}
            </div>
            <div className="text-white text-base md:text-2xl">
              {t("landing.on-boarding.why-ebombo-works.description-paragraph-2")}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-tapiz-1 bg-white py-16">
        <div className="max-w-[1500px] mx-auto py-8 px-8 grid">
          <div className="max-w-[1200px] mx-auto mb-6 text-secondary text-center font-bold text-2xl md:text-5xl self-center px-8 md:px-12 uppercase">
            {t("landing.on-boarding.activities.title")}
          </div>

          <div className="text-secondary text-base md:text-2xl text-center">
            {t("landing.on-boarding.activities.description")}
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary-to-secondary relative p-4 md:p-8">
        <div className="absolute top-[-30px] md:top-[-60px] left-2 md:left-8">
          <Image src={`${config.storageUrl}/resources/planet-1.svg`} alt="" width="60px" desktopWidth="120px" />
        </div>
        <div className="absolute bottom-[-30px] md:bottom-[-60px] right-2 md:right-8">
          <Image src={`${config.storageUrl}/resources/planet-2.svg`} alt="" width="60px" desktopWidth="120px" />
        </div>

        <div className="max-w-[300px] md:max-w-[1000px] my-12 mx-auto">
          <Carousel
            showArrows
            hideIndicators
            components={LandingGames.map((_, index) => (
              <div key={`carousel-wrapper-${index}`} className="md:grid md:grid-cols-[1fr_1fr_1fr] gap-8">
                <GameContentItem gameContent={LandingGames[index % LandingGames.length]} />

                <GameContentItem
                  className="hidden md:block"
                  gameContent={LandingGames[(index + 1) % LandingGames.length]}
                />

                <GameContentItem
                  className="hidden md:block"
                  gameContent={LandingGames[(index + 2) % LandingGames.length]}
                />
              </div>
            ))}
          />
        </div>
      </section>

      <section className="bg-tapiz-1 bg-white">
        <div className="max-w-[1500px] mx-auto pb-8 pt-40 px-8 grid">
          <div className="max-w-[1200px] mx-auto mb-6 uppercase text-secondary text-center font-bold text-2xl md:text-5xl self-center px-8 md:px-12">
            {t("landing.on-boarding.virtual-events.title")}
          </div>

          <div className="my-8">
            {OnBoardingLiterals.virtualEvents.items.reduce((acc, item, i) => {
              const isOdd = i % 2 === 1;

              const childItems = [
                <ImageV2
                  key={`img-${i}`}
                  src={item.img}
                  alt=""
                  placeholderUrl={item.placeholder}
                  className={`${isOdd ? "md:order-2" : "md:order-1"} w-full order-1 aspect-video rounded-lg self-center`}
                />,
                <div key={`content-${i}`} className={`${isOdd ? "md:order-1" : "md:order-2"} order-2`}>
                  <div className="mb-6 uppercase font-bold text-primary text-2xl md:text-3xl">{t(item.title)}</div>
                  <div className="text-base md:text-2xl">{t(item.description)}</div>
                </div>,
              ];

              const wrapperEl = (
                <div key={`wrapper-${i}`} className={`grid ${isOdd ? "md:grid-cols-[4fr_3fr]" : "md:grid-cols-[3fr_4fr]"}  my-32 gap-32`}>
                  {childItems}
                </div>
              );

              return [...acc, wrapperEl];
            }, [])}
          </div>
        </div>
      </section>

      <section className="bg-gradient-black-to-secondary">
        <div className="max-w-[1500px] mx-auto py-8 px-8">
          <div className="text-white font-bold text-3xl md:text-7xl">
            {t("landing.on-boarding.virtual-event-you-love.title")}
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
              <span className="text-lg font-bold">{t("landing.on-boarding.sign-in-button-label")}</span>
            </ButtonAnt>
          </div>
        </div>
      </section>
    </div>
  );
};
