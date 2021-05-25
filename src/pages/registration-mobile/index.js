import React, { useGlobal } from "reactn";
import { ButtonBombo, Checkbox, Input } from "../../components";
import { Divider, notification } from "antd";
import { Controller, useForm } from "react-hook-form";
import { auth } from "../../firebase";
import { array, object, string } from "yup";
import { useHistory } from "react-router";
import { useEffect } from "react";
import get from "lodash/get";
import { Icon } from "../../components";

export const RegistrationMobile = () => {
  const validationSchema = object().shape({
    name: string().required(),
    email: string()
      .required()
      .email()
      .test(
        "",
        `Email no valido!`,
        (email_) => !email_.includes("yopmail.com")
      ),
    password: string().required().min(6),
    phoneNumber: string().required().length(9),
    validateIsAdult: array().required(),
  });

  const [authUser] = useGlobal("user");
  const [influencer] = useGlobal("influencer");
  const [globalIsLoadingCreateUser, setGlobalIsLoadingCreateUser] = useGlobal(
    "isLoadingCreateUser"
  );
  const [globalIsLoadingUser] = useGlobal("isLoadingUser");
  const [globalIsLoadingFacebookAuth] = useGlobal("isLoadingFacebookAuth");
  const [, setGlobalRegister] = useGlobal("register");
  const { register, errors, handleSubmit, control } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });
  const history = useHistory();

  const onRegisterError = (error) =>
    notification["error"]({
      message: "Register error",
      description: get(error, "message", "Algo salio mal intenta nuevamente"),
    });

  useEffect(() => {
    authUser && history.push("/dispatcher");
  }, [authUser]);

  const onSubmitRegister = async (user) => {
    try {
      await setGlobalIsLoadingCreateUser(true);

      const result = await auth.createUserWithEmailAndPassword(
        user.email.toLowerCase(),
        user.password
      );

      const register = mapRegister(user, result.user);

      await setGlobalRegister(register);
    } catch (error) {
      onRegisterError(error);
      await setGlobalIsLoadingCreateUser(false);
    }
  };

  const mapRegister = (user, result) => ({
    id: result.uid,
    ...user,
    influencer,
    providerData: { ...result.providerData[0] },
  });

  return (
    <div className="container-register-mobile">
      <div className="content-items-register">
        <div className="header-registration">
          <ButtonBombo
            className="btn-primary-mobile-left btn-registration-mobile"
            disabled={
              globalIsLoadingUser ||
              globalIsLoadingCreateUser ||
              globalIsLoadingFacebookAuth
            }
            onClick={() => history.goBack()}
          >
            <Icon type="arrow-left" />
          </ButtonBombo>
        </div>
        <h1 className="title">Crea una cuenta</h1>
        <Divider style={{ margin: "10px 0", background: "#919090" }} />
        <div className="body-registration">
          <form
            onSubmit={handleSubmit(onSubmitRegister)}
            autoComplete="on"
            className="register-form-container"
            noValidate
          >
            <div className="content-item">
              <h2>Queremos Conocerte</h2>
              <Input
                variant="primary"
                error={errors.name}
                type="text"
                autoComplete="off"
                ref={register}
                name="name"
                placeholder="Tu nombre es"
              />
            </div>
            <div className="content-item">
              <Input
                variant="primary"
                error={errors.email}
                type="email"
                autoComplete="off"
                ref={register}
                name="email"
                placeholder="Tu email"
              />
            </div>
            <div className="content-item">
              <Input
                variant="primary"
                error={errors.password}
                type="password"
                autoComplete="off"
                ref={register}
                name="password"
                placeholder="Tu contraseña"
              />
            </div>
            <div className="content-item">
              <Input
                variant="primary"
                error={errors.phoneNumber}
                type="number"
                autoComplete="off"
                ref={register}
                name="phoneNumber"
                placeholder="Número de teléfono"
              />
            </div>
            <div className="content-item">
              <Controller
                name="validateIsAdult"
                control={control}
                as={
                  <Checkbox
                    error={errors.validateIsAdult}
                    className="input-checkbox"
                    options={[
                      {
                        label:
                          "Soy mayor de 18 años y acepto recibir notificaciones y mensajes de Bombo",
                        value: "WR",
                      },
                    ]}
                    required
                  />
                }
              />
            </div>
            <div className="content-btn-login">
              <ButtonBombo
                className="btn-primary btn-register"
                block={true}
                htmlType="submit"
                disabled={
                  globalIsLoadingUser ||
                  globalIsLoadingCreateUser ||
                  globalIsLoadingFacebookAuth
                }
              >
                {globalIsLoadingCreateUser && <Icon type="loading" />}
                Registrarme
              </ButtonBombo>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
