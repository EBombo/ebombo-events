import React, { useEffect, useGlobal } from "reactn";
import { Anchor, ButtonAnt, Input } from "../../components/form";
import { Divider } from "../../components/common/Divider";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import { object, string } from "yup";
import { useRouter } from "next/router";
import { Desktop, mediaQuery } from "../../constants";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";

const Login = (props) => {
  const router = useRouter();
  const validationSchema = object().shape({
    email: string().required().email(),
    password: string().required(),
  });

  const { ButtonsProviders, signIn } = useAuth();
  const [authUser] = useGlobal("user");
  const [isLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser] = useGlobal("isLoadingCreateUser");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [, setIsVisibleForgotPassword] = useGlobal("isVisibleForgotPassword");

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (authUser) return router.push("/library");
  }, [authUser]);

  return (
    <LoginContainer>
      <div className="container">
        <Desktop>
          <Image src={`${config.storageUrl}/resources/login-img.png`} height="100%" width="100%" size="cover" />
        </Desktop>

        <form onSubmit={handleSubmit(signIn)} autoComplete="on" className="form-container" noValidate>
          <div className="form-content">
            <div className="title">Iniciar sesión</div>

            <div className="providers-content">
              <Divider> o </Divider>

              <ButtonsProviders google />
            </div>

            <div className="input-container">
              <Input error={errors.email} type="email" ref={register} name="email" placeholder="Correo" height="45px" />
            </div>
            <div className="input-container">
              <Input
                error={errors.password}
                type="password"
                autoComplete="on"
                ref={register}
                name="password"
                placeholder="Contraseña"
                height="45px"
              />
            </div>
            <ButtonAnt
              loading={isLoadingUser}
              disabled={isLoadingUser || isLoadingCreateUser}
              className="btn-submit"
              fontSize="14px"
              height="45px"
              htmlType="submit"
            >
              Iniciar sesión
            </ButtonAnt>
            <Anchor
              onClick={() => router.push("/recovery")}
              variant="primary"
              display="block"
              margin="1rem auto"
              fontSize="1rem"
              fontWeight="bold"
            >
              Recuperar contraseña
            </Anchor>
          </div>
        </form>
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  height: calc(100vh - 100px);
  width: 100%;

  .container {
    margin: 0;
    width: 100%;
    padding: 1rem;
    display: grid;
    background-color: ${(props) => props.theme.basic.gray};

    ${mediaQuery.afterTablet} {
      padding: 0;
      margin: 0;
      grid-template-columns: 1fr 1.25fr;
    }

    .form-container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;

      .form-content {
        width: 100%;
      }
    }

    .title {
      font-size: 1.5rem;
      font-weight: bold;
      text-align: center;
      color: ${(props) => props.theme.basic.secondary};
    }

    .input-container {
      margin: 0.5rem auto;

      ${mediaQuery.afterTablet} {
        margin: 1rem 5rem;
      }
    }

    .providers-content {
      display: grid;
      margin: auto 10px;

      ${mediaQuery.afterTablet} {
        margin: auto 5rem;
      }
    }

    .btn-submit {
      width: 100%;
      margin: 0 auto;

      ${mediaQuery.afterTablet} {
        max-width: 380px;
      }
    }
  }
`;

export default Login;
