import React, {useGlobal} from "reactn";
import {object, string} from "yup";
import {notification} from "antd";
import Input from "../common/form/Input";
import {useForm} from "react-hook-form";
import get from "lodash/get";
import {firestore} from "../../firebase";
import {firebaseAuthenticationError} from "../../firebase/auth";
import {querySnapshotToArray} from "../../utils";
import {doSignInWithEmailAndPassword} from "../../firebase/authentication";
import styled from "styled-components";
import {btnPrimary} from "../../styles/constants";
import {Icon} from "../common/Icons";
import {ButtonBombo} from "../common";

export const LoginModal = (props) => {
    const validationSchema = object().shape({
        email: string().trim().required().email(),
        password: string().required(),
    });

    const [globalIsLoadingUser, setGlobalIsLoadingUser] = useGlobal(
        "isLoadingUser"
    );
    const [globalIsLoadingCreateUser] = useGlobal("isLoadingCreateUser");
    const [globalIsLoadingFacebookAuth] = useGlobal("isLoadingFacebookAuth");
    const {register, errors, handleSubmit} = useForm({
        validationSchema,
        reValidateMode: "onSubmit",
    });

    const emailRegisteredWithProvider = async (email) => {
        const userQuerySnapshot = await firestore
            .collection("users")
            .where("email", "==", email)
            .get();

        if (userQuerySnapshot.empty) return false;

        const user = querySnapshotToArray(userQuerySnapshot)[0];

        const provider = get(user, "providers[0]", null);

        return provider !== "password";
    };

    const onLoginError = async (error, email) => {
        let errorMessage;
        errorMessage = firebaseAuthenticationError[error.code];

        const isEmailRegisteredWithProvider = await emailRegisteredWithProvider(
            email
        );
        if (isEmailRegisteredWithProvider)
            errorMessage = "Email is register with another provider";

        await setGlobalIsLoadingUser(false);

        notification["error"]({
            message: "Login error",
            description: errorMessage,
        });
    };

    const onSubmitLogin = async (data) => {
        try {
            await setGlobalIsLoadingUser(true);
            const userRecord = await doSignInWithEmailAndPassword(
                data.email.toLowerCase().trim(),
                data.password
            );
            !get(userRecord, "success", false) &&
            (await onLoginError(get(userRecord, "error", null), data.email));
        } catch (error) {
            await onLoginError(error, data.email);
        }
    };

    return (
        <FormContainerLoginDesktop>
            <FormLoginDesktop
                onSubmit={handleSubmit(onSubmitLogin)}
                autoComplete="off"
                className="login-form-container"
                noValidate
            >
                <div className="subtitle-between-lines-desktop">
                    <hr/>
                    <span>Iniciar Sesión</span>
                    <hr/>
                </div>
                <div className="content-item">
                    <Input
                        variant="primary"
                        type="text"
                        id="email"
                        name="email"
                        ref={register}
                        autoComplete="off"
                        error={errors.email}
                        placeholder="Ingresa tu email"
                    />
                </div>
                <div className="content-item">
                    <Input
                        variant="primary"
                        type="password"
                        id="password"
                        name="password"
                        ref={register}
                        error={errors.password}
                        autoComplete="off"
                        placeholder="Ingresa tu contraseña"
                    />
                </div>
                <div className="content-btn-desktop">
                    <ButtonBombo
                        block={true}
                        margin={"10px auto 0 auto"}
                        width="100%"
                        htmlType="submit"
                        loading={globalIsLoadingUser}
                        disabled={
                            globalIsLoadingUser ||
                            globalIsLoadingCreateUser ||
                            globalIsLoadingFacebookAuth
                        }
                    >
                        Iniciar sesión {!globalIsLoadingUser && <Icon type="right"/>}
                    </ButtonBombo>
                </div>
            </FormLoginDesktop>
        </FormContainerLoginDesktop>
    );
};

export const FormContainerLoginDesktop = styled.div`
  padding-top: 1.5rem;
  max-width: 300px;
  margin: auto;

  .title {
    text-align: left;
    margin-bottom: 20px;
    color: ${(props) => props.theme.basic.white};
  }

  .content-btn-desktop {
    width: 100%;
    display: flex;
    text-align: center;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 0px 50px;

    .btn-login {
      width: 100%;
      border: 1px solid ${(props) => props.theme.basic.primary} !important;

      ${btnPrimary("1rem", 600, 0, "100%", "50px")}

      align-items: center;
      margin-top: 10px;
      border-radius: 2px;

      &:active {
        background: ${(props) => props.theme.basic.primary};
        color: ${(props) => props.theme.basic.blackDarken};
      }
    }
  }

  .subtitle-between-lines-desktop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;

    hr {
      background-color: ${(props) => props.theme.basic.primary};
      color: ${(props) => props.theme.basic.primary};
      border: none;
      width: 25%;
      height: 1px;
    }

    span {
      color: ${(props) => props.theme.basic.white};
      font-size: 13px;
      font-weight: 500;
      padding: 0 10px 0 10px;
    }
  }
`;

export const FormLoginDesktop = styled.form`
  .has-error .ant-form-explain {
    display: none;
  }

  .error-message {
    color: ${(props) => props.theme.basic.danger};
  }

  .title {
    color: ${(props) => props.theme.basic.white};
  }

  .content-item {
    margin-bottom: 2px;

    svg {
      color: ${(props) => props.theme.basic.white};
      cursor: pointer;
      margin-top: 3px;
      bottom: 35%;
    }
  }

  .forgot-password-desktop {
    width: auto;
    text-align: left;

    div {
      color: ${(props) => props.theme.basic.white};

      span {
        cursor: pointer;
        text-decoration: underline;

        &:hover {
          color: ${(props) => props.theme.basic.primary};
        }
      }
    }
  }
`;
