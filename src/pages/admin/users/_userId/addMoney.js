import React from "reactn";
import {Checkbox, message, Modal, Select as AntSelect, Switch} from "antd";
import reduce from "lodash/reduce";
import {config} from "../../../../firebase";
import {gaAdminCoin} from "../../../../utils";
import UrlAssembler from "url-assembler";
import {boolean, mixed, number, object, string} from "yup";
import {Controller, useForm} from "react-hook-form";
import {ButtonBombo, Input, Select} from "../../../../components/common";
import styled from "styled-components";
import {useParams} from "react-router";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../../../utils/useFetch/useFetch";

export const AddMoney = (props) => {
  const schema = object().shape({
    paymentType: boolean().required(),
    notesTransaction: mixed().required(),
    reasonsTransaction: mixed().required(),
    amount: number().positive().required(),
    realMoney: string().required(),
  });

  const { register, errors, handleSubmit, control, setValue, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const { userId } = useParams();
  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const saveAmount = (data) =>
    Modal.confirm({
      title: `Esta seguro del monto de ${data.amount} que va a añadir?`,
      okText: "Si",
      okType: "danger",
      cancelText: "No",
      onOk: () => addAmount(data),
    });

  const addAmount = async (user) => {
    const userAmount = mapUserAmount(user);

    try {
      await ownFetch(urlApiUserSoles(), "PUT", userAmount);

      gaEvent(userAmount);

      message.success(`Se le agrego ${user.amount} al usuario`);

      cleanInputs();

      props.initialize();
    } catch (error) {
      // gaError("Error", "PUT /admin/user/:userId");
      handleError({ ...error, action: "addAmount" });
    }
  };

  const mapUserAmount = (user) => ({
    amount: +user.amount,
    paymentType: user.paymentType ? "payment" : "gift",
    noteTransaction: `${reduceNotes(user.notesTransaction)} / ${reduceNotes(
      user.reasonsTransaction
    )}`,
    realMoney: user.realMoney === "credit",
  });

  const reduceNotes = (notes) =>
    reduce(
      notes,
      (result, value, key) => {
        value && (result || (result = [])).push(key);
        return result;
      },
      []
    );

  const urlApiUserSoles = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/admin/user/:userId")
      .param({ userId })
      .toString();

  const cleanInputs = () => {
    setValue("paymentType", false);
    setValue("amount", 1);
  };

  const gaEvent = (userAmount) => {
    const action = userAmount.paymentType === "gift" ? "Give" : "Charge";

    gaAdminCoin(action, userAmount.amount);
  };
  return (
    <FormContent onSubmit={handleSubmit(saveAmount)} noValidate>
      <h2 className="title-add-coins">Añadir dinero</h2>
      <div className="item-switch-yape">
        <Controller
          name="paymentType"
          control={control}
          onChange={([value]) => value}
          defaultValue={false}
          as={<Switch checkedChildren="Regalo" unCheckedChildren="Pago" />}
        />
      </div>
      <Input
        variant="secondary"
        error={errors.amount}
        required
        type="number"
        autoComplete="on"
        ref={register}
        name="amount"
        placeholder="Ingrese monto"
      />
      <Controller
        name="realMoney"
        defaultValue={"credit"}
        className={`${!watch("paymentType") ? "" : "hidden"}`}
        control={control}
        as={
          <Select
            variant="secondary"
            required
            error={errors.realMoney}
            showSearch
            placeholder="Tipo de moneda"
          >
            <AntSelect.Option key="real-money-true" value="credit">
              Credito
            </AntSelect.Option>
            {/*
              <AntSelect.Option key="real-money-false" value="playable">
                Dinero Jugable
              </AntSelect.Option>
            */}
          </Select>
        }
      />
      <div className="items-checkbox">
        <label htmlFor="Pago">Pago</label>
        <div style={{ display: "flex" }}>
          {notesTransactions.map((note, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
              }}
              key={`pay-${index}`}
            >
              <Controller
                control={control}
                name={`notesTransaction.${note}`}
                onChange={([selected]) => selected.target.checked}
                as={<Checkbox id={`pay-${index}`} value={note} />}
              />
              <label
                style={{ padding: "0px 10px", cursor: "pointer" }}
                htmlFor={`pay-${index}`}
              >
                {note}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="items-checkbox" style={{ marginBottom: ".5rem" }}>
        <label htmlFor="Razon">Razón</label>
        <div style={{ display: "flex" }}>
          {reasonsTransactions.map((note, index) => (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "10px",
              }}
              key={`reason-${index}`}
            >
              <Controller
                control={control}
                name={`reasonsTransaction.${note}`}
                onChange={([selected]) => selected.target.checked}
                as={<Checkbox id={`reason-${index}`} value={note} />}
              />
              <label
                style={{ padding: "0px 10px", cursor: "pointer" }}
                htmlFor={`reason-${index}`}
              >
                {note}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "inline-flex" }}>
        <ButtonBombo type="secondary" onClick={() => props.goBack()}>
          Cancelar
        </ButtonBombo>
        <ButtonBombo type="primary" htmlType="submit" margin="auto 10px">
          Añadir
        </ButtonBombo>
      </div>
    </FormContent>
  );
};

const notesTransactions = ["Yape", "Plin", "Transferencia", "Otros"];
const reasonsTransactions = ["Torneo", "1vs1", "Focus", "Problema", "Otros"];

const FormContent = styled.form`
  margin: 0 auto;

  .hidden {
    display: none;
  }
`;
