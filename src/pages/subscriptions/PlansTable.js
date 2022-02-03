import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { getYearlyPrice, getMonthlyPrice } from "../../stripe";
import { getCurrencySymbol } from "../../components/common/DataList";
import { config } from "../../firebase";
import { Anchor, Switch } from "../../components/form";
import { darkTheme } from "../../theme";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useStripePlans } from "../../hooks/useStripePlans"

const specsOrder = ['users', 'live_chat', 'reporting', 'progress_tracking', 'players_identity'];

export const PlansTable = (props) => {
  const [currentPlan] = useState("Avanzado");

  const { plans } = useStripePlans();

  const anualPhrase = (price) => (<p>por admin al año (<span className="whitespace-nowrap">{price}</span> mensualmente)</p>);
  const monthlyPhrase = (price) => (<p>por admin al mes (<span className="whitespace-nowrap">{price}</span> anualmente)</p>);

  const getYesNoIcon = (value) => value === 'yes' ? <CheckOutlined style={{ color: darkTheme.basic.primary }}/> : <CloseOutlined/>;

  return (
    <TableContainer>

      <table border="0">
        <tbody>
          <tr>
            <td>
              <div>
                <div className="pb-8 table-title">Comparar planes</div>
              </div>
            </td>
            <td style={{ borderRadius: '15px 0 0 0' }}>Personas por juego</td>
            <td>Chat vivo</td>
            <td>Reporte</td>
            <td>Trackear progreso</td>
            <td>Identificar participantes</td>
          </tr>

          {plans.map((plan, index_) => (
            <tr key={`${plan.name}-index`}>
              <td>
                <div className={`plan  text-center ${plan.name.toLowerCase()}`}>
                  <div className="name mb-4">{plan.name}</div>
                  {plan.name === "Exclusivo"
                    ? (<button className="btn-contact mb-4">
                      Contactar
                      <br />
                      ventas
                    </button>)
                    : props?.isMonthly
                    ? (
                      <div className="price text-center mb-4">
                        <span className="text-2xl align-super">{getCurrencySymbol[getMonthlyPrice(plan)?.currency]}</span> {getMonthlyPrice(plan)?.amount}
                      </div>
                    )
                    : (
                      <div className="price text-center mb-4">
                        <span className="text-2xl align-super">{getCurrencySymbol[getYearlyPrice(plan)?.currency]}</span> {getYearlyPrice(plan)?.amount}
                      </div>
                    )}

                  <div className="divider" />

                  <div
                    className={`description mb-4 ${currentPlan === plan.name || plan.name === "Exclusivo" ? "select" : ""}`}
                  >
                    {plan.name === "Exclusivo"
                      ? (<Anchor url="/#contact"><span className="font-bold text-base text-black underline underline-offset-2">{plan.description}</span></Anchor>)
                      : plan.description
                      ? plan.description
                      : props?.isMonthly
                      ? monthlyPhrase(`${getCurrencySymbol[getMonthlyPrice(plan)?.currency]} ${(getMonthlyPrice(plan)?.amount * 12).toFixed(2)}`)
                      : anualPhrase(`${getCurrencySymbol[getYearlyPrice(plan)?.currency]} ${(getYearlyPrice(plan)?.amount / 12).toFixed(2)}`)}
                  </div>
                </div>
              </td>


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
                    : plan.metadata[keySpec]
                  }
                </td>
              ))}

              {plan.metadata.recommended === "true" && <div className="selected" />}
              {plan.metadata.recommended === "true" && (
                <Star backgroundImg={`${config.storageUrl}/resources/plan-star.png`}>Más popular</Star>
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
      width: 190px;

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
        padding: 0.5rem;
        background: ${(props) => props.theme.basic.whiteLight};
      }

      td:first-child {
        height: 250px;
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
