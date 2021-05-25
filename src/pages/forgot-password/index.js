import React, { useEffect, useState } from "react";
import { Card, message } from "antd";
import get from "lodash/get";
import {
  authenticationErrors,
  doSendPasswordResetEmail,
} from "../../firebase/authentication";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useErrorHandler } from "react-error-boundary";
import { ButtonBombo, Input } from "../../components";

export const ForgotPassword = (props) => {
  const [emailSent, setEmailSent] = useState(false);
  const [loadingSendEmailStatus, setLoadingSendEmailStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleError = useErrorHandler();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => messageConfig(), []);

  const messageConfig = () => message.config({ duration: 3, maxCount: 2 });

  const recoverPassword = async (data) => {
    try {
      setLoadingSendEmailStatus(true);

      const userRecord = await doSendPasswordResetEmail(
        data.email.toLowerCase()
      );

      if (!userRecord.success)
        return errorSendPasswordResetEmail(userRecord.error);

      setEmailSent(true);
      message.success("Se envió el correo.");
    } catch (error) {
      handleError({ ...error, action: "recoverPassword" });
    }
    setLoadingSendEmailStatus(false);
  };

  const cancelButton = () => props.forgotPasswordVisible(false);

  const errorSendPasswordResetEmail = (error) => {
    setErrorMessage(
      get(
        authenticationErrors,
        [error.code],
        "Hubo un problema, inténtelo de nuevo!"
      )
    );
    setLoadingSendEmailStatus(false);
  };

  return (
    <ContainerForgotPassword>
      <Card className="content-forgot-password">
        {emailSent ? (
          <React.Fragment>
            <h1 className="title">!Excelente!</h1>
            <p className="forgot-password-note">
              Te hemos enviado un correo electrónico con instrucciones para
              volver a establecer tu contraseña.
            </p>
            <ButtonBombo
              className="btn-primary btn-recover-password btn-go-back"
              block={true}
              onClick={() => cancelButton()}
              disabled={errorMessage}
            >
              Volver
            </ButtonBombo>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="title">RECUPERAR CONTRASEÑA</h1>
            <p className="forgot-password-note">
              Por favor, introduce la dirección de correo electrónico asociada a
              tu cuenta. Te enviaremos un correo electrónico que te permitirá
              crear una nueva contraseña.
            </p>
            <form
              onSubmit={handleSubmit(recoverPassword)}
              className="login-form form-forgot-password"
              noValidate
            >
              {errorMessage ? <h3>{errorMessage}</h3> : <br />}
              <Input
                required
                variant="primary"
                style={{ margin: 0 }}
                type="email"
                name="email"
                ref={register}
                autoComplete="off"
                error={errors.email}
                placeholder="Ingresa tu email"
              />
              <div className="btn-footer-password">
                <ButtonBombo
                  margin="0"
                  className="btn-register btn-cancelar"
                  block={true}
                  disabled={loadingSendEmailStatus}
                  onClick={() => cancelButton()}
                >
                  Cancelar
                </ButtonBombo>
                <ButtonBombo
                  margin="0"
                  className="btn-recover-password"
                  block={true}
                  htmlType="submit"
                  loading={loadingSendEmailStatus}
                  disabled={loadingSendEmailStatus}
                >
                  Enviar
                </ButtonBombo>
              </div>
            </form>
          </React.Fragment>
        )}
      </Card>
    </ContainerForgotPassword>
  );
};

const ContainerForgotPassword = styled.div`
  .content-forgot-password {
    margin: auto;
    background: none;
    border: none;
    padding: 0px;

    .ant-card-body {
      padding: 20px;

      h1 {
        color: ${(props) => props.theme.basic.white};
      }
    }

    .btn-forgot-password {
      margin-bottom: 1rem;
    }

    .btn-go-back {
      margin-top: 15px;
    }

    .title {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .forgot-password-note {
      color: ${(props) => props.theme.basic.white};
      font-size: 15px;
      text-align: justify;
      margin-bottom: 0px;
      line-height: 17px;
    }

    .form-forgot-password {
      h3 {
        color: ${(props) => props.theme.basic.danger};
      }

      .ant-form-item {
        margin-bottom: 10px;
      }

      .btn-footer-password {
        display: flex;
        justify-content: space-between;

        .btn-recover-password {
          text-align: center;
        }

        .btn-cancelar {
          background: transparent;
          border: 1px solid ${(props) => props.theme.basic.primary};
          color: ${(props) => props.theme.basic.white};
        }
      }
    }
  }
`;
