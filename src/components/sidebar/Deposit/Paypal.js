import React, {useGlobal, useState} from "reactn";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import {currentUrlQuery} from "../../../utils/queryUrl";
import styled from "styled-components";
import {config} from "../../../firebase";
import {FUNDING, PayPalButtons, PayPalScriptProvider,} from "@paypal/react-paypal-js";
import {message} from "antd";
import {spinLoader} from "../../../utils";
import {SpinLoader} from "../../../styles";
import {mediaQuery} from "../../../styles/constants";
import ReactPixel from "react-facebook-pixel";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../../utils/useFetch/useFetch";
import {Input} from "../../common";
import sizes from "../../../styles/constants/sizes";

export const Paypal = (props) => {
  const [globalSettings] = useGlobal("settings");
  const [currentCurrency] = useGlobal("currentCurrency");
  const [authUser] = useGlobal("user");

  const [, setOrderID] = useState(false);
  const [loadingPaypalPayment, setLoadingPaypalPayment] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const minCharge = 10;

  const createOrder = (data, actions) =>
    actions.order
      .create({
        purchase_units: [
          {
            amount: {
              value: props.amount,
            },
          },
        ],
      })
      .then((orderID) => {
        setOrderID(orderID);
        console.log(orderID);
        return orderID;
      });

  const approvePayment = async (data, actions) => {
    try {
      const order = await actions.order.capture();
      const coupon = get(props, "currentCoupon.coupon", null);

      const response = await ownFetch(
        `${config.serverUrl}/users/${authUser.id}/paypal`,
        "POST",
        {
          order,
          coupon,
        }
      );

      const transaction_ = await props.fetchTransaction(response.transactionId);

      if (get(transaction_, "extra2.status") === "COMPLETED")
        ReactPixel.track("Purchase", {
          currency: "USD",
          value: +get(transaction_, "payment", 0),
        });

      props.topUpMoneyMessage(transaction_.description, true);
    } catch (error) {
      handleError({ ...error, action: "approvePayment" });
    }
    setLoadingPaypalPayment(false);
  };

  return (
    <Container>
      {loadingPaypalPayment && (
        <div className="process-payment">
          <h5>Se esta procesando la compra</h5>
          <SpinLoader>{spinLoader()}</SpinLoader>
        </div>
      )}
      <fieldset className={loadingPaypalPayment ? "hidden" : ""}>
        <img src={`${config.storageUrl}/resources/p-paypal.svg`} alt="" />
        <div className="container-card">
          Monto a depositar
          <div className="amount-container">
            <Input
              variant="secondary"
              name="transaction_amount"
              type="number"
              min={get(globalSettings, "minimumChargeAmount", minCharge)}
              defaultValue={props.amount}
              onChange={(amount) => {
                props.setAmount_(+amount.target.value);
                props.setCurrentCoupon(null);
                setOrderID(false);
              }}
            />
          </div>
        </div>
        <div className="container-card">
          Código de promoción (opcional)
          <Input
            variant="secondary"
            type="text"
            id="couponCode"
            name="couponCode"
            autoComplete="off"
            placeholder="Ingresa tu cupón"
            defaultValue={defaultTo(currentUrlQuery("coupon"), "")}
            onBlur={(event) =>
              props.validateCoupon({ couponCode: event.target.value })
            }
          />
          {props.currentCoupon && (
            <span className="coupon-validation">Codigo valido</span>
          )}
        </div>
        <div className="pre-order">
          <div className="deposit-money">
            <span>Total a depositar: </span>
            <span>{`${currentCurrency} ${props.amount.toFixed(2)}`}</span>
          </div>
          <div
            className="receive-money"
            key={`key-details-${get(props.currentCoupon, "id")}`}
          >
            <span>
              {get(props.currentCoupon, "coupon.discountType") === "ebCoins"
                ? "Dinero jugable a recibir:"
                : "Total a recibir:"}
            </span>
            <span className="eb-coins">
              {get(props.currentCoupon, "coupon.discountType") === "ebCoins"
                ? `${props.currentCoupon.additionalMoney.toLocaleString()} k`
                : `${currentCurrency} ${
                    props.currentCoupon
                      ? (
                          props.amount + props.currentCoupon.additionalMoney
                        ).toFixed(2)
                      : props.amount.toFixed(2)
                  }`}
            </span>
          </div>
        </div>
        {props.loadingValidateCoupon ? (
          <SpinLoader>{spinLoader()}</SpinLoader>
        ) : props.amount >=
          get(globalSettings, "minimumChargeAmount", minCharge) ? (
          <PayPalScriptProvider
            options={{ "client-id": `${config.paypal.clientId}` }}
          >
            <PayPalButtons
              key={`key-btn-paypa-${get(props, "currentCoupon.coupon.id")}`}
              fundingSource={FUNDING.PAYPAL}
              createOrder={createOrder}
              forceReRender={props.amount}
              onApprove={approvePayment}
              onClick={() => setLoadingPaypalPayment(true)}
              onCancel={() => setLoadingPaypalPayment(false)}
              onError={() => {
                setLoadingPaypalPayment(false);
                message.error("Algo salio mal");
              }}
            />
          </PayPalScriptProvider>
        ) : (
          <div className="danger-message">
            MONTO MINIMO ES DE{" "}
            {get(globalSettings, "minimumChargeAmount", minCharge)}
          </div>
        )}
      </fieldset>
    </Container>
  );
};

const Container = styled.div`
  font-size: 12px;

  .danger-message {
    color: ${(props) => props.theme.basic.danger};
  }

  .hidden {
    visibility: hidden;
    height: 0;
  }

  fieldset {
    margin: 1rem 0 !important;
    border: none;
    padding: 0 !important;
    img {
      margin: 0.5rem 0;
    }

    .container-card {
      color: ${(props) => props.theme.basic.blackLighten};
      position: relative;
      font-weight: bold;
      .amount-container {
        align-items: center;
      }
      .amount-container:before {
        content: "$";
        position: absolute;
        top: 26px;
        left: -10px;
        font-weight: bold;
        font-size: ${sizes.font.normal};
        line-height: 14px;
      }

      .coupon-validation {
        color: ${(props) => props.theme.basic.primary};
      }
    }

    .pre-order {
      width: 60%;
      margin: 1rem 0 !important;
      color: ${(props) => props.theme.basic.blackLighten};

      ${mediaQuery.afterMobile} {
        width: 50%;
      }

      .deposit-money{
        display: flex;
        justify-content: space-between;
        font-size: ${sizes.font.normal};
        color: ${(props) => props.theme.basic.grayLight};
        font-weight: bold;
        line-height: 14px;
      }
      
      .receive-money {
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        color: ${(props) => props.theme.basic.blackLighten};
        font-size: ${sizes.font.extraLarge};
        line-height: 17px;
      }

      .receive-money {
        font-weight: bold;

        .eb-coin {
          white-space: nowrap;
        }
      }
    }
  }

  .loading {
    width: 100%;
    height: 40px;
  }

  .process-payment {
    margin: 1rem 0;

    h5 {
      color: ${(props) => props.theme.basic.white};
      font-size: 12px;
      text-align: center;
    }
  }
`;
