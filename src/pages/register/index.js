import { ButtonAnt, Input, InputGroup, Select } from "../../components/form";
import { Divider } from "../../components/common/Divider";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useGlobal } from "reactn";
import { useAuth } from "../../hooks/useAuth";
import { mediaQuery } from "../../constants";
import styled from "styled-components";
import { dialCodes } from "../../utils";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useRouter } from "next/router";
import { getData } from "country-list";
import { object, string } from "yup";
import get from "lodash/get";

export const Register = (props) => {
  const validationSchema = object().shape({
    name: string().required(),
    lastName: string().required(),
    email: string()
      .required()
      .email()
      .test("", "Email invalid!", (email_) => !email_.includes("yopmail.com")),
    password: string().required().min(6),
    countryCode: string().required(),
    phoneNumber: string().required().min(5),
  });

  const { signUp, ButtonsProviders } = useAuth();
  const [authUser] = useGlobal("user");
  const [isLoadingUser] = useGlobal("isLoadingUser");
  const [isLoadingCreateUser] = useGlobal("isLoadingCreateUser");

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

  return (
    <RegisterContainer>
      <Divider>
        <div className="divider-content">
          <Image
            margin="0"
            width="15px"
            height="15px"
            src={`${config.storageUrl}/resources/personal-info.svg`}
            size="contain"
          />
          <div className="subtitle">Información Personal</div>
        </div>
      </Divider>
      <form onSubmit={handleSubmit(signUp)} autoComplete="off" noValidate>
        <Input
          error={errors.name}
          type="text"
          ref={register}
          name="name"
          autoComplete="off"
          placeholder="Nombre"
        />
        <Input
          error={errors.lastName}
          type="text"
          ref={register}
          name="lastName"
          autoComplete="off"
          placeholder="Apellidos"
        />
        <Input
          error={errors.email}
          type="email"
          ref={register}
          name="email"
          autoComplete="off"
          placeholder="Correo"
        />
        <Input
          error={errors.password}
          type="password"
          ref={register}
          name="password"
          autoComplete="off"
          placeholder="Contraseña"
        />
        <InputGroup gridTemplateColumns="2fr 50px 3fr">
          <Controller
            name="countryCode"
            control={control}
            as={
              <Select
                placeholder="Country"
                showSearch
                virtual={false}
                autoComplete="off"
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
                    .indexOf(input.toLowerCase()) >= 0
                }
              />
            }
          />
          <CountryCode>{dialCode(watch("countryCode"))}</CountryCode>
          <Input
            error={errors.phoneNumber}
            type="number"
            ref={register}
            name="phoneNumber"
            autoComplete="off"
            placeholder="Celular"
          />
        </InputGroup>
        <ButtonAnt
          loading={isLoadingCreateUser}
          disabled={isLoadingUser || isLoadingCreateUser}
          variant="contained"
          htmlType="submit"
          width="100%"
        >
          Registrar
        </ButtonAnt>
      </form>
      <Divider>o</Divider>
      <ButtonsProviders google />
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  margin: 10px auto;
  background-color: ${(props) => props.theme.basic.gray};
  min-height: 100vh;

  .title {
    color: ${(props) => props.theme.basic.white};
    text-align: center;
  }
  
  .divider-content {
    display: flex;
    justify-content: center;
    align-items: center;

    .subtitle {
      margin-left: 10px;
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: ${(props) => props.theme.basic.grayLight};
    }
  }

  ${mediaQuery.afterTablet} {
    max-width: 400px;
    
  }
`;

const CountryCode = styled.div`
  height: 30px;
  line-height: 34px;
  text-align: center;
  border: none;
  border-radius: 0 !important;
  background: ${(props) => props.theme.basic.primary};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  color: ${(props) => props.theme.basic.white};
  font-size: 10px;
`;
