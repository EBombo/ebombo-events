import { ButtonAnt, Input, InputGroup, Select } from "../../components/form";
import { Divider } from "../../components/common/Divider";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useGlobal } from "reactn";
import { useAuth } from "../../hooks/useAuth";
import { mediaQuery, sizes } from "../../constants";
import styled from "styled-components";
import { dialCodes } from "../../utils";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useRouter } from "next/router";
import { getData } from "country-list";
import { object, string } from "yup";
import get from "lodash/get";
import { days, months, years } from "../../components/common/DataList";
import { darkTheme } from "../../theme";
import moment from "moment";

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
    day: string().required(),
    month: string().required(),
    year: string().required(),
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

  const signUpUser = async (user) => {
    await signUp({
      ...user,
      birthDate: moment(
        `${user.day}/${user.month}/${user.year}`,
        "DD/MM/YYYY"
      ).toDate(),
    });
  };

  return (
    <RegisterContainer>
      <form onSubmit={handleSubmit(signUpUser)} autoComplete="off" noValidate>
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
        <div className="inputs-container">
          <Input
            error={errors.name}
            type="text"
            ref={register}
            name="name"
            autoComplete="off"
            placeholder="Nombre"
          />
        </div>
        <div className="inputs-container">
          <Input
            error={errors.lastName}
            type="text"
            ref={register}
            name="lastName"
            autoComplete="off"
            placeholder="Apellidos"
          />
        </div>
        <div className="inputs-container">
          <div className="label">Fecha de Nacimiento</div>
          <InputGroupSelect>
            <Controller
              name="day"
              control={control}
              as={
                <Select
                  placeholder="día"
                  showSearch
                  virtual={false}
                  error={errors.day}
                  borderRight={`0.1px solid ${darkTheme.basic.grayLighten}`}
                  optionFilterProp="children"
                  borderRadius="3px 0px 0px 3px"
                  optionsdom={days.map((day) => ({
                    key: day.key,
                    name: day.value,
                    code: day.value,
                  }))}
                />
              }
            />
            <Controller
              name="month"
              control={control}
              as={
                <Select
                  placeholder="mes"
                  showSearch
                  virtual={false}
                  error={errors.month}
                  borderRight={`0.1px solid ${darkTheme.basic.grayLighten}`}
                  borderRadius="0px 0px 0px 0px"
                  optionFilterProp="children"
                  optionsdom={months.map((month) => ({
                    key: month.key,
                    code: month.key,
                    name: month.value,
                  }))}
                />
              }
            />
            <Controller
              name="year"
              control={control}
              as={
                <Select
                  placeholder="año"
                  showSearch
                  virtual={false}
                  borderRadius="0px 3px 3px 0px"
                  error={errors.year}
                  optionFilterProp="children"
                  optionsdom={years.map((year) => ({
                    key: year.key,
                    name: year.value,
                    code: year.value,
                  }))}
                />
              }
            />
          </InputGroupSelect>
        </div>

        <Divider>
          <div className="divider-content">
            <Image
              margin="0"
              width="15px"
              height="15px"
              src={`${config.storageUrl}/resources/contact-info.svg`}
              size="contain"
            />
            <div className="subtitle">Contacto</div>
          </div>
        </Divider>
        <div className="inputs-container">
          <Input
            error={errors.email}
            type="email"
            ref={register}
            name="email"
            autoComplete="off"
            placeholder="Correo"
          />
        </div>
        <div className="inputs-container">
          <InputGroup gridTemplateColumns="2fr 50px 3fr">
            <Controller
              name="countryCode"
              control={control}
              as={
                <Select
                  placeholder="Pais"
                  showSearch
                  virtual={false}
                  error={errors.countryCode}
                  optionFilterProp="children"
                  optionsdom={getData().map((country) => ({
                    key: country.code,
                    code: country.code,
                    name: country.name,
                  }))}
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
        </div>
        <Divider>
          <div className="divider-content">
            <Image
              margin="0"
              width="15px"
              height="15px"
              src={`${config.storageUrl}/resources/access-data.svg`}
              size="contain"
            />
            <div className="subtitle">Datos de acceso</div>
          </div>
        </Divider>
        <div className="inputs-container">
          <Input
            error={errors.password}
            type="password"
            ref={register}
            name="password"
            autoComplete="off"
            placeholder="Contraseña"
          />
          <ButtonAnt
            loading={isLoadingCreateUser}
            disabled={isLoadingUser || isLoadingCreateUser}
            variant="contained"
            htmlType="submit"
            width="100%"
            margin="0.5rem 0"
          >
            Registrar
          </ButtonAnt>
        </div>
      </form>
      <Divider>
        <div className="divider-content">O</div>
      </Divider>
      <div className="inputs-container">
        <ButtonsProviders google />
      </div>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  margin: 2rem auto;
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

  .inputs-container {
    padding: 0 0.5rem;
    margin: 0.5rem auto;
  }

  .label {
    color: ${(props) => props.theme.basic.grayLight};
    margin: 0.5rem 5px;
    font-size: ${sizes.font.medium};
  }

  ${mediaQuery.afterTablet} {
    .inputs-container {
      padding: 0;
      width: 100%;
      max-width: 400px;
    }
  }
`;

const CountryCode = styled.div`
  width: 45px;
  height: 36px;
  border: 1px solid ${(props) => props.theme.basic.grayLighten};
  border-radius: 4px;
  background: ${(props) => props.theme.basic.whiteLight};
  color: ${(props) => props.theme.basic.blackDarken};
  font-size: ${sizes.font.medium};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InputGroupSelect = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  margin: 0.5rem 0;
`;
