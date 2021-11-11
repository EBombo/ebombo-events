import React, { useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../constants";
import { plans } from "../../components/common/DataList";

export const PlansTable = (props) => {
  const [currentPlan, ] = useState("Avanzado");

  return (
    <TableContainer>
      <table border="0">
        <tbody>
          <tr>
            <td>
              <div className="plan table-title">Comparar planes</div>
            </td>
            <td>Personas por juego</td>
            <td>Juegos </td>
            <td>Licencias </td>
            <td>Chat vivo</td>
            <td>Premio personalizados </td>
            <td>Modificar la múscia</td>
            <td>Reporte</td>
            <td>Trackear progreso</td>
            <td>Identificar participantes </td>
            <td>Encuesta de satisfacción al final del juego </td>
            <td>Modo equipo </td>
            <td>Capacitación de plataforma</td>
            <td>Modificación de colores del juego </td>
            <td>Logo de la empresa dentro del juego</td>
          </tr>

          {plans.map((plan, index) => (
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
                  <div className="description">{plan.description}</div>
                </div>
              </td>
              {plan.specs.map((spec, index) => (
                <td key={index}>{spec}</td>
              ))}
              {currentPlan === plan.name && <div className="selected" />}
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  width: 1000px;
  padding: 1rem;
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
    padding: 2rem;
  }
`;
