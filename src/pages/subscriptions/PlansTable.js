import React, { useState, useMemo } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { getMonthlyPrice, getYearlyPrice } from "../../stripe";
import { getCurrencySymbol } from "../../components/common/DataList";
import { config } from "../../firebase";
import { Anchor, ButtonAnt, Switch } from "../../components/form";
import { StripeCustomerPortalLink } from "../../components/StripeCustomerPortalLink";
import { darkTheme } from "../../theme";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useStripePlans } from "../../hooks/useStripePlans";
import { spinLoaderMin } from "../../components/common/loader";
import { useTranslation } from "../../hooks";

const specsOrder = ["users", "games", "reporting", "progress_tracking", "players_identity"];

const advancedPlan = "Avanzado";

export const PlansTable = (props) => {
  const { plans, isLoadingPlans } = useStripePlans();

  const { t } = useTranslation("components.plans-table");

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
    value === "yes" ? <CheckOutlined style={{ color: darkTheme.basic.primary }} /> : <CloseOutlined />;

  const CallToActionContentSection = React.memo(
    ({ plan, index_ }) => {
      if (!props.showCallToActionSection) return <td />;

      if (hasPlan)
        return (
          <td>
            <StripeCustomerPortalLink>
              {planIndex > index_ ? (
                <ButtonAnt variant="outlined" color="dark">
                  {t("downgrade-plan")}
                </ButtonAnt>
              ) : planIndex === index_ ? (
                <ButtonAnt variant="outlined" color="dark">
                  {t("cancel-plan")}
                </ButtonAnt>
              ) : (
                <ButtonAnt>{t("upgrade-plan")}</ButtonAnt>
              )}
            </StripeCustomerPortalLink>
          </td>
        );

      if (!plan?.name?.toLowerCase().includes("gratis") && !plan?.name?.toLowerCase().includes("exclusivo"))
        return (
          <td>
            <ButtonAnt
              loading={props.isLoadingCheckoutPlan}
              onClick={() => {
                props.onSelectedPlan?.(plan, isMonthly ? getYearlyPrice(plan) : getMonthlyPrice(plan));
              }}
            >
              {t("get-plan")}
            </ButtonAnt>
          </td>
        );

      return <td/>;
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
            {specsOrder.map((specLabel, index) => index === 0
              ? (<td key={`spec-key-${index}`} style={{ borderRadius: "15px 0 0 0" }}>{t(specLabel)}</td>)
              : (specsOrder.length - 1) === index
              ? (<td key={`spec-key-${index}`} style={{ borderRadius: "0 0 0 15px" }}>{t(specLabel)}</td>)
              : (<td key={`spec-key-${index}`}>{t(specLabel, specLabel)}</td>)
            )}
          </tr>

          {plans.map((plan, index_) => (
            <tr key={`${plan.name}-index`}>
              <td>
                <div className={`plan  text-center ${plan.name.toLowerCase()}`}>
                  <div className="name mb-4">{plan.name}</div>
                  {plan.name === "Exclusivo" ? (
                    <button className="btn-contact mb-4">
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

                  <div
                    className={`description mb-4 ${
                      advancedPlan === plan.name || plan.name === "Exclusivo" ? "select" : ""
                    }`}
                  >
                    {plan.name === "Exclusivo" ? (
                      <Anchor url="/#contact">
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
                  {planIndex === index_ && <span className="text-black font-bold text-base">{t("current-plan")}</span>}
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
                  {plan.metadata[keySpec] === "yes" || plan.metadata[keySpec] === "no"
                    ? getYesNoIcon(plan.metadata[keySpec])
                    : t(plan.metadata[keySpec], plan.metadata[keySpec])}
                </td>
              ))}

              {plan.metadata.recommended === "true" && <span className="selected" />}
              {props.showMostPopularBadge && plan.metadata.recommended === "true" && (
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
      td:nth-child(2)
      ${(props) => ((props.showCallToActionSection && props.hasPlan) ? ", td:nth-child(3)" : "")}
      {
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
    z-index: 99;
    border-radius: 13px 13px 0px 0px;
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

  ${mediaQuery.afterTablet} {
    width: 100%;
    padding: 100px 2rem;
  }
`;

const Star = styled.div`
  position: absolute;
  z-index: 99;
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
