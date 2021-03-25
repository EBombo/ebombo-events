import React, {useEffect, useGlobal} from "reactn";
import {ButtonBombo, Checkbox, DatePicker, Input, InputGroup, Select,} from "../../components";
import {Button, notification} from "antd";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import {Controller, useForm} from "react-hook-form";
import {auth, firestore} from "../../firebase";
import {array, date, object, string} from "yup";
import {useHistory} from "react-router";
import styled from "styled-components";
import {mediaQuery} from "../../styles/constants";
import {Desktop, dialCodes, spinLoader, Tablet} from "../../utils";
import {getData} from "country-list";
import {lazy, Suspense, useState} from "react";
import TagManager from "react-gtm-module";
import {googleTagManagerRegisterArgs} from "../../utils/googleTagManager";
import {firebaseAuthenticationError} from "../../firebase/auth";

const TermConditions = lazy(() => import("../../components/term-conditions"));

export const Registration = () => {
    const validationSchema = object().shape({
        name: string().required(),
        lastName: string().required(),
        nickname: string()
            .required()
            .matches(
                /^[a-zA-Z0-9\-_]{0,40}$/,
                "Sólo válido letras, números y sin espacios"
            )
            .test(
                "is-nickname",
                "Nombre de usuario ya existe",
                async (nickname) => !(await existNickName(nickname))
            ),
        email: string()
            .trim()
            .required()
            .email()
            .test(
                "",
                "Email no válido!",
                (email_) => !email_.includes("yopmail.com")
            ),
        password: string().required().min(6),
        countryCode: string().required(),
        phoneNumber: string().required().min(5),
        validateIsAdult: array().required(),
        validateReceiveNotifications: array().required(),
        singleAccount: array().required(),
        birthDate: date().required(),
        x: string(),
    });

    const history = useHistory();

    const [authUser] = useGlobal("user");
    const [, setGlobalRegister] = useGlobal("register");
    const [globalIsLoadingUser] = useGlobal("isLoadingUser");
    const [globalIsLoadingFacebookAuth] = useGlobal("isLoadingFacebookAuth");
    const [globalIsLoadingCreateUser, setGlobalIsLoadingCreateUser] = useGlobal(
        "isLoadingCreateUser"
    );

    const [activeModalTyC, setActiveModalTyC] = useState(false);
    const {register, errors, handleSubmit, control, watch} = useForm({
        validationSchema,
        reValidateMode: "onSubmit",
    });

    useEffect(() => {
        authUser && history.push("/");
    }, [authUser]);

    const existNickName = async (nickName) => {
        const nickNameRef = await firestore
            .collection("users")
            .where("nicknameUppercase", "==", nickName.trim().toUpperCase())
            .get();
        return !!nickNameRef.size;
    };

    const onRegisterError = (error) =>
        notification["error"]({
            message: "Register error",
            description: error.message,
        });

    const onSubmitRegister = async (user) => {
        try {
            await setGlobalIsLoadingCreateUser(true);

            const result = await auth.createUserWithEmailAndPassword(
                user.email.toLowerCase().trim(),
                user.password
            );

            const register = mapRegister(user, result.user);

            await setGlobalRegister(register);

            TagManager.dataLayer(googleTagManagerRegisterArgs());
        } catch (error) {
            const errorMessage = firebaseAuthenticationError[error.code];
            onRegisterError({
                message: defaultTo(
                    errorMessage,
                    "Ha ocurrido un error, intenta nuevamente"
                ),
            });
            await setGlobalIsLoadingCreateUser(false);
        }
    };

    const mapRegister = (user, result) => ({
        id: result.uid,
        ...user,
        dialCode: dialCode(user.countryCode),
        notifyInvitedToPlay: true,
        providerData: {...result.providerData[0]},
    });

    const dialCode = (countryCode) => {
        const country = dialCodes.find((country) => country.code === countryCode);

        return get(country, "dialCode", null);
    };

    const registrationContainer = () => (
        <>
            <form onSubmit={handleSubmit(onSubmitRegister)}
                  noValidate>
                <div className="label">Nombre</div>
                <Input
                    variant="primary"
                    error={errors.name}
                    marginBottom="0.5rem"
                    type="text"
                    autoComplete="new-password"
                    ref={register}
                    name="name"
                    placeholder="Nombre"
                />
                <div className="label">Apellido</div>
                <Input
                    variant="primary"
                    error={errors.lastName}
                    marginBottom="0.5rem"
                    type="text"
                    autoComplete="new-password"
                    ref={register}
                    name="lastName"
                    placeholder="Apellido"
                />
                <InputGroup gridTemplateColumns="1fr 1fr"
                            gridGap="1rem">
                    <div>
                        <div className="label">Nombre de usuario</div>
                        <Input
                            variant="primary"
                            error={errors.nickname}
                            marginBottom="0.5rem"
                            type="text"
                            autoComplete="new-password"
                            ref={register}
                            name="nickname"
                            placeholder="Nombre de usuario"
                        />
                    </div>
                    <div>
                        <div className="label">Fecha de nacimiento</div>
                        <div className="label-tc">
                            <Desktop>
                                <Controller
                                    width="100%"
                                    name="birthDate"
                                    control={control}
                                    as={
                                        <DatePicker
                                            variant="primary"
                                            style={{width: "100%"}}
                                            error={errors.birthDate}
                                            placeholder="Fecha de nacimiento"
                                            format={"DD/MM/YYYY"}
                                            inputReadOnly
                                        />
                                    }
                                />
                            </Desktop>
                            <Tablet>
                                <Input
                                    variant="primary"
                                    error={errors.birthDate}
                                    marginBottom="0.5rem"
                                    type="date"
                                    ref={register}
                                    name="birthDate"
                                    placeholder="Fecha de nacimiento"
                                />
                            </Tablet>
                        </div>
                    </div>
                </InputGroup>
                <div className="label">Email</div>
                <Input
                    variant="primary"
                    error={errors.email}
                    marginBottom="0.5rem"
                    type="email"
                    autoComplete="new-password"
                    ref={register}
                    name="email"
                    placeholder="Correo"
                />
                <InputGroup gridTemplateColumns="2fr 3fr"
                            gridGap="1rem">
                    <div>
                        <div className="label">Pais</div>
                        <Controller
                            name="countryCode"
                            control={control}
                            as={
                                <Select
                                    placeholder="País"
                                    showSearch
                                    virtual={false}
                                    error={errors.countryCode}
                                    optionFilterProp="children"
                                    optionsdom={getData().map((country) => ({
                                        key: country.code,
                                        code: country.code,
                                        name: country.name,
                                    }))}
                                    filterOption={(input, option) =>
                                        get(option, "props.children", "")
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) === 0
                                    }
                                    marginBottom="0.5rem"
                                />
                            }
                        />
                    </div>
                    <div>
                        <div className="label">Celular</div>
                        <div className="phone-content">
                            <CountryCode>{dialCode(watch("countryCode"))}</CountryCode>
                            <Input
                                variant="primary"
                                error={errors.phoneNumber}
                                marginBottom="0.5rem"
                                type="number"
                                autoComplete="new-password"
                                ref={register}
                                name="phoneNumber"
                                placeholder="Celular"
                            />
                        </div>
                    </div>
                </InputGroup>
                <div className="label">Contraseña</div>
                <Input
                    variant="primary"
                    error={errors.password}
                    marginBottom="0.5rem"
                    type="password"
                    autoComplete="new-password"
                    ref={register}
                    name="password"
                    placeholder="Cree una contraseña"
                />
                <div className="label-tc">
                    <Controller
                        name="validateIsAdult"
                        control={control}
                        as={
                            <Checkbox
                                error={errors.validateIsAdult}
                                options={[
                                    {
                                        label: (
                                            <label style={{cursor: "pointer"}}>
                                                Soy mayor de 18 años y estoy de acuerdo con los{" "}
                                                <span
                                                    onClick={() => setActiveModalTyC(!activeModalTyC)}
                                                >
                          términos y condiciones
                        </span>
                                            </label>
                                        ),
                                        value: "WR",
                                    },
                                ]}
                                required
                            />
                        }
                    />
                </div>
                <div className="label-tc">
                    <Controller
                        name="validateReceiveNotifications"
                        control={control}
                        as={
                            <Checkbox
                                error={errors.validateReceiveNotifications}
                                className="input-checkbox"
                                options={[
                                    {
                                        label: (
                                            <label style={{cursor: "pointer"}}>
                                                Deseo recibir notificaciones de la página como
                                                promociones exclusivas, avisos importantes y demás
                                            </label>
                                        ),
                                        value: "WR",
                                    },
                                ]}
                                required
                            />
                        }
                    />
                </div>
                <div className="label-tc">
                    <Controller
                        name="singleAccount"
                        control={control}
                        as={
                            <Checkbox
                                error={errors.singleAccount}
                                className="input-checkbox"
                                options={[
                                    {
                                        label: (
                                            <label style={{cursor: "pointer"}}>
                                                Certifico que esta es mi primera y única cuenta de
                                                ebombo.
                                            </label>
                                        ),
                                        value: "WR",
                                    },
                                ]}
                                required
                            />
                        }
                    />
                </div>
                <br/>
                <ButtonBombo
                    width="100%"
                    htmlType="submit"
                    loading={
                        globalIsLoadingCreateUser ||
                        globalIsLoadingFacebookAuth ||
                        globalIsLoadingUser
                    }
                >
                    Registrarme
                </ButtonBombo>
            </form>
        </>
    );

    return (
        <RegistrationContainer>
            <h2>Registro</h2>
            {registrationContainer()}
            <Suspense fallback={spinLoader()}>
                <TermConditions
                    setActiveModalTyC={setActiveModalTyC}
                    activeModalTyC={activeModalTyC}
                />
            </Suspense>
        </RegistrationContainer>
    );
};

