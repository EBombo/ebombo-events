import React, { useState, useGlobal } from "reactn";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import styled from "styled-components";
import { withdrawMethods } from "../../../../components/common/DataList";
import { darkTheme } from "../../../../styles/theme";
import { useLocation } from "../../../../hoc/useLocalStorageState";

export const WithdrawMethods = (props) => {
  const [authUser] = useGlobal("user");
  const [locationLS] = useLocation();

  const [currentWithdrawType, setCurrentWithdrawType] = useState(
    withdrawMethods[0].value
  );

  const currentMethodValue = () =>
    props.selectedWithdrawMethod
      ? props.selectedWithdrawMethod.value
      : defaultTo(currentWithdrawType, "");

  const onClickWithdrawMethod = (method) =>
    props.onClick && props.onClick(method);

  const isPeruvian = () =>
    get(authUser, "countryCode") || get(locationLS, "country_code");

  return (
    <WithdrawTypesContainer>
      <div className="methods-items">
        {withdrawMethods.map((method, index) =>
          method.name.includes("PayPal") ||
          (method.name.includes("Per") && isPeruvian() === "PE") ? (
            <div
              key={`key-methods-items-${method.value}`}
              className={`payment-options ${
                currentMethodValue() === method.value ? "item selected" : "item"
              }`}
              onClick={() => {
                setCurrentWithdrawType(method.value);
                onClickWithdrawMethod(method);
              }}
            >
              <svg
                width="54"
                height="54"
                viewBox="0 0 54 54"
                className={`svg-${method.value}`}
              >
                {method.paths.map((pathD) => (
                  <path
                    key={pathD}
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d={pathD}
                    fill={
                      currentMethodValue() === method.value
                        ? darkTheme.basic.primary
                        : darkTheme.basic.blackLighten
                    }
                  />
                ))}
              </svg>

              <span className="item-name"> {get(method, "name", "-")} </span>
            </div>
          ) : null
        )}
      </div>
    </WithdrawTypesContainer>
  );
};

const WithdrawTypesContainer = styled.div`
  height: 100%;
  width: 100%;
  left: 0;
  overflow: auto;

  .methods-items {
    height: 76px;
    width: 100%;
    overflow: auto;
    margin: 0 auto;
    display: -webkit-box;

    .item {
      border: 2px solid ${(props) => props.theme.basic.blackLighten};
      background: transparent;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: ${(props) => props.theme.basic.blackLighten};
      cursor: pointer;
      min-width: 4.5rem;
      animation: ease-in 0.5s;
      border-radius: 5px;
      margin: 0 5px 0 0;
      position: relative;
      overflow: hidden;

      span {
        position: absolute;
        bottom: 2px;
        text-align: center;
        font-size: 11px;
        font-weight: 600;
      }

      svg {
        margin: auto auto;
        height: 100%;
        width: 90%;
      }

      .svg-rapyd {
        transform: scale(0.8) translate(5px, -5px);
        -ms-transform: scale(0.8) translate(5px, -5px);
        -webkit-transform: scale(0.8) translate(5px, -5px);
      }

      .svg-bankTransfer {
        transform: translate(15px, 10px);
        -ms-transform: translate(15px, 10px);
        -webkit-transform: translate(15px, 10px);
      }

      .svg-paypal {
        transform: translateX(5px);
        -ms-transform: translateX(5px);
        -webkit-transform: translateX(5px);
      }
    }

    .selected {
      border: 2px solid ${(props) => props.theme.basic.primary};

      span {
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
