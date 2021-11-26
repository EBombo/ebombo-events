import React, { useState } from "reactn";
import styled from "styled-components";
import { ButtonAnt, Select, TextArea } from "../../../../components/form";
import { darkTheme } from "../../../../theme";
import get from "lodash/get";
import { Controller, useForm } from "react-hook-form";
import { object, string } from "yup";
import { reasons } from "../../../../components/common/DataList";
import { useSendError } from "../../../../hooks";
import { useFetch } from "../../../../hooks/useFetch";
import { mediaQuery } from "../../../../constants";
import { config } from "../../../../firebase";

export const DeleteUser = (props) => {
  const [loading, setLoading] = useState(false);

  const Fetch = useFetch();
  const sendError = useSendError();

  const schema = object().shape({
    reason: string().required(),
    emails: string().required(),
  });

  const { errors, handleSubmit, register, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const deleteAccount = async (data) => {
    try {
      setLoading(true);

      const { error } = await Fetch(
        `${config.serverUrl}/api/users/${get(props, "user.id", "")}`,
        "DELETE",
        data
      );

      props.showNotification(
        error ? "ERROR" : "OK",
        error ? "Algo salió mal" : "Realizado",
        error ? "error" : "success"
      );

    } catch (error) {
      await sendError(error, "deleteAccount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DeleteContainer>
      <div className="title">Eliminar cuenta</div>

      <div className="main-container">
        <div className="subtitle">¡Estaremos tristes de verte partir!</div>
        <div className="description">
          Si no podemos cambiar de opinión, le agradeceríamos que nos hiciera saber por qué nos deja.
        </div>

        <form onSubmit={handleSubmit(deleteAccount)}>
          <div className="inputs-container">
            <label htmlFor="reason">Razón</label>
            <Controller
              name="reason"
              control={control}
              as={
                <Select
                  placeholder="Seleccione una razón"
                  showSearch
                  virtual={false}
                  borderRight={`0.1px solid ${darkTheme.basic.grayLighten}`}
                  borderTop={`0.1px solid ${darkTheme.basic.grayLighten}`}
                  borderLeft={`0.1px solid ${darkTheme.basic.grayLighten}`}
                  borderBottom={`0.1px solid ${darkTheme.basic.grayLighten}`}
                  error={errors.reason}
                  optionFilterProp="children"
                  optionsdom={reasons.map((reason) => ({
                    key: reason.id,
                    code: reason.id,
                    name: reason.description,
                  }))}
                />
              }
            />

            <label htmlFor="emails">
              Ingrese direcciones de correo electrónico (sepárelas con coma o punto y coma)
            </label>
            <TextArea
              variant="primary"
              name="emails"
              ref={register}
              error={errors.emails}
              placeholder="Copie y pegue hasta 2000 correos electrónicos"
            />

            <label>
              <bold>Nota:</bold> sus ebombo públicos no se eliminarán a menos que los elimine primero.
            </label>
          </div>
          <div className="btn-container">
            <ButtonAnt color="danger">Eliminar Cuenta</ButtonAnt>
          </div>
        </form>
      </div>
    </DeleteContainer>
  );
};

const DeleteContainer = styled.div`
  width: 100%;
  max-width: 655px;
  margin: 5rem auto;
  padding: 0.5rem;

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    line-height: 20px;
    padding: 1rem;
    color: ${(props) => props.theme.basic.blackDarken};
  }

  .main-container {
    background: ${(props) => props.theme.basic.whiteLight};
    box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
    border-radius: 6px;

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 17px;
      line-height: 20px;
      color: ${(props) => props.theme.basic.blackDarken};
      height: 65px;
      display: flex;
      align-items: center;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
      padding: 0 1rem;
    }

    .description {
      font-family: Lato;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) => props.theme.basic.blackDarken};
      padding: 0.5rem 1rem;
    }

    form {
      
      .inputs-container{
        padding: 1rem;
      }
      
      label {
        font-family: Lato;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.blackDarken};
        margin-bottom: 0.5rem;
      }

      textarea {
        height: 250px;
      }
    }

    .btn-container {
      height: 65px;
      display: flex;
      align-items: center;
      box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
      padding: 0 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 24px;
      line-height: 29px;
    }
  }
`;
