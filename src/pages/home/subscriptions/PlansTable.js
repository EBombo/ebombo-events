import React from "reactn";
import styled from "styled-components";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { mediaQuery } from "../../../constants";

export const PlansTable = (props) => {
  return (
    <TableContainer>
      <table border="0">
        <tbody>
          <tr>
            <td>
              <div className="plan table-title">Comparar planes</div>
            </td>
            <td>Lorem ipsum</td>
            <td>Lorem ipsum</td>
            <td>Lorem ipsum</td>
            <td>Lorem ipsum</td>
            <td>Lorem ipsum</td>
            <td>Lorem ipsum</td>
            <td>Lorem ipsum</td>
          </tr>

          <tr>
            <td>
              <div className="plan standard">
                <div className="name">{props.subscriptions[props.tab]?.standardPlan?.name || "Estandar"}</div>
                <div className="price">$ {props.subscriptions[props.tab]?.standardPlan?.price || ""}</div>
                <div className="divider" />
                <div className="description">{props.subscriptions[props.tab]?.standardPlan?.description || ""}</div>
              </div>
            </td>
            <td>20</td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CloseOutlined />
            </td>
            <td>
              <CloseOutlined />
            </td>
            <td>
              <CloseOutlined />
            </td>
            <td>
              <CloseOutlined />
            </td>
            {props.currentPlan === "standard" && <div className="selected" />}
          </tr>
          <tr>
            <td>
              <div className="plan pro">
                <div className="name">{props.subscriptions[props.tab]?.proPlan?.name || "Estandar"}</div>
                <div className="price">$ {props.subscriptions[props.tab]?.proPlan?.price || ""}</div>
                <div className="description">{props.subscriptions[props.tab]?.proPlan?.description || ""}</div>
              </div>
            </td>
            <td>20</td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            {props.currentPlan === "pro" && <div className="selected" />}
          </tr>
          <tr>
            <td>
              <div className="plan presenter">
                <div className="name">{props.subscriptions[props.tab]?.presenterPlan?.name || "Estandar"}</div>
                <div className="price">$ {props.subscriptions[props.tab]?.presenterPlan?.price || ""}</div>
                <div className="description">{props.subscriptions[props.tab]?.presenterPlan?.description || ""}</div>
              </div>
            </td>
            <td>20</td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CheckOutlined />
            </td>
            <td>
              <CloseOutlined />
            </td>
            <td>
              <CloseOutlined />
            </td>
            {props.currentPlan === "presenter" && <div className="selected" />}
          </tr>
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
    tr {
      display: table-cell;
      position: relative;
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
      color: ${(props) => props.theme.basic.primary};
    }

    .price {
      font-family: Lato;
      font-style: normal;
      font-weight: 800;
      font-size: 47.2172px;
      line-height: 57px;
      color: ${(props) => props.theme.basic.primary};
    }

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.black};
      text-align: center;
      max-width: 80%;
    }
  }

  .pro {
    .name {
      color: ${(props) => props.theme.basic.blackDarken};
    }
    .price {
      color: ${(props) => props.theme.basic.blackDarken};
    }
  }

  .presenter {
    .name {
      color: ${(props) => props.theme.basic.primaryLighten};
    }

    .price {
      color: ${(props) => props.theme.basic.primaryLighten};
    }
  }

  ${mediaQuery.afterTablet} {
    width: 100%;
    padding: 2rem;
  }
`;
