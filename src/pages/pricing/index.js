import React, { useState } from "reactn";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useTranslation } from "../../hooks";
import { ContactForm } from "../contact";
import { PlansTable } from "../subscriptions/PlansTable";

export const Pricing = props => {

  const { t } = useTranslation("pages.pricing")

  const [tab, setTab] = useState(0)

  const hostedGames = [
    "onboarding",
    "ideas",
    "survey",
    "opinion",
    "sales-training",
    "dynamize-events",
    "virtual-training",
    "introduce-yourself",
    "standards-training",
    "get-feedback",
    "presentation",
    "trivia",
    "bingo",
    "roulette",
    "questions-roulette",
    "hanged",
    "image-zoom",
    "training",
    "whoever-brings-me",
    "guess-movie"
  ]

  return (
    <div>
      <div className="p-4 bg-whiteDark bg-cover bg-no-repeat bg-pattern-gray w-[100vw] md:p-8">
        <div className="grid gap-4 md:grid-cols-[50%_50%] items-end">
          <div>
            <div className="text-[30px] text-secondary leading-[34px] font-[700] mb-4">
              {t("title")}
            </div>
            <div className="text-[18px] text-secondary leading-[22px] font-[400] mb-4">
              {t("description")}
            </div>
          </div>

          <div>
            <div className="mx-auto rounded-[8px] border-primary border-[4px] flex items-center max-w-[745px] space-around">

              <div
                className={`w-[50%] text-center cursor-pointer ${tab === 0 ? "text-white bg-primary py-2" : "text-primary"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(0)
                }}
              >
                {t("pro-hosted")}
              </div>
              <div
                className={`w-[50%] text-center cursor-pointer ${tab === 1 ? "text-white bg-primary py-2" : "text-primary"}`}
                onClick={(e) => {
                  e.preventDefault();
                  setTab(1)
                }}
              >
                {t("auto-hosted")}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[50%_50%] mt-8">
          <div>

          </div>
          <div>

            <div className="text-[28px] leading-[34px] text-secondary font-[700] mb-4 text-center">
              {tab === 0 ? t("pro-subtitle") : t("auto-subtitle")}
            </div>
            <div className="flex flex-wrap gap-[10px] justify-center">
              {
                hostedGames.map((game, index) => (
                  <div key={`${game}-${index}`} className="rounded-[6px] w-[160px] md:w-[180px] h-[110px] shadow-[0_0_4px_rgba(0,0,0,0.25)] bg-whiteLight">
                    <div className="h-[80px] w-full bg-gradient-primary-to-secondary flex items-end justify-center rounded-[6px_6px_0_0]">
                      <Image
                        src={`${config.storageUrl}/resources/hosted-games/${game}.svg`}
                        height="80px"
                        width="auto"
                        size="contain"
                        margin="0 auto"
                      />
                    </div>
                    <div className="h-[30px] text-secondary text-[12px] leading-[14px] font-[700] flex items-center justify-center">
                      {t(`${game}`)}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {
        tab === 0 ? (
          <ContactForm {...props} />
        ) : (
          <PlansTable background="bg-[#f5f2fb] bg-cover bg-no-repeat bg-pattern-gray" {...props} />
        )
      }
    </div>
  )
}