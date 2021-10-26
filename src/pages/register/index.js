import { ButtonAnt, Input, InputGroup, Select } from "../../components/form";
import { Divider } from "../../components/common/Divider";
import { Controller, useForm } from "react-hook-form";
import React, { useEffect, useGlobal } from "reactn";
import { useAuth } from "../../hooks/useAuth";
import { mediaQuery, sizes, Desktop } from "../../constants";
import styled from "styled-components";
import { dialCodes } from "../../utils";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { useRouter } from "next/router";
import { getData } from "country-list";
import { object, string, ref } from "yup";
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
        passwordConfirmation: string().oneOf([ref('password'), null], 'Passwords must match'),
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
            <div className="container">

                <Desktop>
                    <Image src={`${config.storageUrl}/resources/register-img.png`}
                        height="100%"
                        width="100%"
                        size="contain" />
                </Desktop>

                <form onSubmit={handleSubmit(signUpUser)} autoComplete="off" className="form-container" noValidate>

                    <div className="title">
                        Regístrate
                </div>

                    <div className="providers-content">

                        <Divider> o </Divider>

                        <ButtonsProviders google />

                    </div>

                    <div className="inputs-container">
                        <Input
                            error={errors.name}
                            type="text"
                            ref={register}
                            height="40px"
                            name="name"
                            autoComplete="off"
                            placeholder="Nombre"
                        />
                        <Input
                            error={errors.lastName}
                            type="text"
                            ref={register}
                            height="40px"
                            name="lastName"
                            autoComplete="off"
                            placeholder="Apellidos"
                        />
                    </div>

                    <div className="inputs-container">

                        <Input
                            error={errors.email}
                            type="email"
                            ref={register}
                            name="email"
                            height="40px"
                            autoComplete="off"
                            placeholder="Correo"
                        />

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
                                        marginbottom="0"
                                        height="40px"
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
                                        marginbottom="0"
                                        height="40px"
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
                                        marginbottom="0"
                                        height="40px"
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

                    <div className="inputs-container">

                        <InputGroup gridTemplateColumns="2fr 50px">
                            <Controller
                                name="countryCode"
                                control={control}
                                as={
                                    <Select
                                        placeholder="Pais"
                                        showSearch
                                        virtual={false}
                                        marginbottom="0"
                                        height="40px"
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
                        </InputGroup>

                        <Input
                            error={errors.phoneNumber}
                            type="number"
                            ref={register}
                            height="40px"
                            name="phoneNumber"
                            autoComplete="off"
                            placeholder="Celular"
                        />

                    </div>

                    <div className="inputs-container">
                        <Input
                            error={errors.password}
                            type="password"
                            ref={register}
                            height="40px"
                            name="password"
                            autoComplete="off"
                            placeholder="Contraseña"
                        />

                        <Input
                            error={errors.passwordConfirmation}
                            type="password"
                            ref={register}
                            height="40px"
                            name="passwordConfirmation"
                            autoComplete="off"
                            placeholder="Contraseña"
                        />
                    </div>

                    <ButtonAnt width="auto"
                        htmlType="submit"
                        margin="2rem auto"
                        size="big"
                        variant="contained"
                        loading={isLoadingCreateUser}
                        disabled={isLoadingUser || isLoadingCreateUser}>
                        Registrar
                </ButtonAnt>

                </form>

            </div>
        </RegisterContainer>
    );
};

const RegisterContainer = styled.div`
  display: flex;
  height: 100vh;

  .container {
    margin: auto;
    display:grid;
    background-color: ${(props) => props.theme.basic.gray};
  
    ${mediaQuery.afterDesktop}{
        grid-template-columns:1fr 1.5fr;
    }
  
    .form-container{
        margin: auto;
    }
  
    .title {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        color: ${(props) => props.theme.basic.secondary};
    }
  
    .providers-content {
        display:grid;
        margin: auto 10px;
        
        ${mediaQuery.afterDesktop}{
            margin: auto 5rem;
        }
    }
  
    .inputs-container {
      padding: 0 0.5rem;
      margin: 0.7rem auto;
      display:grid;
      grid-template-columns: 1fr;
      grid-gap: 10px;
      
      ${mediaQuery.afterDesktop}{
          grid-template-columns: 1fr 1fr;
      }
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
  }
`;

const CountryCode = styled.div`
  width: 45px;
  height: 40px;
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
`;
