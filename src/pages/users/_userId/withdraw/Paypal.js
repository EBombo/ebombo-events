import React, { useState, useGlobal } from "reactn";
import Input from "../../../../components/common/form/Input";
import { gaError, gaWithdraw } from "../../../../utils";
import { useForm } from "react-hook-form";
import { message } from "antd";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import UrlAssembler from "url-assembler";
import { config } from "../../../../firebase";
import { number, string, object } from "yup";
import styled from "styled-components";
import { ButtonBombo } from "../../../../components";
import { mediaQuery } from "../../../../styles/constants";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";
import { darkTheme } from "../../../../styles/theme";
import sizes from "../../../../styles/constants/sizes";
import { Anchor } from "../../../../components/common/Anchor";

export const Paypal = (props) => {
  const [settings] = useGlobal("settings");
  const [authUser] = useGlobal("user");
  const [currentCurrency] = useGlobal("currentCurrency");

  const [loadingWithDraw, setLoadingWithDraw] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const schema = object().shape({
    amount: number()
      .required()
      .integer()
      .min(1)
      .typeError("Campo requerido.")
      .max(+get(authUser, "money", 0)),
    paypalLink: string().url().required(),
  });

  const { register, errors, handleSubmit, watch } = useForm({
    reValidateMode: "onSubmit",
    validationSchema: schema,
  });

  const saveWithdraw = async (data) => {
    try {
      setLoadingWithDraw(true);

      if (defaultTo(authUser.money, 0) < data.amount) {
        message.error("Saldo insuficiente", 5);
        setLoadingWithDraw(false);
        return;
      }

      if (defaultTo(settings.minWithdrawAmount, 0) > data.amount) {
        message.error(
          `Monto minimo de retiro: ${settings.minWithdrawAmount}`,
          3
        );
        setLoadingWithDraw(false);
        return;
      }

      await ownFetch(urlApiWithDraw(), "POST", data);

      gaWithdraw(+data.amount);

      message.success("Retiro exitoso", 5);

      setLoadingWithDraw(false);
    } catch (error) {
      gaError("Error", "POST /users/:userId/withdraw/:amount");

      handleError({ ...error, action: "saveWithdraw" });
    }
    setLoadingWithDraw(false);
  };

  const urlApiWithDraw = () => {
    return new UrlAssembler(`${config.serverUrl}`)
      .template("/users/:userId/withdraw-paypal")
      .param({
        userId: authUser.id,
      })
      .toString();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(saveWithdraw)} noValidate>
        <div className="item-with-draw">
          <label>Método de Retiro:</label>
          <img src={`${config.storageUrl}/resources/p-paypal.svg`} alt="" />
        </div>
        <div className="item-with-draw">
          <label>Email de pay pal</label>
          <div>
            <Input
              type="url"
              variant="secondary"
              name="paypalLink"
              error={errors.paypalLink}
              ref={register}
              marginBottom="0 !important"
              placeholder="Coloca tu email de Pay-Pal"
            />
          </div>
        </div>

        <div className="item-with-draw amount">
          <label>
            Monto a retirar{" "}
            <span>
              Min {currentCurrency}
              {get(settings, "minWithdrawAmount", 0).toFixed(2)}
            </span>
          </label>
          <div className="input-amount">
            <Input
              type="number"
              variant="secondary"
              name="amount"
              error={errors.amount}
              ref={register}
              marginBottom={"0 !important"}
              defaultValue={(0).toFixed(2)}
              step="0.01"
              placeholder={"Coloca el monto a retirar"}
            />
          </div>
        </div>
        <div className="summary">
          <div className="withdraw-amount">
            <div className="description">Total a retirar de cuenta:</div>
            <span>
              {currentCurrency} {defaultTo(watch("amount"), 0)}
            </span>
          </div>
          <div className="account-balance">
            <div className="description">Saldo en cuenta:</div>
            <span>
              {currentCurrency}{" "}
              {get(authUser, "money", 0) - defaultTo(watch("amount"), 0)}
            </span>
          </div>
          <div className="receive-withdraw">
            <div className="description">Total a recibir:</div>
            <span>
              {currentCurrency} {defaultTo(watch("amount"), 0)}
            </span>
          </div>
        </div>
        <ButtonBombo
          margin="1rem 0"
          type="secondary"
          colorEvents={darkTheme.basic.blackLighten}
          color={darkTheme.basic.blackLighten}
          border={`1px solid ${darkTheme.basic.blackLighten}`}
          loading={loadingWithDraw}
          disabled={loadingWithDraw}
          htmlType="submit"
          fontWeight={"normal"}
        >
          RETIRAR
        </ButtonBombo>
      </form>
    </Container>
  );
};

const Container = styled.div`
  .item-with-draw {
    margin: 1rem 0;
    label {
      font-size: ${sizes.font.normal};
      line-height: 14px;
      display: flex;
      justify-content: space-between;
      font-weight: bold;
      margin: 0;
      span {
        font-weight: normal;
      }
    }
    img {
      margin-top: 0.5rem;
    }
  }

  form {
    ${mediaQuery.afterMobile} {
      max-width: 350px;
    }

    .amount {
      position: relative;
      .input-amount:before {
        content: "$";
        position: absolute;
        top: 20px;
        left: -10px;
        font-weight: bold;
        font-size: ${sizes.font.normal};
        line-height: 14px;
      }
    }

    .withdraw-amount,
    .account-balance {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      .description,
      span {
        font-weight: bold;
        font-size: ${sizes.font.normal};
        line-height: 14px;
        color: ${(props) => props.theme.basic.grayLight};
      }
    }

    .receive-withdraw {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      .description,
      span {
        font-weight: bold;
        font-size: ${sizes.font.extraLarge};
        line-height: 17px;
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }
`;
