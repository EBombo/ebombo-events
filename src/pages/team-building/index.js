import React, { useGlobal } from "reactn";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import { Image } from "../../components/common/Image";
import { Anchor } from "../../components/form";
import { SharpButton } from "../../components/common/SharpButton";
import { LandingGames, TeamBuildingLiterals } from "../../components/common/DataList";
import { Carousel } from "../../components/common/Carousel";
import { Image as ImageV2 } from "ebombo-components";
import { useTranslation } from "../../hooks";
import { EbomboMessage } from "../../components/EbomboMessage";

export const TeamBuilding = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const { t } = useTranslation();

  const GameContentItem = ({ gameContent, className }) => (
    <div>
      <div className={`${className} text-white`}>
        <div className="aspect-square w-full mb-4 rounded-xl overflow-hidden">
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
            <h3 className="text-primary font-bold text-2xl md:text-4xl">
              {t("landing.team-building.intro-subheading")}
            </h3>
            <h2 className="text-secondary text-3xl md:text-5xl font-bold uppercase break-words">
              {t(TeamBuildingLiterals.header.heading)}
            </h2>
            <p className="text-secondary text-base md:text-xl mb-10">{t(TeamBuildingLiterals.header.description)}</p>
            <div className="hidden lg:inline-grid md:grid-cols-[min-content_min-content] gap-8">
              <SharpButton
                prefixIcon="wink"
                className="min-w-[180px]"
                onClick={() => {
                  const url = !!authUser ? "/library/events/new?manageBy=ebombo" : "/events/new";
                  router.push(url);
                }}
              >
                <span className="text-lg font-bold align-middle">
                  {t("landing.team-building.sign-in-button-label")}
                </span>
              </SharpButton>
              <SharpButton color="primary" prefixIcon="satisfied" className="min-w-[180px]">
                <Anchor url="/contact">
                  <span className="text-lg font-bold text-white align-middle">
                    {t("landing.team-building.contact-button-label")}
                  </span>
                </Anchor>
              </SharpButton>
            </div>
          </div>

          <div className="lg:h-full lg:flex lg:items-center px-8">
            <ImageV2
              placeholderUrl={`${config.storageUrl}/resources/team-building-video-snapshot.jpg`}
              src={`${config.storageUrl}/resources/team-building-video.gif`}
              className="w-full aspect-video rounded-2xl mx-auto"
              width="100%"
              aspectRatio="16 / 9"
            />
          </div>

          <div className="lg:hidden inline-flex flex-wrap gap-4 py-8">
            <SharpButton
              prefixIcon="wink"
              className="min-w-[180px]"
              onClick={() => {
                const url = !!authUser ? "/library/events/new?manageBy=ebombo" : "/events/new";
                router.push(url);
              }}
            >
              <span className="text-lg font-bold align-middle">{t("landing.team-building.sign-in-button-label")}</span>
            </SharpButton>
            <SharpButton color="primary" prefixIcon="satisfied" className="min-w-[180px]">
              <Anchor url="/contact">
                <span className="text-lg font-bold text-white align-middle">
                  {t("landing.team-building.contact-button-label")}
                </span>
              </Anchor>
            </SharpButton>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary-to-secondary">
        <div className="max-w-[1500px] mx-auto py-16 px-8 grid md:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-[15px_auto] mb-8 mt-0 md:mt-8">
            <div className="bg-successLight" />
            <div className="text-white font-bold text-3xl md:text-7xl self-center px-8 md:px-12">
              {t(TeamBuildingLiterals.whyItWorks.title)}
            </div>
          </div>

          <div>
            <div className="mb-6 text-white text-base md:text-2xl">
              {t(TeamBuildingLiterals.whyItWorks.description)}
            </div>
            <div className="text-white text-base md:text-2xl">{t(TeamBuildingLiterals.whyItWorks.description2)}</div>
          </div>
        </div>
      </section>

      <section className="bg-tapiz-1 bg-white py-16">
        <div className="max-w-[1500px] mx-auto py-8 px-8 grid">
          <div className="max-w-[1200px] mx-auto mb-6 text-secondary text-center font-bold text-2xl md:text-5xl self-center px-8 md:px-12">
            {t(TeamBuildingLiterals.activities.title)}
          </div>

          <div className="text-secondary text-base md:text-2xl text-center">
            {t(TeamBuildingLiterals.activities.description)}
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

      <section className="bg-tapiz-1 bg-cover bg-no-repeat bg-white">
        <div className="max-w-[1160px] mx-auto px-[25px] py-[60px] md:py-[160px]">
          <h2 className="mb-[55px] text-center uppercase text-secondary font-[900] leading-[1.2] text-3xl md:text-7xl">
            {t(TeamBuildingLiterals.virtualEvents.title)}
          </h2>

          {TeamBuildingLiterals.virtualEvents.items.map((item, i) => (
            <div
              key={`wrapper-${i}`}
              className={`flex items-center flex-col mb-[90px] box-border ${
                i % 2 !== 1 ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              <ImageV2 src={item.img} alt="" className="w-full md:w-[50%]" placeholderUrl={item.placeholder} />
              <div className="w-full md:w-[50%] flex items-center justify-center p-[30px]">
                <span className="block max-w-[400px] mx-auto">
                  <h4 className="text-primary mb-[24px] text-['Lato'] text-[26px] font-[900]">{t(item.title)}</h4>
                  <p className="text-base">{t(item.description)}</p>
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <EbomboMessage {...props} />
    </div>
  );
};
