import React, { useEffect, useGlobal } from "reactn";
import { useRouter } from "next/router";
import { config } from "../../firebase";
import { ButtonAnt } from "../../components/form";
import { ContentLiterals } from "../../components/common/DataList";
import { SharpButton } from "../../components/common/SharpButton";
import { Image as ImageV2 } from "ebombo-components";
import { useTranslation } from "../../hooks";

export const Content = (props) => {
  const router = useRouter();

  const [authUser] = useGlobal("user");

  const { t } = useTranslation();

  useEffect(() => {
    router.prefetch("/events/[eventId]");
    router.prefetch("/library/events/[eventId]");
    router.prefetch("/contact");
  }, []);

  const createEvent = () => {
    const url = !!authUser ? "/library/events/new?manageBy=ebombo" : "/events/new";
    router.push(url);
  };

  return (
    <div>
      <section className="bg-tapiz-1 bg-white md:h-[calc(100vh-100px)] flex flex-col justify-center pt-14 md:pt-0">
        <div className="grid md:grid-cols-[4fr_6fr] max-w-[1500px] mx-auto">
          <div className="px-8">
            <h3 className="text-primary font-bold text-3xl md:text-5xl">{t("landing.content.intro-subheading")}</h3>
            <h2 className="text-secondary text-5xl md:text-7xl font-bold uppercase">
              {t("landing.content.intro-title")}
            </h2>
            <p className="text-secondary text-base md:text-2xl mb-10">{t("landing.content.intro-description")}</p>
            <div className="hidden md:inline-grid md:grid-cols-[min-content_min-content] gap-8">
              <SharpButton
                prefixIcon="wink"
                className="min-w-[180px]"
                onClick={() => createEvent()}
              >
                <span className="text-lg font-bold align-middle">{t("landing.content.sign-in-button-label")}</span>
              </SharpButton>
              <SharpButton
                size="big"
                prefixIcon="satisfied"
                color="primary"
                className="min-w-[180px]"
                onClick={() => router.push("/contact")}
              >
                <span className="text-lg font-bold align-middle">{t("landing.content.contact-button-label")}</span>
              </SharpButton>
            </div>
          </div>

          <div className="px-8">
            <ImageV2
              placeholderUrl={`${config.storageUrl}/resources/content-video-snapshot.jpg`}
              src={`${config.storageUrl}/resources/content-video.gif`}
              className="w-full aspect-video rounded-2xl"
              width="100%"
              aspectRatio="16 / 9"
            />
          </div>

          <div className="md:hidden inline-flex flex-cols flex-wrap gap-4 px-8 py-8">
            <SharpButton prefixIcon="wink" onClick={() => createEvent()}>
              <span className="text-lg font-bold align-middle">{t("landing.content.sign-in-button-label")}</span>
            </SharpButton>
            <SharpButton color="primary" prefixIcon="satisfied" onClick={() => router.push("/contact")}>
              <span className="text-lg font-bold align-middle">{t("landing.content.contact-button-label")}</span>
            </SharpButton>
          </div>
        </div>
      </section>

      <section className="bg-gradient-primary-to-secondary py-14">
        <div className="max-w-[1500px] mx-auto py-8 px-8 grid md:grid-cols-[1fr_1fr]">
          <div className="grid grid-cols-[15px_auto] mb-8 mt-0 md:mt-8">
            <div className="bg-successLight"></div>
            <div className="text-white font-bold text-3xl md:text-7xl self-center px-8 md:px-12">
              {t("landing.content.why-ebombo-works.title")}
            </div>
          </div>

          <div className="self-center">
            <div className="text-white text-base md:text-2xl">{t("landing.content.why-ebombo-works.description")}</div>
          </div>
        </div>
      </section>

      <section className="bg-tapiz-1 bg-white">
        <div className="max-w-[1500px] mx-auto pb-8 pt-8 px-8 grid">
          <div className="max-w-[1200px] mx-auto mb-6 uppercase text-secondary text-center font-bold text-2xl md:text-5xl self-center px-8 md:px-12">
            {t("landing.content.virtual-events.title")}
          </div>

          <div className="my-8">
            {ContentLiterals.virtualEvents.items.reduce((acc, item, i) => {
              const isOdd = i % 2 === 1;

              const childItems = [
                <ImageV2
                  key={`img-${i}`}
                  src={item.img}
                  alt=""
                  placeholderUrl={item.placeholder}
                  className={`${isOdd ? "md:order-1" : "md:order-2"} w-full order-1 aspect-video rounded-lg self-center`}
                />,
                <div key={`content-${i}`} className={`${isOdd ? "md:order-2" : "md:order-1"} order-2`}>
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
            {t("landing.content.virtual-event-you-love.title")}
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
              <span className="text-lg font-bold">{t("landing.content.sign-in-button-label")}</span>
            </ButtonAnt>
          </div>
        </div>
      </section>
    </div>
  );
};
