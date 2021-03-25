import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import {Button, Modal, notification} from "antd";
import {btnPrimaryGeneral} from "../styles/constants";
import {ButtonBombo, Input, InputGroup, Select} from "./common";
import UrlAssembler from "url-assembler";
import {config} from "../firebase";
import {doSignOut} from "../firebase/authentication";
import {Controller, useForm} from "react-hook-form";
import {getData} from "country-list";
import {object, string} from "yup";
import {dialCodes} from "../utils";
import get from "lodash/get";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../utils/useFetch/useFetch";
import {darkTheme} from "../styles/theme";

export const ModalVerifySMS = () => {
  const validationSchema = object().shape({
    countryCode: string().required(),
    phoneNumber: string().required().min(5),
  });

  const { register, errors, handleSubmit, control, watch } = useForm({
    validationSchema,
    reValidateMode: "onSubmit",
  });

  const [authUser] = useGlobal("user");

  const [, setOpenSidebarMobile] = useGlobal("openSidebarMobile");
  const [, setLoadingSearchMatches] = useGlobal("loadingSearchMatches");
  const [, setShowGuide] = useGlobal("showGuide");

  const [loadingValidateCodeSMS, setLoadingValidateCodeSMS] = useState(false);

  const [loadingResendCodeSMS, setLoadingResendCodeSMS] = useState(false);
  const [isLoadingChangeNumber, setIsLoadingChangeNumber] = useState(false);

  const [formChangeNumberPhone, setFormChangeNumberPhone] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const [code, setCode] = useState("");

  const resendCodeSMS = async () => {
    try {
      setLoadingResendCodeSMS(true);

      await ownFetch(urlApiResendCodeSMS(), "GET");

      notification.success({
        placement: "bottomLeft",
        message: "SE RENVIO EL CODIGO A TU CELULAR",
      });
    } catch (error) {
      handleError({ ...error, action: "resendCodeSMS" });
    }
    setLoadingResendCodeSMS(false);
  };

  const validateCode = async () => {
    try {
      setLoadingValidateCodeSMS(true);

      await ownFetch(urlApiValidateCodeSMS(code), "GET");

      notification.success({
        placement: "bottomLeft",
        message: "SE VERIFICO CORRECTAMENTE!",
      });

      // await setShowGuide(true);
    } catch (error) {
      handleError({ ...error, action: "validateCode" });
    }
    setLoadingValidateCodeSMS(false);
  };

  const logOut = () => {
    setLoadingSearchMatches(false);
    setOpenSidebarMobile(false);
    doSignOut();
  };

  const urlApiValidateCodeSMS = (code) =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/verify/:userId/verification-code/:verificationCode")
      .param({
        userId: authUser.id,
        verificationCode: code,
      })
      .toString();

  const urlApiResendCodeSMS = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/verify/:userId/resend-code")
      .param({
        userId: authUser.id,
      })
      .toString();

  const dialCode = (countryCode) => {
    const country = dialCodes.find((country) => country.code === countryCode);

    return get(country, "dialCode", null);
  };

  const onSubmitChangeUser = async ({ countryCode, phoneNumber }) => {
    try {
      setIsLoadingChangeNumber(true);

      await ownFetch(
        urlApiChangePhoneNumber(
          authUser.id,
          countryCode,
          phoneNumber,
          dialCode(countryCode)
        ),
        "PUT"
      );

      setFormChangeNumberPhone(false);
      notification.success({
        placement: "bottomLeft",
        message: "SE CAMBIO EL NUMERO DE SU CELULAR CORRECTAMENTE",
      });
    } catch (error) {
      handleError({ ...error, action: "onSubmitChangeUser" });
    }
    setIsLoadingChangeNumber(false);
  };

  const urlApiChangePhoneNumber = (
    userId,
    countryCode,
    phoneNumber,
    dialCode
  ) =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/users/:userId/:phoneNumber/:countryCode/:dialCode")
      .param({
        userId,
        countryCode,
        dialCode,
        phoneNumber,
      })
      .toString();

  return (
    <ModalVerifyContent
      className="modal-verification-email-desktop"
      closable={false}
      visible={!get(authUser, "isVerified", false)}
    >
      {formChangeNumberPhone ? (
        <>
          <div className="header-modal">
            <span className="name-user">
              Hola <b>{get(authUser, "name", "")}</b>{" "}
            </span>
            <span className="text-title-modal">
              Ingrese su numero de celular con el que verificara.
            </span>
          </div>
          <FormContent onSubmit={handleSubmit(onSubmitChangeUser)} noValidate>
            <InputGroup gridTemplateColumns="2fr 50px 3fr">
              <div>
                <Controller
                  name="countryCode"
                  control={control}
                  as={
                    <Select
                      placeholder="País"
                      showSearch
                      error={errors.countryCode}
                      optionFilterProp="children"
                      optionsdom={getData().map((country) => ({
                        key: country.code,
                        code: country.code,
                        name: country.name,
                      }))}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      marginBottom="0.5rem"
                    />
                  }
                />
              </div>
              <CountryCode>{dialCode(watch("countryCode"))}</CountryCode>
              <Input
                error={errors.phoneNumber}
                marginBottom="0.5rem"
                type="number"
                autoComplete="new-password"
                ref={register}
                name="phoneNumber"
                placeholder="Celular"
              />
            </InputGroup>
            <NextButton
              htmlType="submit"
              disabled={isLoadingChangeNumber}
              loading={isLoadingChangeNumber}
            >
              Cambiar y Reenviar
            </NextButton>
          </FormContent>
        </>
      ) : (
        <>
          <div className="header-modal">
            <span className="name-user">
              Hola <b>{get(authUser, "name", "")}</b>{" "}
            </span>
            <span className="text-title-modal">
              Escriba el codigo que lo enviamos a su numero que termina en ***
              *** {get(authUser, "phoneNumber", "").substr(-3)}, proporcionado
              en su registro.
            </span>
          </div>
          <div className="content-input">
            <input
              placeholder="Codigo"
              value={code}
              type="text"
              onChange={(event) => setCode(event.target.value)}
              className="input-code"
              required
            />
            <ButtonBombo
              disabled={loadingResendCodeSMS}
              onClick={() => resendCodeSMS()}
              margin="5px 10px 0px 10px !important"
              type="secondary"
              bgColorEvents={darkTheme.basic.black}
              border={`2px solid ${darkTheme.basic.action} !important`}
              colorEvents={darkTheme.basic.action}
              color={darkTheme.basic.action}
              bgColorBefore={true}
            >
              REENVIAR
            </ButtonBombo>
          </div>
          <div className="body-modal">
            <ButtonBombo
              className="btn-send-code-verify"
              loading={loadingValidateCodeSMS}
              disabled={loadingValidateCodeSMS}
              onClick={() => validateCode()}
            >
              VALIDAR CÓDIGO
            </ButtonBombo>
          </div>
        </>
      )}
      <div className="footer-modal">
        <div
          className="link-change-numberphone"
          onClick={() => setFormChangeNumberPhone(!formChangeNumberPhone)}
        >
          {formChangeNumberPhone ? "Atras" : "Cambiar mi numero de celular"}
        </div>
        <div className="link-sing-up" onClick={() => logOut()}>
          Cerrar sesión
        </div>
      </div>
    </ModalVerifyContent>
  );
};