const ContainerButtonFacebook = styled.div`
  padding-top: 15px;
  margin: 0 auto;
  max-width: 300px;
`;

const ContainerFavorites = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 100%;

  .games-container,
  .consoles-container {
    display: flex;
    justify-content: center;
    height: 71px;
    margin: 0 auto;
    overflow: auto;
    max-width: 100%;
  }

  h3 {
    text-align: center;
  }
`;

const NextButton = styled(Button)`
  background-color: transparent;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: block;
  width: 242px;
  height: 27px;
  border: 1px solid ${(props) => props.theme.basic.primary};
  color: ${(props) => props.theme.basic.primary};
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 4px 4px ${(props) => props.theme.basic.default};
  border-radius: 6px;
  margin-left: auto;
  margin-right: auto;
  line-height: 27px;

  :before {
    background: none;
  }

  :hover {
    background-color: ${(props) => props.theme.basic.primary};
    color: ${(props) => props.theme.basic.default};
  }
`;

const RegistrationContainer = styled.div`
  padding: 1.25rem 1.5rem;

  .label {
    color: ${(props) => props.theme.basic.primary};
    margin: 0;
    font-size: 12px;
  }

  h2 {
    text-align: center;
    color: ${(props) => props.theme.basic.white};
    font-size: 14px;
    padding: 1rem 0;
  }

  .container-button-facebook {
    padding: 20px 50px;
  }

  .games-container {
    max-width: 400px;
    margin: 1rem auto;
  }

  .label-tc {
    display: flex;

    label {
      font-size: 12px;
      color: ${(props) => props.theme.basic.whiteDarken};
      margin: 0 0 5px 5px;

      span {
        color: ${(props) => props.theme.basic.action};
        cursor: pointer;
      }
    }
  }

  .phone-content {
    display: grid;
    grid-template-columns: 1fr 10fr;
    grid-gap: 1rem;
  }

  div {
    .title {
      display: none;
    }

    .games {
      justify-content: center;
    }

    .consoles {
      justify-content: center;
    }
  }

  h3 {
    font-size: 12px;
    color: ${(props) => props.theme.basic.white};
    margin-bottom: 1rem;

    ${mediaQuery.afterTablet} {
      text-align: center;
    }
  }

  svg {
    color: ${(props) => props.theme.basic.primary};
  }

  form {
    margin: 0 auto;
    max-width: 400px;
  }

  .ant-select {
    border: none;
    border-radius: 3px;
    height: 34px;
    background: ${(props) => props.theme.basic.blackLighten};
    color: ${(props) => props.theme.basic.white};
    font-size: 10px;

    .ant-select-selection {
      background: none !important;
      border-radius: 0;
      border: none;
      outline: none;

      :active {
        outline-color: ${(props) => props.theme.basic.primary};
      }

      .ant-select-selection__placeholder {
        font-size: 10px;
        color: ${(props) => props.theme.basic.whiteDarken};
        line-height: 24px;
      }
    }

    ::placeholder {
      font-size: 10px;
      color: ${(props) => props.theme.basic.whiteDarken};
    }
  }
`;

const CountryCode = styled.div`
  width: 40px;
  height: 34px;
  line-height: 34px;
  text-align: center;
  border: none;
  border-radius: 3px;
  background: ${(props) => props.theme.basic.blackDarken};
  color: ${(props) => props.theme.basic.white};
  font-size: 10px;
`;
