import { Anchor, ButtonAnt, Input } from "../../components/form";
import { Divider } from "../../components/common/Divider";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import React, { useGlobal } from "reactn";
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
  const [isLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser] = useGlobal("isLoadingCreateUser");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [, setIsVisibleForgotPassword] = useGlobal("isVisibleForgotPassword");

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  return (
    <LoginContainer>
      <div className="container">
        <Desktop>
          <Image src={`${config.storageUrl}/resources/register-img.png`} height="100%" width="100%" size="contain" />
        </Desktop>

        <form onSubmit={handleSubmit(signIn)} autoComplete="on" className="form-container" noValidate>
          <div className="title">Iniciar sesión</div>

          <Divider> o </Divider>

          <ButtonsProviders google />

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
            width="100%"
            fontSize="14px"
            height="45px"
            borderRadius="0"
            htmlType="submit"
          >
            Iniciar sesión
          </ButtonAnt>
          <Anchor
            onClick={() => setIsVisibleForgotPassword(true)}
            variant="primary"
            display="block"
            margin="1rem auto"
            fontSize="1rem"
            fontWeight="bold"
          >
            Recuperar contraseña
          </Anchor>
        </form>
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  height: 100vh;

  .container {
    margin: auto;
    display: grid;
    background-color: ${(props) => props.theme.basic.gray};

    ${mediaQuery.afterDesktop} {
      grid-template-columns: 1fr 1.5fr;
    }
  }

  .form-container {
    margin: auto;
    min-width: 300px;
  }

  .title {
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    color: ${(props) => props.theme.basic.secondary};
  }

  .input-container {
    margin: 0.5rem auto;
  }
`;

export default Login;
