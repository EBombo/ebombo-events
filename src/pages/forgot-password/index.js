import React, { useGlobal, useState } from "reactn";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { ButtonAnt, Input } from "../../components/form";
import { useAuth } from "../../hooks/useAuth";
import { useSendError } from "../../hooks";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { Desktop, mediaQuery } from "../../constants";

const ForgotPassword = (props) => {
  const { sendError } = useSendError();
  const { recoveryPassword } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [loadingSendEmailStatus, setLoadingSendEmailStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [, setIsVisibleForgotPassword] = useGlobal("isVisibleForgotPassword");

  const schema = yup.object().shape({
    email: yup.string().email().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const recoverPassword = async (data) => {
    try {
      setLoadingSendEmailStatus(true);
      const response = await recoveryPassword(data.email.toLowerCase());

      if (!response.success) {
        setErrorMessage(response.error);
        throw response.error;
      }

      setEmailSent(true);
    } catch (error) {
      console.error(error);
      await sendError(error, "recoverPassword");
    }
    setLoadingSendEmailStatus(false);
  };

  const cancelButton = () => setIsVisibleForgotPassword(false);

  return (
    <ContainerForgotPassword>
      <div className="container">
        <Desktop>
          <Image src={`${config.storageUrl}/resources/login-img.png`} height="100%" width="100%" size="cover" />
        </Desktop>

        <div className="content">
          {emailSent ? (
            <React.Fragment>
              <h1 className="title">Muy bien!</h1>
              <p className="forgot-password-note">
                Le hemos enviado un correo electrónico con instrucciones para restablecer su contraseña.
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <h1 className="title">Recuperar contraseña</h1>
              <p className="forgot-password-note">
                Por favor, introduce la dirección de correo electrónico asociada a tu cuenta. Te enviaremos un correo
                electrónico que te permitirá crear una nueva contraseña.
              </p>
              <form onSubmit={handleSubmit(recoverPassword)} noValidate>
                {errorMessage ? <h3>{errorMessage}</h3> : <br />}
                <Input
                  required
                  variant="primary"
                  type="email"
                  name="email"
                  ref={register}
                  autoComplete="off"
                  error={errors.email}
                  className="input-forgot-password-desktop"
                  placeholder="Email"
                />
                <ButtonAnt
                  block={true}
                  height="35px"
                  width="170px"
                  margin="1rem auto"
                  htmlType="submit"
                  loading={loadingSendEmailStatus}
                  disabled={loadingSendEmailStatus}
                >
                  Recuperar contraseña
                </ButtonAnt>
              </form>
            </React.Fragment>
          )}
        </div>
      </div>
    </ContainerForgotPassword>
  );
};

const ContainerForgotPassword = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  width: 100%;

  .container {
    margin: 0;
    width: 100%;
    display: grid;
    background-color: ${(props) => props.theme.basic.gray};

    ${mediaQuery.afterTablet} {
      grid-template-columns: 1fr 1.5fr;
    }

    .content {
      margin: auto;
      min-width: 300px;
      max-width: 400px;

      .title {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        color: ${(props) => props.theme.basic.secondary};
      }

      .forgot-password-note {
        text-align: center;
      }
    }
  }
`;

export default ForgotPassword;
