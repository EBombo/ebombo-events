import React, { useEffect, useGlobal } from "reactn";
import { Anchor, ButtonAnt, Input } from "../../components/form";
import { useAuth } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { useRouter } from "next/router";

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

  const { register, errors, handleSubmit } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (authUser) return router.push("/library");
  }, [authUser]);

  return (
    <div className="w-full h-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8">
      <div className="w-full max-w-[604px]">
        <form onSubmit={handleSubmit(signIn)} autoComplete="off" className="form-container" noValidate>
          <div className="form-content">
            <div className="text-['Lato'] text-[44px] leading-[53px] text-primary tracking-wide mb-8">
              Iniciar sesión
            </div>

            <ButtonsProviders google />

            <div className="my-4">
              <Input
                error={errors.email}
                type="email"
                ref={register}
                name="email"
                background="white"
                placeholder="Correo"
                height="45px"
              />
            </div>
            <div className="my-4">
              <Input
                error={errors.password}
                type="password"
                autoComplete="on"
                ref={register}
                name="password"
                background="white"
                placeholder="Contraseña"
                height="45px"
              />
            </div>
            <Anchor
              underlined
              url="/recovery"
              variant="primary"
              display="block"
              margin="1rem 0 2rem 0"
              fontSize="1rem"
              fontWeight="bold"
              textAlign="left"
            >
              Me olvide mi contraseña
            </Anchor>

            <ButtonAnt
              loading={isLoadingUser}
              disabled={isLoadingUser || isLoadingCreateUser}
              className="w-full"
              width="100%"
              fontSize="14px"
              height="45px"
              htmlType="submit"
            >
              Iniciar sesión
            </ButtonAnt>

            <div className="flex items-center gap-[5px] mt-12">
              <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] text-primary">¿No tienes una cuenta?</div>
              <Anchor
                underlined
                url="/register"
                variant="primary"
                display="block"
                margin="0"
                fontSize="18px"
              >
                Regístrate aquí
              </Anchor>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
