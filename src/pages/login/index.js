import { Anchor, ButtonAnt, Input } from "../../components/form";
import { Divider } from "../../components/common/Divider";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { object, string } from "yup";
import { useRouter } from "next/router";

const Login = (props) => {
  const router = useRouter();
  const validationSchema = object().shape({
    email: string().required().email(),
    password: string().required(),
  });

  const { ButtonsProviders, signIn } = useAuth();
  const [isLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser] = useGlobal("isLoadingCreateUser");
  const [, setIsVisibleForgotPassword] = useGlobal("isVisibleForgotPassword");
  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  return (
    <LoginContainer>
      <Divider>Iniciar sesión</Divider>
      <form onSubmit={handleSubmit(signIn)} autoComplete="on" noValidate>
        <Input
          error={errors.email}
          type="email"
          ref={register}
          name="email"
          variant="primary"
          placeholder="email"
        />
        <Input
          error={errors.password}
          type="password"
          autoComplete="on"
          ref={register}
          name="password"
          variant="primary"
          placeholder="password"
        />
        <ButtonAnt
          loading={isLoadingUser}
          disabled={isLoadingUser || isLoadingCreateUser}
          variant="contained"
          className="btn-primary"
          width="100%"
          fontSize="14px"
          padding="6px"
          border-radius="0"
          htmlType="submit"
        >
          Iniciar sesión
        </ButtonAnt>
      </form>
      <Anchor
        onClick={() => setIsVisibleForgotPassword(true)}
        variant="primary"
        display="flex"
        margin="10px auto"
      >
        Recuperar clave
      </Anchor>
      <Anchor
        onClick={() => router.push("/register")}
        variant="primary"
        display="flex"
        margin="10px auto"
      >
        Registrate
      </Anchor>
      <Divider>o</Divider>
      <ButtonsProviders google />
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  svg {
    color: ${(props) => props.theme.basic.white};
  }

  .ant-btn-loading {
    color: ${(props) => props.theme.basic.white};
  }
`;

export default Login;
