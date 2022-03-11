import React, { useState, useEffect } from "react";
import { ButtonAnt, Input, Select } from "../../components/form";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { dialCodes } from "../../utils";
import { useRouter } from "next/router";
import { getData } from "country-list";
import { object, ref, string } from "yup";
import get from "lodash/get";
import { DatePicker } from "antd";

export const Register = (props) => {
  const validationSchema = object().shape({
    name: string().required(),
    lastName: string().required(),
    email: string()
      .required()
      .email()
      .test("", "Email invalid!", (email_) => !email_.includes("yopmail.com")),
    password: string().required().min(6),
    passwordConfirmation: string().oneOf([ref("password"), null], "Passwords must match"),
    countryCode: string().required(),
    phoneNumber: string().required().min(5),
  });

  const { signUp, ButtonsProviders } = useAuth();
  const [authUser] = useGlobal("user");
  const [isLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser] = useGlobal("isLoadingCreateUser");

  const [birthDate, setBirthDate] = useState("");

  const { register, errors, handleSubmit, control, watch } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const router = useRouter();

  useEffect(() => {
    if (authUser) return router.push("/library");
  }, [authUser]);

  const dialCode = (countryCode) => {
    const country = dialCodes.find((country) => country.code === countryCode);

    return get(country, "dialCode", null);
  };

  const signUpUser = async (user) =>
    await signUp({
      ...user,
      birthDate,
    });

  return (
    <div className="w-full h-full bg-cover bg-no-repeat bg-white bg-pattern-gray p-4 md:p-8">
      <div className="w-full max-w-[604px]">
        <form onSubmit={handleSubmit(signUpUser)} autoComplete="off" className="form-container" noValidate>
          <div className="form-content">
            <div className="text-['Lato'] text-[44px] leading-[53px] text-primary tracking-wide mb-8">Regístrate</div>

            <ButtonsProviders google />

            <div className="my-3 grid gap-[10px] w-full md:grid-cols-[1fr_1fr] md:my-4">
              <Input
                error={errors.name}
                type="text"
                ref={register}
                height="40px"
                name="name"
                background="white"
                autoComplete="off"
                placeholder="Nombre"
              />
              <Input
                error={errors.lastName}
                type="text"
                ref={register}
                height="40px"
                name="lastName"
                background="white"
                autoComplete="off"
                placeholder="Apellidos"
              />
            </div>

            <div className="my-3 grid gap-[10px] w-full md:grid-cols-[1fr_1fr] md:my-4">
              <Input
                error={errors.email}
                type="email"
                ref={register}
                name="email"
                height="40px"
                background="white"
                autoComplete="off"
                placeholder="Correo"
              />

              <DatePicker
                onChange={(value) => {
                  setBirthDate(value.toDate());
                }}
                style={{ border: "1px solid #C4C4C4", borderRadius: "4px", height: "40px" }}
                placeholder="Fecha de nacimiento"
              />
            </div>

            <div className="my-3 grid gap-[10px] w-full md:grid-cols-[1fr_1fr] md:my-4">
              <Controller
                name="countryCode"
                control={control}
                as={
                  <Select
                    placeholder="Pais"
                    showSearch
                    virtual={false}
                    height="40px"
                    error={errors.countryCode}
                    background="white"
                    optionFilterProp="children"
                    optionsdom={getData().map((country) => ({
                      key: country.code,
                      code: country.code,
                      name: country.name,
                    }))}
                  />
                }
              />

              <Input
                error={errors.phoneNumber}
                type="number"
                ref={register}
                height="40px"
                name="phoneNumber"
                background="white"
                autoComplete="off"
                placeholder="Celular"
              />
            </div>

            <div className="my-3 grid gap-[10px] w-full md:grid-cols-[1fr_1fr] md:my-4">
              <Input
                error={errors.password}
                type="password"
                ref={register}
                height="40px"
                name="password"
                autoComplete="off"
                background="white"
                placeholder="Contraseña"
              />

              <Input
                error={errors.passwordConfirmation}
                type="password"
                ref={register}
                height="40px"
                name="passwordConfirmation"
                background="white"
                autoComplete="off"
                placeholder="Contraseña"
              />
            </div>

            <ButtonAnt
              htmlType="submit"
              width="100%"
              loading={isLoadingCreateUser}
              disabled={isLoadingUser || isLoadingCreateUser}
            >
              Regístrate
            </ButtonAnt>
          </div>
        </form>
      </div>
    </div>
  );
};