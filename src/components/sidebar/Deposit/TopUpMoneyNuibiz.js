import React, {useEffect, useGlobal, useState} from "reactn";
import {spinLoader} from "../../../utils";
import {config, firestore} from "../../../firebase";
import UrlAssembler from "url-assembler";
import {message} from "antd";
import {BackButton, ButtonBombo} from "../../index";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {currentUrlQuery} from "../../../utils/queryUrl";
import {PaymentContainer, TopUpMoneyContainer, VisanetContainer,} from "../../../styles/pages/profile";
import {generateToken} from "./Visanet";
import moment from "moment";
import {googleTagManagerChargeArgs} from "../../../utils/googleTagManager";
import {PaymentMethods} from "./PaymentMethods";
import {darkTheme} from "../../../styles/theme";
import {foreignPaymentMethods} from "../../common/DataList";
import {Paypal} from "./Paypal";
import ReactPixel from "react-facebook-pixel";
import {SpinLoader} from "../../../styles";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../../utils/useFetch/useFetch";
import {Input} from "../../common";

const minCharge = 20;

export const TopUpMoneyNuibiz = (props) => {
  const [authUser] = useGlobal("user");
  const [location] = useGlobal("location");
  const [globalSettings] = useGlobal("settings");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [currentCurrency] = useGlobal("currentCurrency");
  const [loadingValidateCoupon, setLoadingValidateCoupon] = useState(false);
  const [loadingNuibizResources, setLoadingNuibizResources] = useState(false);

  const [successfulPayment, setSuccessfulPayment] = useState(false);
  const [finishPayment, setFinishPayment] = useState(false);
  const [messagePayment, setMessagePayment] = useState("");
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [methodPayment, setMethodPayment] = useState(
    !props.hiddenGoBack ? foreignPaymentMethods[0] : {}
  );

  const [paymentMethodSelected, setPaymentMethodSelected] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);

  const [purchaseNumber] = useState(
    String(Math.floor(1000 + Math.random() * 900000000))
  );

  const [amount, setAmount_] = useState(
    defaultTo(
      currentUrlQuery("amount"),
      get(globalSettings, "minimumChargeAmount", minCharge)
    )
  );
  const [currency] = useState("USD");

  const [paymentInformation, setPaymentInformation] = useState(null);
  const [paymentDate, setPaymentDate] = useState(null);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const schema = yup.object().shape({
    couponCode: yup.string().required(),
  });

  const { reset } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    methodPayment &&
      methodPayment.value !== "visa" &&
      setPaymentMethodSelected(false);
  }, [methodPayment]);

  useEffect(() => {
    +amount === 0 && reset({ couponCode: "" });
  }, [amount]);

  useEffect(() => {
    const couponCode = currentUrlQuery("coupon");
    couponCode && validateCoupon({ couponCode: couponCode });
  }, []);

  useEffect(() => {
    if (currentUrlQuery("transactionId")) {
      const showChargeInfo = async () => {
        const transaction = await fetchTransaction(
          currentUrlQuery("transactionId")
        );

        if (transaction) {
          transaction.action === "reject-card"
            ? topUpMoneyMessage(transaction.description, false)
            : topUpMoneyMessage(transaction.description, true);

          if (transaction.extra2) {
            setPaymentDate(transaction.createAt);
            setPaymentInformation(transaction.extra2);

            ReactPixel.track("Purchase", {
              currency: "USD",
              value: +get(transaction, "amount", 0),
            });
          }

          console.log(transaction.description);
        }
      };
      showChargeInfo();
    }
  }, []);

  const validateCoupon = async (data) => {
    if (!authUser) return setIsVisibleLoginModal(true);

    setLoadingValidateCoupon(true);

    try {
      const couponCode = data.couponCode.toUpperCase();

      const response = await fetchCoupon(couponCode);

      if (get(response, "coupon.coupon.discountType", "!free") === "free")
        setAmount_(0);

      setCurrentCoupon(get(response, "coupon", null));
    } catch (error) {
      handleError({ ...error, action: "validateCoupon" });
    }

    setLoadingValidateCoupon(false);
  };

  const fetchCoupon = async (couponCode) =>
    ownFetch(urlApiCoupon(couponCode), "GET");

  const urlApiCoupon = (couponCode) =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/coupons/:couponCode/:amount")
      .param({
        couponCode: couponCode,
        amount: +amount,
      })
      .toString();

  const showError = (couponHasError) => {
    message.error(couponHasError);
    setCurrentCoupon(null);
  };

  const nextStep = async () => {
    setPaymentMethodSelected(true);
    setLoadingNuibizResources(true);
    await generateToken(
      currentCoupon,
      amount,
      currency,
      purchaseNumber,
      authUser,
      location,
      setLoadingNuibizResources
    );
  };

  const freeCharge = async () => {
    setLoadingPayment(true);
    const freeCharge_ = {
      customerEmail: authUser.email,
      channel: "web",
      transactionToken: "freeCharge",
    };
    createCharge(freeCharge_);
  };

  const createCharge = async (data) => {
    try {
      console.log("entrando a enviar un envio gratis");
      const response = await ownFetch(
        `${config.serverUrl}/users/${authUser.id}/token/freeCharge/amount/0/currency/USD/purchase-number/0/coupon/${currentCoupon.coupon.id}/procesar_pago`,
        "POST",
        data
      );

      const transaction = await fetchTransaction(
        get(response, "transactionId", null)
      );

      if (transaction)
        topUpMoneyMessage(get(transaction, "message", "Realizado!"), true);
    } catch (error) {
      console.error(error);
      setCurrentCoupon(null);
    }
  };

  const fetchTransaction = async (transactionId) => {
    const transactionRef = await firestore
      .collection("transactions")
      .doc(transactionId)
      .get();

    if (!transactionRef.exists)
      throw Error("Transaction doesn't exist: " + transactionId);

    return transactionRef.data();
  };

  const topUpMoneyMessage = (responsePayment, successfulPayment) => {
    setMessagePayment(responsePayment);
    setSuccessfulPayment(successfulPayment);
    setCurrentCoupon(null);
    setAmount_(get(globalSettings, "minimumChargeAmount", minCharge));
    setFinishPayment(true);
    setLoadingPayment(false);
    if (successfulPayment) googleTagManagerChargeArgs();
  };

  const visaForm = () => (
    <VisanetContainer>
      <fieldset>
        <div className="container-card">
          Monto a depositar
          <div className="amount-container">
            <Input
              variant="secondary"
              name="transaction_amount"
              type="number"
              min={get(globalSettings, "minimumChargeAmount", minCharge)}
              defaultValue={amount}
              onChange={(amount) => {
                setAmount_(+amount.target.value);
                setFinishPayment(false);
                setCurrentCoupon(null);
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
              validateCoupon({ couponCode: event.target.value })
            }
          />
          {currentCoupon && (
            <span className="coupon-validation">Codigo valido</span>
          )}
        </div>
        <div className="pre-order">
          <div className="deposit-money">
            <span>Total a depositar: </span>
            <span>{`${currentCurrency} ${amount.toFixed(2)}`}</span>
          </div>
          <div
            className="receive-money"
            key={`key-details-${get(currentCoupon, "id")}`}
          >
            <span>
              {get(currentCoupon, "coupon.discountType") === "ebCoins"
                ? "Dinero jugable a recibir:"
                : "Total a recibir:"}
            </span>
            <span className="eb-coins">
              {get(currentCoupon, "coupon.discountType") === "ebCoins"
                ? `${currentCoupon.additionalMoney.toLocaleString()} k`
                : `${currentCurrency} ${
                    currentCoupon
                      ? (amount + currentCoupon.additionalMoney).toFixed(2)
                      : amount.toFixed(2)
                  }`}
            </span>
          </div>
        </div>
        {paymentMethodSelected ? (
          <>
            {loadingNuibizResources && <SpinLoader>{spinLoader()}</SpinLoader>}
            <div id="btn_pago" />
          </>
        ) : (
          <ButtonBombo
            fontSize="1rem"
            margin="0"
            width="100%"
            loading={loadingPayment || loadingValidateCoupon}
            disabled={
              (get(currentCoupon, "coupon.discountType") !== "free" &&
                amount <
                  +get(globalSettings, "minimumChargeAmount", minCharge)) ||
              loadingPayment ||
              loadingValidateCoupon
            }
            onClick={() =>
              !authUser
                ? setIsVisibleLoginModal(true)
                : amount > 0
                ? nextStep()
                : freeCharge()
            }
          >
            Siguiente
          </ButtonBombo>
        )}
      </fieldset>
      <div className="visa-secure">
        <img src={`${config.storageUrl}/resources/visa-secure.png`} alt="" />
        <p>Todas las transacciones estan verificadas por Visa</p>
      </div>
    </VisanetContainer>
  );

  const payments = () => (
    <div className="payments-info">
      <div className="sub-title">{methodPayment.steps.stepTitle}</div>
      <ol>
        <li>{methodPayment.steps.stepOne}</li>
        <li>{methodPayment.steps.stepTwo}</li>
        <li>{methodPayment.steps.stepThree}</li>
      </ol>
      {methodPayment.value === "payPal" ? (
        <ButtonBombo
          margin="0 0 0 5px"
          padding="0.5rem 3rem;"
          border="none"
          color={darkTheme.basic.white}
          colorEvents={darkTheme.basic.white}
          background={darkTheme.paypal.primary}
          bgColorEvents={darkTheme.paypal.primary}
          fontSize="20px"
          fontStyle="italic"
          borderRadius="5px"
          onClick={() =>
            window.open("https://paypal.me/bomboperu?locale.x=es_XC", "_blank")
          }
        >
          PayPal
        </ButtonBombo>
      ) : (
        <ButtonBombo
          margin="0 0 0 5px"
          padding="0.5rem 1rem;"
          onClick={() => window.open(config.wspUrl, "_blank")}
        >
          Haz click aquí para hablarnos por Whatsapp
        </ButtonBombo>
      )}
    </div>
  );

  const paymentMethodContent = () => {
    switch (methodPayment.value) {
      case "visa":
        return visaForm();
      case "payPal":
        return (
          <Paypal
            setAmount_={setAmount_}
            amount={amount}
            currentCoupon={currentCoupon}
            setCurrentCoupon={setCurrentCoupon}
            validateCoupon={validateCoupon}
            loadingValidateCoupon={loadingValidateCoupon}
            fetchTransaction={fetchTransaction}
            topUpMoneyMessage={topUpMoneyMessage}
          />
        );
      default:
        return props.hiddenGoBack && !methodPayment.value ? null : payments();
    }
  };

  return loadingPayment ? (
    spinLoader()
  ) : (
    <TopUpMoneyContainer>
      {!props.hiddenGoBack && (
        <BackButton
          onClick={() => props.setTabContainer("menu")}
          color={darkTheme.basic.blackLighten}
        />
      )}
      <h1>Depositar</h1>
      {finishPayment && (
        <div
          className={
            successfulPayment ? "bombo-message success" : "bombo-message failed"
          }
        >
          <div>
            {get(authUser, "name", " ")} {get(authUser, "lastName", " ")}
          </div>
          <div>
            {paymentInformation ? (
              successfulPayment ? (
                <>
                  <p>{messagePayment}</p>
                  <p>
                    Número de pedido: {paymentInformation.order.purchaseNumber}
                  </p>
                  <p>Tarjeta: {paymentInformation.dataMap.CARD}</p>
                  <p>Fecha: {moment(paymentDate.toDate()).format("LLL")}</p>
                  <p>{paymentInformation.dataMap.ACTION_DESCRIPTION}</p>
                  <p>
                    Se ha enviado recibo a su correo, sugerimos que lo imprima y
                    conserve
                  </p>
                </>
              ) : (
                <>
                  <p>{messagePayment}</p>
                  <p>Motivo: {paymentInformation.data.ACTION_DESCRIPTION}</p>
                  <p>Número de pedido: {paymentInformation.purchaseNumber}</p>
                  <p>Fecha: {moment(paymentDate.toDate()).format("LLL")}</p>
                </>
              )
            ) : (
              <>
                <p>{messagePayment}</p>
              </>
            )}
          </div>
        </div>
      )}
      {(!loadingPayment || finishPayment) && (
        <PaymentContainer>
          <PaymentMethods
            onClick={(method) => setMethodPayment(method)}
            selectedPaymentMethod={methodPayment}
            isForeign
          />
          {paymentMethodContent()}
        </PaymentContainer>
      )}
    </TopUpMoneyContainer>
  );
};
