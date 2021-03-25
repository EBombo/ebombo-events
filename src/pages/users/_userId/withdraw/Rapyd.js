import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { number, object, string } from "yup";
import Input from "../../../../components/common/form/Input";
import { ButtonBombo, Select } from "../../../../components";
import { getData } from "country-list";
import { mediaQuery } from "../../../../styles/constants";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import { message, Select as AntSelect } from "antd";
import { gaError, gaWithdraw } from "../../../../utils";
import { config } from "../../../../firebase";
import { rapydCountries } from "../../../../components/common/DataList";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";
import { useErrorHandler } from "react-error-boundary";
import { darkTheme } from "../../../../styles/theme";

export const Rapyd = (props) => {
  const [authUser] = useGlobal("user");
  const [settings] = useGlobal("settings");
  const [, setOpenSidebarMobile] = useGlobal("openSidebarMobile");

  const [loadingWithDraw, setLoadingWithDraw] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const validationSchema = object().shape({
    countryCode: string().required(),
    state: string().required(),
    city: string().required(),
    address: string().required(),
    postcode: number().required(),
    documentId: string().required(),
    accountNumber: string().required(),
    bankAccountType: string().required(),
    bicSwift: string().required(),
    amount: number()
      .required()
      .integer()
      .min(1)
      .typeError("Campo requerido.")
      .max(+get(authUser, "money", 0)),
  });

  const { control, register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const saveWithdraw = async (data) => {
    setLoadingWithDraw(true);
    console.log(data);
    try {
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

      await ownFetch(
        `${config.serverUrl}/users/${authUser.id}/withdraw-rapyd`,
        "POST",
        mapData(data)
      );

      gaWithdraw(+data.amount);

      message.success("Retiro exitoso", 5);

      setOpenSidebarMobile(false);
    } catch (error) {
      gaError("Error", "POST /users/:userId/withdraw-rapyd");
      message.error("Error al retirar", 5);
      handleError({ ...error, action: "saveWithdraw" });
    }
    setLoadingWithDraw(false);
  };

  const mapData = (data) => ({
    amount: data.amount,
    beneficiary: {
      countryCode: data.countryCode,
      state: data.state,
      city: data.city,
      address: data.address,
      postcode: data.postcode,
      documentId: data.documentId,
      accountNumber: data.accountNumber,
      bankAccountType: data.bankAccountType,
      bicSwift: data.bicSwift,
    },
  });

  const getCountryData = () =>
    getData().filter((country) => rapydCountries.includes(country.code));

  return (
    <Container>
      <form onSubmit={handleSubmit(saveWithdraw)} autoComplete="off" noValidate>
        <div className="triple-container">
          <div className="item-with-draw">
            <label>Pais</label>
            <Controller
              name="countryCode"
              control={control}
              as={
                <Select
                  placeholder="País"
                  showSearch
                  variant="secondary"
                  error={errors.countryCode}
                  optionFilterProp="children"
                  optionsdom={getCountryData().map((country) => ({
                    key: country.code,
                    code: country.code,
                    name: country.name,
                  }))}
                  filterOption={(input, option) =>
                    get(option, "props.children", "")
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                />
              }
            />
          </div>
          <div className="item-with-draw">
            <label>Estado</label>
            <div>
              <Input
                placeholder="Estado"
                type="text"
                variant="secondary"
                name="state"
                error={errors.state}
                ref={register}
              />
            </div>
          </div>
          <div className="item-with-draw">
            <label>Ciudad</label>
            <div>
              <Input
                placeholder="Ciudad"
                type="text"
                variant="secondary"
                name="city"
                error={errors.city}
                ref={register}
              />
            </div>
          </div>
        </div>
        <div className="item-with-draw">
          <label>Dirección</label>
          <div>
            <Input
              placeholder="Direccion"
              type="text"
              variant="secondary"
              name="address"
              error={errors.address}
              ref={register}
            />
          </div>
        </div>
        <div className="double-container">
          <div className="item-with-draw">
            <label>Codigo Postal</label>
            <div className="postcode-container">
              <Input
                placeholder="Codigo postal"
                type="number"
                variant="secondary"
                name="postcode"
                error={errors.postcode}
                ref={register}
              />
            </div>
          </div>
          <div className="item-with-draw">
            <label>Número de Documento</label>
            <div>
              <Input
                placeholder="Documento"
                type="text"
                variant="secondary"
                name="documentId"
                error={errors.documentId}
                ref={register}
              />
            </div>
          </div>
        </div>
        <div className="double-container">
          <div className="item-with-draw">
            <label>Número de cuenta</label>
            <div>
              <Input
                placeholder="Cuenta"
                type="text"
                variant="secondary"
                name="accountNumber"
                error={errors.accountNumber}
                ref={register}
              />
            </div>
          </div>
          <div className="item-with-draw">
            <label>Tipo de cuenta</label>
            <div>
              <Controller
                name="bankAccountType"
                control={control}
                as={
                  <Select
                    placeholder="Tipo de cuenta"
                    variant="secondary"
                    showSearch
                    error={errors.bankAccountType}
                  >
                    <AntSelect.Option key="cacc" value={"CACC"}>
                      CACC
                    </AntSelect.Option>
                    <AntSelect.Option key="svgs" value={"SVGS"}>
                      SVGS
                    </AntSelect.Option>
                  </Select>
                }
              />
            </div>
          </div>
        </div>
        <div className="item-with-draw">
          <label>Codigo Swift</label>
          <div>
            <Input
              type="text"
              variant="secondary"
              name="bicSwift"
              error={errors.bicSwift}
              ref={register}
            />
          </div>
        </div>
        <div className="item-with-draw">
          <label>Monto a retirar</label>
          <div>
            <Input
              type="number"
              variant="secondary"
              name="amount"
              error={errors.amount}
              ref={register}
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
  .double-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 1rem;
  }
  .triple-container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 1rem;
  }
  .item-with-draw {
    div {
      color: ${(props) => props.theme.basic.white};
      .ant-select {
        color: ${(props) => props.theme.basic.blackLighten};
        background: ${(props) => props.theme.basic.grayLighten};
        border: 0 !important;
        margin-bottom: 0;
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
