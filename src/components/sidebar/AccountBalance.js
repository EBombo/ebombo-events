import React, {useGlobal} from "reactn";
import moment from "moment";
import styled from "styled-components";
import {fontWeightFont, mediaQuery} from "../../styles/constants";
import {BackButton} from "../index";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import defaultTo from "lodash/defaultTo";
import {darkTheme} from "../../styles/theme";

export const AccountBalance = (props) => {
  const [authUser] = useGlobal("user");
  const [currentCurrency] = useGlobal("currentCurrency");

  const parseJSONTimeStamp = (timestamp) =>
    moment(timestamp.seconds * 1000).toDate();

  const formatMoney = (money) =>
    typeof money == "number" ? defaultTo(money, 0).toFixed(2) : "Invalid Value";

  return (
    <AccountBalanceWithStyle>
      <BackButton
        onClick={() => props.setTabContainer("menu")}
        color={darkTheme.basic.blackLighten}
      />
      <div className="title">
        <div className="item-title">Ebombo creditos</div>
        <div className="item-description">
          ¡El dinero que recibes gratis para jugar tiene fecha de vencimiento,
          asegúrate de utilizarlo antes!
        </div>
      </div>
      <div className="body">
        <div className="name-t">Dinero Disponible</div>
        <div>
          <div className="t-head">
            <div className="item-1">Dinero</div>
            <div className="item-2">Fecha de vencimiento</div>
          </div>
          <div className="t-body">
            <div className="item-container">
              <div className="item-1">{`${currentCurrency} ${formatMoney(
                get(authUser, "money")
              )}`}</div>
              <div className="item-2">DINERO RETIRABLE</div>
            </div>
            {orderBy(
              get(authUser, "expiringMoney", []),
              ["expireDate"],
              ["asc"]
            ).map((money, index) => (
              <div className="item-container" key={index}>
                <div className="item-1">{`${currentCurrency} ${money.money}`}</div>
                <div className="item-2">
                  {moment(parseJSONTimeStamp(money.expireDate)).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AccountBalanceWithStyle>
  );
};

const AccountBalanceWithStyle = styled.div`
  color: ${(props) => props.theme.basic.blackLighten};
  width: 100%;
  height: 100%;
  margin: auto;

  padding: 10px 15px;

  .body {
    padding: 0px 13px;
  }

  .title {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;

    .item-title {
      color: ${(props) => props.theme.basic.primary};
      ${fontWeightFont(600)};
      font-size: 17px;
      text-align: center;
    }

    .item-description {
      text-align: center;

      ${mediaQuery.afterTablet} {
        width: 50%;
      }
    }
  }

  .t-head {
    border: 1px solid ${(props) => props.theme.basic.blackDarken};

    div {
      background: ${(props) => props.theme.basic.blackDarken};
      color: ${(props) => props.theme.basic.white};
      ${fontWeightFont(600)};
      font-size: 13px;
      text-align: center;
      padding: 10px 0px 10px 13px;
    }

    display: grid;
    grid-template-columns: 30% 70%;

    .item-2 {
      text-align: center;
    }
  }

  .name-t {
    ${fontWeightFont(600)};
    margin: 16px 0;
  }

  .t-body {
    border: none;

    .item-container {
      border: 1px solid ${(props) => props.theme.basic.blackDarken};
      display: grid;
      grid-template-columns: 30% 70%;

      div {
        padding: 10px 0px 10px 13px;
        text-align: center;
      }

      .item-1 {
        color: ${(props) => props.theme.basic.white};
        font-size: 13px;
        ${fontWeightFont(600)};
        border-right: 1px solid ${(props) => props.theme.basic.blackDarken};
        background: ${(props) => props.theme.basic.blackLighten};
      }

      .item-2 {
        color: ${(props) => props.theme.basic.white};
        font-size: 13px;
        text-align: center;
        background: ${(props) => props.theme.basic.blackLighten};
      }
    }
  }
`;