const ModalVerifyContent = styled(Modal)`
  padding-bottom: 0;

  .ant-modal-content {
    // background: #eaeaea;
    background: ${(props) => props.theme.basic.blackDarken};
    border-radius: 9px;
    border: 3px solid ${(props) => props.theme.basic.primary};

    .ant-modal-close {
      padding-bottom: 1rem;
      color: ${(props) => props.theme.basic.blackDarken};
      font-size: 20px;
    }

    .ant-modal-footer {
      display: none;
    }
  }

  .header-modal {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .name-user {
      font-size: 1.3rem;
      font-weight: 500;
      // color: #000000;
      color: ${(props) => props.theme.basic.white};
      margin-bottom: 10px;
    }

    .text-title-modal {
      margin-top: 5px;
      font-size: 1rem;
      color: ${(props) => props.theme.basic.white};
    }

    .message-verified-email {
      color: ${(props) => props.theme.basic.white};
      font-weight: 500;
      padding: 10px 0;
    }
  }

  .content-input {
    display: grid;
    grid-template-columns: 65% 35%;
    justify-content: center;
    input {
      color: ${(props) => props.theme.basic.white};
    }
    .input-code {
      background: transparent;
      margin-top: 5px;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 0.9rem;
      border: 1px solid ${(props) => props.theme.basic.primary};
    }
  }

  .body-modal {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;

    .btn-send-code-verify {
      ${(props) =>
        btnPrimaryGeneral(
          "0.9rem",
          "600",
          "0",
          "90%",
          "40px",
          props.theme.basic.white,
          props.theme.basic.primary,
          "30px"
        )}
      box-shadow: 0px 1px 3px -1px ${(props) => props.theme.basic.blackDarken};
    }
  }

  .footer-modal {
    width: 100%;
    display: flex;
    justify-content: flex-end;

    .link-sing-up {
      color: ${(props) => props.theme.basic.danger};
      text-decoration: underline;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .link-change-numberphone {
      color: ${(props) => props.theme.basic.primary};
      margin-right: 15px;
      font-size: 0.9rem;
      cursor: pointer;
    }
  }
`;

const FormContent = styled.form`
  margin: 10px 0 auto;
  max-width: 568px;

  .ant-input,
  .ant-select {
    border: 1px solid ${(props) => props.theme.basic.primary};
    height: 34px;
    border-radius: 0 !important;
    background: ${(props) => props.theme.basic.blackDarken};
    box-shadow: 0 4px 4px ${(props) => props.theme.basic.default};
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
  height: 34px;
  line-height: 34px;
  text-align: center;
  border: none;
  border-radius: 0 !important;
  background: ${(props) => props.theme.basic.blackDarken};
  box-shadow: 0 4px 4px ${(props) => props.theme.basic.default};
  color: ${(props) => props.theme.basic.white};
  font-size: 10px;
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
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  margin: 10px auto 15px auto;
  line-height: 27px;

  :before {
    background: none;
  }

  :hover {
    background-color: ${(props) => props.theme.basic.primary};
    color: rgb(31, 31, 31);
  }
`;
