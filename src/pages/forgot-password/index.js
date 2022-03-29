import React, { useState } from "reactn";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Input } from "../../components/form";
import { useAuth } from "../../hooks/useAuth";
import { useSendError } from "../../hooks";

const ForgotPassword = (props) => {
  const { sendError } = useSendError();
  const { recoveryPassword } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [loadingSendEmailStatus, setLoadingSendEmailStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

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

  return (
    <div className="w-full h-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8 flex">
      <div className="w-full max-w-[604px] mt-auto mb-auto">
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
              <div className="text-['Lato'] text-[44px] leading-[53px] text-primary tracking-wide mb-8">
                Recuperar contraseña
              </div>
              <div className="text-['Lato'] text-[14px] leading-[16px] text-blackDarken tracking-wide">
                Por favor, introduce la dirección de correo electrónico asociada a tu cuenta. Te enviaremos un correo
                electrónico que te permitirá crear una nueva contraseña.
              </div>
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
    </div>
  );
};

export default ForgotPassword;
