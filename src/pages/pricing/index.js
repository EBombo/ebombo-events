import React, { useState, useEffect, useGlobal } from "reactn";
import { Image } from "../../components/common/Image";
import { ButtonAnt } from "../../components/form";
import { config } from "../../firebase";
import { useTranslation } from "../../hooks";
import { ContactForm } from "../contact";
import { PlansTable } from "../subscriptions/PlansTable";
import { CheckOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export const Pricing = props => {

  const router = useRouter();

  const { t } = useTranslation("pages.pricing")

  const [authUser] = useGlobal("user")

  const [tab, setTab] = useState(0)

  useEffect(() => {
    router.prefetch("/events/new");
    router.prefetch("/library/events/new");
    router.prefetch("/login");
  }, [])

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

        <div className="grid gap-4 lg:grid-cols-[50%_50%] mt-8">
          {
            tab === 0 ? (
              <div className="grid md:grid-cols-[50%_50%] gap-4 justify-center items-start">
                <div className="bg-whiteLight rounded-[6px] shadow-[0_0_9px_rgba(0,0,0,0.25)] p-4 min-h-[600px] max-w-[350px]">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`${config.storageUrl}/resources/pro-hosted.svg`}
                      width="37px"
                      height="37px"
                      size="contain"
                      margin="0"
                    />
                    <div className="text-[24px] leading-[29px] text-secondary font-[700]">
                      {t("pro-hosted")}
                    </div>
                  </div>
                  <div className="text-[16px] leading-[19px] my-4 text-secondary">
                    {t("pro-hosted-description")}
                  </div>
                  <div>
                    <ButtonAnt
                      color="orangeLight"
                      margin="1rem 0"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/events/new")
                      }}
                    >
                      {t("btn-ebombo")}
                    </ButtonAnt>
                    <ButtonAnt
                      color="success"
                      margin="1rem 0"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("#contact")
                      }}
                    >
                      {t("btn-sales")}
                    </ButtonAnt>
                  </div>
                  <div className="bg-gray rounded-[6px] p-2 min-h-[300px]">
                    <div className="text-[14px] leading-[17px] text-secondary font-[600] text-secondary">
                      {t("subtitle")}
                    </div>
                    <ul>

                      {
                        [...Array(10).keys()].map(num => (
                          <li key={num} className="font-[400] text-secondary text-[14px] leading-[17px] flex gap-[5px] my-2">
                            {
                              num < 9 && (
                                <CheckOutlined />
                              )
                            }
                            {t(`pro-hosted-${num + 1}`)}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
                <div className="bg-whiteLight rounded-[6px] shadow-[0_0_9px_rgba(0,0,0,0.25)] p-4 min-h-[600px] max-w-[350px]">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`${config.storageUrl}/resources/subscription.svg`}
                      width="37px"
                      height="37px"
                      size="contain"
                      margin="0"
                    />
                    <div className="text-[24px] leading-[29px] text-secondary font-[700]">
                      {t("subscription")}
                    </div>
                  </div>
                  <div className="text-[16px] leading-[19px] my-4 text-secondary">
                    {t("subscription-description")}
                  </div>
                  <div>
                    <ButtonAnt
                      color="success"
                      margin="1rem 0"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("#contact")
                      }}
                    >
                      {t("btn-sales")}
                    </ButtonAnt>
                  </div>
                  <div className="bg-gray rounded-[6px] p-2 min-h-[300px]">
                    <div className="text-[14px] leading-[17px] text-secondary font-[600] text-secondary">
                      {t("subtitle")}
                    </div>
                    <ul>

                      {
                        [...Array(6).keys()].map(num => (
                          <li key={num} className="font-[400] text-secondary text-[14px] leading-[17px] flex gap-[5px] my-2">
                            {
                              num < 5 && (
                                <CheckOutlined />
                              )
                            }
                            {t(`subscription-${num + 1}`)}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid justify-center items-start">
                <div className="bg-whiteLight rounded-[6px] shadow-[0_0_9px_rgba(0,0,0,0.25)] p-4 max-w-[350px]">
                  <div className="flex items-center gap-4">
                    <Image
                      src={`${config.storageUrl}/resources/auto-hosted.svg`}
                      width="37px"
                      height="37px"
                      size="contain"
                      margin="0"
                    />
                    <div className="text-[24px] leading-[29px] text-secondary font-[700]">
                      {t("auto-hosted")}
                    </div>
                  </div>
                  <div className="text-[16px] leading-[19px] my-4 text-secondary">
                    {t("auto-hosted-description")}
                  </div>
                  <div>
                    <ButtonAnt
                      color="orangeLight"
                      margin="1rem 0"
                      onClick={(e) => {
                        e.preventDefault();
                        if (!authUser) return router.push("/login");
                        return router.push("/library/events/new?manageBy=user")
                      }}
                    >
                      {t("btn-activity")}
                    </ButtonAnt>
                  </div>
                  <div className="bg-gray rounded-[6px] p-2 min-h-[300px]">
                    <div className="text-[14px] leading-[17px] text-secondary font-[600] text-secondary">
                      {t("subtitle")}
                    </div>
                    <ul>

                      {
                        [...Array(8).keys()].map(num => (
                          <li key={num} className="font-[400] text-secondary text-[14px] leading-[17px] flex gap-[5px] my-2">
                            {
                              num < 8 && (
                                <CheckOutlined />
                              )
                            }
                            {t(`auto-${num + 1}`)}
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            )
          }

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