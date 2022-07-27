import React, { useMemo, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { getMonthlyPrice, getYearlyPrice } from "../../stripe";
import { freePlan, getCurrencySymbol } from "../../components/common/DataList";
import { config } from "../../firebase";
import { Anchor, ButtonAnt, Switch } from "../../components/form";
import { StripeCustomerPortalLink } from "../../components/StripeCustomerPortalLink";
import { darkTheme } from "../../theme";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useStripePlans } from "../../hooks/useStripePlans";
import { spinLoaderMin } from "../../components/common/loader";
import { Icon } from "../../components/common/Icons";
import { ModalContainer } from "../../components/common/ModalContainer";
import { useTranslation } from "../../hooks";
import { useRouter } from "next/router";
import get from "lodash/get";
import { Tooltip } from "antd";

const specsOrder = ["users", "games", "reporting", "progress_tracking", "players_identity"];

const EXCLUSIVE_PLAN_NAME = "Exclusive";
const FREE_PLAN_NAME = freePlan.name;
const YES_VALUE = "yes";
const NO_VALUE = "no";
const TRUE_VALUE = "true";

export const PlansTable = (props) => {
  const router = useRouter();

  const { plans, isLoadingPlans } = useStripePlans();

  const { t, locale } = useTranslation("components.plans-table");

  const [isMonthly_, setIsMonthly_] = useState(false);

  const isMonthly = useMemo(() => props?.isMonthly ?? isMonthly_, [props.isMonthly, isMonthly_]);

  const setIsMonthly = () => {
    (props.setIsMonthly ?? setIsMonthly_)?.(!isMonthly);
  };

  const hasPlan = useMemo(() => !!props.currentPlan, [props.currentPlan]);

  const planIndex = useMemo(
    () => plans.findIndex((plan) => plan.name === props.currentPlan?.name),
    [props.currentPlan, plans]
  );

  // CurrentPriceId es el ID del precio (el anual o el mensual) que el usuario
  // ha pagado. se usa para distinguir si pago el mensual o el anual
  const currentPriceId = useMemo(() => get(props.currentSubscription, "price.id", ""), [props.currentSubscription]);

  const anualPhrase = (price) => (
    <p>
      {t("per-admin-anually")} (<span className="whitespace-nowrap">{price}</span> {t("monthly")})
    </p>
  );
  const monthlyPhrase = (price) => (
    <p>
      {t("per-admin-monthly")} (<span className="whitespace-nowrap">{price}</span> {t("annual")})
    </p>
  );

  const getYesNoIcon = (value) =>
    value === YES_VALUE ? (
      <CheckOutlined style={{ color: darkTheme.basic.primary }} />
    ) : (
      <CloseOutlined style={{ color: darkTheme.basic.danger }} />
    );

  const getCurrentPricePlan = (plan) => (isMonthly ? getMonthlyPrice(plan) : getYearlyPrice(plan));

  const CallToActionContentSection = React.memo(
    ({ plan, index_ }) => {
      if (!props.showCallToActionSection) return <td />;

      if (plan?.name?.includes(EXCLUSIVE_PLAN_NAME)) return <td />;

      if (plan?.name?.includes(FREE_PLAN_NAME) && !hasPlan) return <td />;

      if (plan?.name?.includes(FREE_PLAN_NAME) && hasPlan)
        return (
          <td>
            <StripeCustomerPortalLink>
              <Tooltip title={t("switch-free-plan-disclaimer")}>
                <ButtonAnt variant="outlined" color="dark">
                  {t("downgrade-plan")} <Icon type="info-circle" />
                </ButtonAnt>
              </Tooltip>
            </StripeCustomerPortalLink>
          </td>
        );

      const planPrice = getCurrentPricePlan(plan);

      if (hasPlan && planIndex === index_ && currentPriceId === planPrice?.id)
        return (
          <td>
            <StripeCustomerPortalLink>
              <ButtonAnt variant="outlined" color="dark">
                {t("cancel-plan")}
              </ButtonAnt>
            </StripeCustomerPortalLink>
          </td>
        );

      if (hasPlan && planIndex === index_ && currentPriceId !== planPrice?.id)
        return (
          <td>
            <ButtonAnt
              variant="outlined"
              color="dark"
              onClick={(e) => {
                e.preventDefault();
                props.onInitSubscriptionUpdate?.(plan, isMonthly ? getMonthlyPrice(plan) : getYearlyPrice(plan));
              }}
            >
              {t("change-plan")}
            </ButtonAnt>
          </td>
        );

      if (hasPlan && planIndex < index_)
        return (
          <td>
            <ButtonAnt
              loading={props.isLoadingCheckoutPlan}
              onClick={(e) => {
                e.preventDefault();
                props.onInitSubscriptionUpdate?.(plan, isMonthly ? getMonthlyPrice(plan) : getYearlyPrice(plan));
              }}
            >
              {t("upgrade-plan")}
            </ButtonAnt>
          </td>
        );

      if (hasPlan && planIndex > index_)
        return (
          <td>
            <ButtonAnt
              variant="outlined"
              color="dark"
              loading={props.isLoadingCheckoutPlan}
              onClick={(e) => {
                e.preventDefault();
                props.onInitSubscriptionUpdate?.(plan, isMonthly ? getMonthlyPrice(plan) : getYearlyPrice(plan));
              }}
            >
              {t("downgrade-plan")}
            </ButtonAnt>
          </td>
        );

      return (
        <td>
          <ButtonAnt
            loading={props.isLoadingCheckoutPlan}
            onClick={(e) => {
              e.preventDefault();
              props.onSelectedPlan?.(plan, isMonthly ? getMonthlyPrice(plan) : getYearlyPrice(plan));
            }}
          >
            {t("get-plan")}
          </ButtonAnt>
        </td>
      );
    },
    [props.showCallToActionSection, hasPlan, planIndex]
  );

  if (isLoadingPlans) return <div className="bg-white">{spinLoaderMin()}</div>;

  return (
    <TableContainer hasPlan={hasPlan} {...props}>
      <table border="0">
        <tbody>
          <tr>
            <td>
              <div>
                <div className="pb-8 table-title">{t("compare-plans")}</div>
              </div>
            </td>

            {props.showCallToActionSection && hasPlan && <td className="max-h-[30px]" />}

            <td>
              <span className="w-full text-sm text-black">
                {t("payment")}
                <br />
                <span className="align-top pr-1">{t("annual")}</span>
                <span className="inline-block">
                  <Switch checked={isMonthly} onChange={() => setIsMonthly()} />
                </span>
                <span className="align-top pl-1">{t("monthly")}</span>
              </span>
            </td>
            {specsOrder.map((specLabel, index) =>
              index === 0 ? (
                <td key={`spec-key-${index}`} style={{ borderRadius: "15px 0 0 0" }}>
                  {t(specLabel)}
                </td>
              ) : specsOrder.length - 1 === index ? (
                <td key={`spec-key-${index}`} style={{ borderRadius: "0 0 0 15px" }}>
                  {t(specLabel)}
                </td>
              ) : (
                <td key={`spec-key-${index}`}>{t(specLabel, specLabel)}</td>
              )
            )}
          </tr>

          {plans.map((plan, index_) => (
            <tr key={`${plan.name}-index`}>
              <td>
                <div className={`plan text-center ${plan.name.toLowerCase()}`}>
                  <div className="name mb-4">{plan.name}</div>
                  {plan.name === EXCLUSIVE_PLAN_NAME ? (
                    <button
                      className="btn-contact mb-4"
                      onClick={(e) => {
                        e.preventDefault();
                        router.push("/contact");
                      }}
                    >
                      {t("contact")}
                      <br />
                      {t("sales")}
                    </button>
                  ) : isMonthly ? (
                    <div className="price text-center mb-4">
                      <span className="text-2xl align-super">{getCurrencySymbol[getMonthlyPrice(plan)?.currency]}</span>{" "}
                      {getMonthlyPrice(plan)?.amount}
                    </div>
                  ) : (
                    <div className="price text-center mb-4">
                      <span className="text-2xl align-super">{getCurrencySymbol[getYearlyPrice(plan)?.currency]}</span>{" "}
                      {getYearlyPrice(plan)?.amount}
                    </div>
                  )}

                  <div className="divider" />

                  <div className="description mb-4">
                    {plan.name === EXCLUSIVE_PLAN_NAME ? (
                      <Anchor url="/contact" key={locale}>
                        <span className="font-bold text-base text-black underline underline-offset-2">
                          {t(plan.description, plan.description)}
                        </span>
                      </Anchor>
                    ) : plan.description ? (
                      t(plan.description, plan.description)
                    ) : isMonthly ? (
                      monthlyPhrase(
                        `${getCurrencySymbol[getMonthlyPrice(plan)?.currency]} ${(
                          getMonthlyPrice(plan)?.amount * 12
                        ).toFixed(2)}`
                      )
                    ) : (
                      anualPhrase(
                        `${getCurrencySymbol[getYearlyPrice(plan)?.currency]} ${(
                          getYearlyPrice(plan)?.amount / 12
                        ).toFixed(2)}`
                      )
                    )}
                  </div>
                </div>
              </td>

              {props.showCallToActionSection && hasPlan && (
                <td className="text-center max-h-[30px]">
                  {getCurrentPricePlan(plan)?.id === currentPriceId && (
                    <span className="text-black font-bold text-base">{t("current-plan")}</span>
                  )}
                </td>
              )}

              <CallToActionContentSection key={`cta-${index_}`} plan={plan} index_={index_} />

              {specsOrder.map((keySpec, index) => (
                <td
                  key={index}
                  style={
                    index_ === plans.length - 1
                      ? {
                          borderRadius:
                            index === 0 ? "0 15px 0 0" : index === specsOrder.length - 1 ? "0 0 15px 0" : "",
                        }
                      : {}
                  }
                >
                  {plan.metadata[keySpec] === YES_VALUE || plan.metadata[keySpec] === NO_VALUE
                    ? getYesNoIcon(plan.metadata[keySpec])
                    : t(plan.metadata[keySpec], plan.metadata[keySpec])}
                </td>
              ))}

              {plan.metadata.recommended === TRUE_VALUE && <span className="selected" />}
              {props.showMostPopularBadge && plan.metadata.recommended === TRUE_VALUE && (
                <Star backgroundImg={`${config.storageUrl}/resources/plan-star.png`}>{t("most-popular")}</Star>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  width: 1000px;
  padding: 100px 1rem;
  background: #f5f2fb;

  .table-title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 30px;
    line-height: 34px;
    letter-spacing: 0.03em;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  table {
    display: table;
    border-radius: 8px;
    margin: auto;

    tr {
      display: table-cell;
      position: relative;
      width: 200px;

      td {
        border: 1px solid ${(props) => props.theme.basic.grayLighten};
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Lato;
        font-style: normal;
        font-weight: 500;
        font-size: 18px;
        line-height: 22px;
        letter-spacing: 0.03em;
        color: #666666;
        height: 65px;
        padding: 0.2rem;
        background: ${(props) => props.theme.basic.whiteLight};
      }

      td:first-child {
        height: 180px;
      }

      td:first-child,
      td:nth-child(2) ${(props) => (props.showCallToActionSection && props.hasPlan ? ", td:nth-child(3)" : "")} {
        border: none;
        background: transparent;
      }

      .anticon-check {
        font-weight: bold;
        color: ${(props) => props.theme.basic.secondary};
      }
    }

    tr:first-child {
      td {
        justify-content: flex-start;
      }
    }
  }

  .selected {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    background: rgba(196, 173, 255, 0.2);
    border: 3px solid #956dfc;
    box-sizing: border-box;
    z-index: 20;
    border-radius: 13px 13px 0px 0px;
    pointer-events: none;
  }

  .plan {
    width: 100%;
    align-items: center;

    .name {
      font-family: Lato;
      font-style: normal;
      font-weight: 800;
      font-size: 17px;
      line-height: 21px;
      text-align: center;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .price {
      font-family: Lato;
      font-style: normal;
      font-weight: 800;
      font-size: 47.2172px;
      line-height: 57px;
      color: ${(props) => props.theme.basic.blackDarken};
    }

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayLight};
      text-align: center;
    }

    .select {
      font-weight: bold;
      color: ${(props) => props.theme.basic.black};
    }
  }

  .btn-contact {
    font-family: Lato;
    font-style: normal;
    font-weight: 800;
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.whiteLighten};
    background: linear-gradient(90.24deg, #d2a137 -3.57%, #eeca5a 23.9%, #d2a137 99.85%);
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 8px;
  }

  .avanzado {
    .name {
      color: ${(props) => props.theme.basic.primary};
    }

    .price {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .platinum {
    .name,
    .price {
      background: linear-gradient(180deg, #616161 0%, #8c8c8c 0.01%, #3f3f3f 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }
  }

  ${mediaQuery.afterTablet} {
    width: 100%;
    padding: 100px 2rem;
  }
`;

const Star = styled.div`
  position: absolute;
  z-index: 20;
  right: 0;
  top: 0;
  transform: translate(50%, -50%);
  width: 110px;
  height: 110px;
  font-family: Lato;
  font-style: normal;
  font-weight: 800;
  font-size: 13px;
  line-height: 16px;
  color: ${(props) => props.theme.basic.whiteLighten};
  background-image: url(${(props) => props.backgroundImg});
  background-size: contain;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
`;
