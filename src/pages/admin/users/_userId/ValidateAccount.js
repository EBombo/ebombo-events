import React, { useEffect, useState } from "react";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import styled from "styled-components";
import { object, string } from "yup";
import { Controller, useForm } from "react-hook-form";
import { Input, message } from "antd";
import UrlAssembler from "url-assembler";
import { config } from "../../../../firebase";
import { key } from "../../../../utils/convertor";
import { useHistory } from "react-router";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";
import { ButtonBombo } from "../../../../components";

export const ValidateAccount = (props) => {
  const history = useHistory();

  const [isLoadingValidateAccount, setIsLoadingValidateAccount] = useState(
    false
  );
  const [
    isLoadingRequestNewDocument,
    setIsLoadingRequestNewDocument,
  ] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const schema = object().shape({
    name: string().required(),
    lastName: string().required(),
    documentNumber: string().required(),
  });

  const { errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (isEmpty(errors)) return;

    message.error("Complete todo los campos del formulario", 5);
  }, [errors]);

  const validateAccount = async (data) => {
    try {
      setIsLoadingValidateAccount(true);

      await ownFetch(urlApiValidateAccount(), "PUT", data);

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      handleError({ ...error, action: "validateAccount" });
      message.error("Algo salio mal, intente nuevamente", 5);
    } finally {
      setIsLoadingValidateAccount(false);
    }
  };

  const urlApiValidateAccount = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/users/:userId/validate-account")
      .param({
        userId: props.user.id,
      })
      .toString();

  const requestNewDocument = async () => {
    try {
      setIsLoadingRequestNewDocument(true);
      await ownFetch(urlApiRequestNewDocument(), "PUT");

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      handleError({ ...error, action: "requestNewDocument" });
      message.error("Algo salio mal, intente nuevamente", 5);
    } finally {
      setIsLoadingRequestNewDocument(false);
    }
  };

  const urlApiRequestNewDocument = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/users/:userId/request-new-document")
      .param({
        userId: props.user.id,
      })
      .toString();

  const isEnabledValidateAccount = () =>
    !!(props.user.documentImageUrl || props.user.isRequestNewDocument);

  if (!isEnabledValidateAccount())
    return <label>No se solicitó validar la cuenta</label>;

  return (
    <Container>
      <form onSubmit={handleSubmit(validateAccount)}>
        <div className="wrapper-input">
          <label>* Nombre :</label>
          <Controller
            key={key(props.user, "name")}
            defaultValue={get(props.user, "name", "")}
            name="name"
            control={control}
            as={<Input />}
          />
          {get(errors, "name", false) && <Error>{errors.name.message}</Error>}
        </div>
        <div className="wrapper-input">
          <label>* Apellido :</label>
          <Controller
            key={key(props.user, "lastName")}
            defaultValue={get(props.user, "lastName", "")}
            name="lastName"
            control={control}
            as={<Input />}
          />
          {get(errors, "lastName", false) && (
            <Error>{errors.lastName.message}</Error>
          )}
        </div>
        <div className="wrapper-input">
          <label>* Documento de identidad :</label>
          <Controller
            key={key(props.user, "documentNumber")}
            defaultValue={get(props.user, "documentNumber", "")}
            name="documentNumber"
            control={control}
            as={<Input />}
          />
          {get(errors, "documentNumber", false) && (
            <Error>{errors.documentNumber.message}</Error>
          )}
        </div>
        {props.isVisibleImageDocument && (
          <div className="image">
            {props.user.isRequestNewDocument ? (
              <label>Esperando la nueva foto del documento...</label>
            ) : (
              <img src={get(props.user, "documentImageUrl", "")} alt="Queja" />
            )}
          </div>
        )}
        <div className="wrapper-buttons">
          <ButtonBombo
            disabled={props.user.verifiedDocument}
            loading={isLoadingValidateAccount}
            type="primary"
            htmlType="submit"
          >
            Validar cuenta
          </ButtonBombo>
          <ButtonBombo
            loading={isLoadingRequestNewDocument}
            type="danger"
            onClick={() => requestNewDocument()}
          >
            Solicitar nueva foto
          </ButtonBombo>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  .image {
    text-align: center;
    padding: 0.5rem 0;

    label {
      margin: 1rem 0;
      font-weight: 500;
    }

    img {
      width: 100%;
    }
  }

  .wrapper-input {
    margin-bottom: 0.6rem;
  }

  .wrapper-buttons {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;

    button {
      margin: 0.5rem;
    }
  }
`;

const Error = styled.div`
  color: ${(props) => props.theme.basic.danger};
  font-weight: 500;
`;
