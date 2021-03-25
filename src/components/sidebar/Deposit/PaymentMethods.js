import React, {useState} from "reactn";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import styled from "styled-components";
import {foreignPaymentMethods, paymentMethods} from "../../common/DataList";
import {useEffect} from "react";
import {darkTheme} from "../../../styles/theme";

export const PaymentMethods = (props) => {
  const [currentPaymentType, setCurrentPaymentType] = useState(null);

  useEffect(() => {
    props.isForeign
        ? setCurrentPaymentType(foreignPaymentMethods[0].value)
        : setCurrentPaymentType(paymentMethods[0].value);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currentMethodValue = () =>
    props.selectedPaymentMethod
      ? props.selectedPaymentMethod.value
      : defaultTo(currentPaymentType, "");

  const currentPaymentMethods = () =>
    props.isForeign ? foreignPaymentMethods : paymentMethods;

  const onClickPaymentMethod = (method) =>
    props.onClick && props.onClick(method);

  return (
    <PaymentTypesContainer>
      <div className="methods-items">
        {currentPaymentMethods().map((method, index) => (
          <div
            key={`key-methods-items-${method.value}`}
            className={`payment-options ${
              currentMethodValue() === method.value ? "item selected" : "item"
            }`}
            onClick={() => {
              setCurrentPaymentType(method.value);
              onClickPaymentMethod(method);
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
        ))}
      </div>
    </PaymentTypesContainer>
  );
};

const PaymentTypesContainer = styled.div`
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
      .svg-payPal {
        transform: translateX(5px);
        -ms-transform: translateX(5px);
        -webkit-transform: translateX(5px);
      }
      .svg-plin {
        transform: translate(15px, 5px);
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
