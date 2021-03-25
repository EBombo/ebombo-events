import React, { useState, useGlobal } from "reactn";
import Input from "../../../../components/common/form/Input";
import { gaError, gaWithdraw } from "../../../../utils";
import { Controller, useForm } from "react-hook-form";
import { message, Modal, Select } from "antd";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import UrlAssembler from "url-assembler";
import { config } from "../../../../firebase";
import * as yup from "yup";
import styled from "styled-components";
import { ButtonBombo } from "../../../../components";
import { mediaQuery } from "../../../../styles/constants";
import { useHistory } from "react-router";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";
import { darkTheme } from "../../../../styles/theme";

const INITIAL_STATE = {
  amount: null,
  accountNumber: "",
  holderName: "",
  accountType: "BCP",
  documentType: "DNI",
  document: "",
};

export const BankTransfer = (props) => {
  const [settings] = useGlobal("settings");
  const [authUser] = useGlobal("user");

  const history = useHistory();

  const [isBcp, setBcp] = useState(true);
  const [withDraw, setWithDraw] = useState(INITIAL_STATE);
  const [loadingWithDraw, setLoadingWithDraw] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const schema = yup.object().shape({
    amount: yup
      .number()
      .required()
      .integer()
      .min(1)
      .typeError("Campo requerido.")
      .max(+get(authUser, "money", 0)),
    accountNumber: yup.string().required(),
    holderName: yup.string().required(),
    accountType: yup.string(),
    documentType: yup.string().required(),
    document: yup
      .string()
      .required()
      .when("documentType", {
        is: "DNI",
        then: yup
          .string()
          .matches("^[0-9]{8}$", "El DNI debe tener 8 números."),
        otherwise: yup
          .string()
          .matches("^[0-9]{11}$", "El RUC debe tener 11 números."),
      }),
  });

  const { register, errors, handleSubmit, setValue, control } = useForm({
    reValidateMode: "onSubmit",
    validationSchema: schema,
    defaultValues: {
      loadingWithDraw: false,
      amount: INITIAL_STATE.amount,
      accountNumber: INITIAL_STATE.accountNumber,
      holderName: INITIAL_STATE.holderName,
      accountType: INITIAL_STATE.accountType,
      documentType: INITIAL_STATE.documentType,
      document: INITIAL_STATE.document,
    },
  });

  const confirm = (data) =>
    Modal.confirm({
      className: "ant-modal-ebombo modal-withdraw",
      title: "Estás seguro de realizar la operación?",
      okText: "SI",
      okType: "info",
      cancelText: "NO",
      onOk: () => updateWithDraw(data),
    });

  const updateWithDraw = async (data) => {
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

      await ownFetch(urlApiWithDraw(data), "POST", data);

      gaWithdraw(+data.amount);

      message.success("Retiro exitoso", 5);

      setWithDraw(INITIAL_STATE);
      setLoadingWithDraw(false);
      history.push("/");
    } catch (error) {
      gaError("Error", "POST /users/:userId/withdraw/:amount");
      handleError({ ...error, action: "updateWithDraw" });
    }
    setLoadingWithDraw(false);
  };

  const urlApiWithDraw = (data) => {
    return new UrlAssembler(`${config.serverUrl}`)
      .template("/users/:userId/withdraw/:amount")
      .param({
        userId: authUser.id,
        amount: +data.amount,
      })
      .toString();
  };

  return (
    <Container>
      <form onSubmit={handleSubmit(confirm)} noValidate>
        <div className="item-switch-with-draw">
          Elige tu banco
          <div className="type-bank">
            <div
              className={`bank ${isBcp && "selected"}`}
              onClick={() => setBcp(true)}
            >
              BCP
            </div>
            <div
              className={`bank ${!isBcp && "selected"}`}
              onClick={() => setBcp(false)}
            >
              Otros
            </div>
          </div>
        </div>
        <input
          type="hidden"
          name="accountType"
          ref={register}
          value={isBcp ? "BCP" : "CCI"}
        />
        <div className="item-with-draw">
          <label>{isBcp ? "Número de cuenta BCP" : "CCI"}</label>
          <div>
            <Input
              type="number"
              variant="secondary"
              name="accountNumber"
              error={errors.accountNumber}
              ref={register}
              marginBottom={"0 !important"}
            />
          </div>
        </div>
        <div className="item-with-draw">
          <label>Nombre del titular</label>
          <div>
            <Input
              type="text"
              variant="secondary"
              name="holderName"
              error={errors.holderName}
              ref={register}
              marginBottom={"0 !important"}
            />
          </div>
        </div>

        <div className="container-document">
          <div className="item-with-draw">
            <label>Tipo de documento</label>
            <Controller
              control={control}
              name="documentType"
              error={errors.documentType}
              as={
                <Select
                  name="documentType"
                  defaultValue={withDraw.documentType}
                  onSelect={(value) => setValue("documentType", value, true)}
                >
                  <Select.Option value="DNI" key="DNI">
                    DNI
                  </Select.Option>
                  <Select.Option value="RUC" key="RUC">
                    RUC
                  </Select.Option>
                </Select>
              }
            />
          </div>
          <div className="item-with-draw">
            <label>Número de documento</label>
            <div>
              <Input
                type="number"
                variant="secondary"
                name="document"
                error={errors.document}
                ref={register}
                marginBottom={"0 !important"}
              />
            </div>
          </div>
        </div>
        <div className="item-with-draw">
          <label>Monto a retirar</label>
          <div>
            <Input
              variant="secondary"
              type="number"
              name="amount"
              error={errors.amount}
              ref={register}
              marginBottom={"0 !important"}
            />
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
  .button-with-draw {
    background: ${(props) => props.theme.basic.primary};
    color: ${(props) => props.theme.basic.blackDarken};
    font-size: 10px;
    padding: 10px 42px;
    font-weight: 600;
    border: none;
    margin: 1rem 0;
  }

  .item-switch-with-draw {
    margin-top: 1rem;
    font-size: 10px;
    .type-bank {
      display: flex;
      .bank {
        cursor: pointer;
        background: ${(props) => props.theme.basic.grayLighten};
        padding: 8px 20px;
        font-size: 0.7rem;
        font-weight: 600;
      }
      .selected {
        background: ${(props) => props.theme.basic.primary};
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }
  .container-document {
    display: flex;
    justify-content: space-between;
  }
  .item-with-draw {
    div {
      color: ${(props) => props.theme.basic.white};
      .ant-select-selector {
        color: ${(props) => props.theme.basic.blackLighten};
        background: ${(props) => props.theme.basic.grayLighten};
        border: 0;
      }
    }
    label {
      font-size: 10px;
      display: block;
      margin: 5px 0;
      ${mediaQuery.afterTablet} {
        font-size: 12px;
      }
    }
  }
`;
