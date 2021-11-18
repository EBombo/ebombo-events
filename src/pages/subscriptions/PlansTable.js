import React, { useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { plans } from "../../components/common/DataList";
import { config } from "../../firebase";

export const PlansTable = (props) => {
  const [currentPlan] = useState("Avanzado");

  return (
    <TableContainer>
      <table border="0">
        <tbody>
          <tr>
            <td>
              <div className="plan table-title">Comparar planes</div>
            </td>
            <td style={{ borderRadius: "15px 0 0 0" }}>Personas por juego</td>
            <td>Juegos</td>
            <td>Licencias</td>
            <td>Chat vivo</td>
            <td>Premio personalizados</td>
            <td>Modificar la múscia</td>
            <td>Reporte</td>
            <td>Trackear progreso</td>
            <td>Identificar participantes</td>
            <td>Encuesta de satisfacción al final del juego</td>
            <td>Modo equipo</td>
            <td>Capacitación de plataforma</td>
            <td>Modificación de colores del juego</td>
            <td style={{ borderRadius: "0 0 0 15px" }}>Logo de la empresa dentro del juego</td>
          </tr>

          {plans.map((plan, index_) => (
            <tr key={`${plan.name}-index`}>
              <td>
                <div className={`plan ${plan.name.toLowerCase()}`}>
                  <div className="name">{plan.name}</div>
                  {plan.name === "Exclusivo" ? (
                    <button className="btn-contact">
                      Contactar
                      <br />
                      ventas
                    </button>
                  ) : (
                    <div className="price">$ {plan.price}</div>
                  )}

                  <div className="divider" />

                  <div
                    className={`description ${currentPlan === plan.name || plan.name === "Exclusivo" ? "select" : ""}`}
                  >
                    {plan.description}
                  </div>
                </div>
              </td>

              {plan.specs.map((spec, index) => (
                <td
                  key={index}
                  style={
                    index_ === plans.length - 1
                      ? {
                          borderRadius:
                            index === 0 ? "0 15px 0 0" : index === plan.specs.length - 1 ? "0 0 15px 0" : "",
                        }
                      : {}
                  }
                >
                  {spec}
                </td>
              ))}

              {currentPlan === plan.name && <div className="selected" />}
              {currentPlan === plan.name && (
                <Star backgroundImg={`${config.storageUrl}/resources/plan-star.png`}>Más pouplar</Star>
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
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    flex-direction: column;
    height: 250px;

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
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayLight};
      text-align: center;
      max-width: 80%;
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
