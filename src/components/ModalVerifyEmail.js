import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import UrlAssembler from "url-assembler";
import {config} from "../firebase";
import {ButtonBombo} from "./common";
import {doSignOut} from "../firebase/authentication";
import {ModalContainer} from "./common/ModalContainer";
import get from "lodash/get";
import {useSendError} from "./error-fallback/useSendError";
import {useOwnFetch} from "../utils/useFetch/useFetch";
import {darkTheme} from "../styles/theme";

export const ModalVerifyEmail = (props) => {
  const [authUser] = useGlobal("user");

  const [messageResendCodeEmail, setMessageResendCodeEmail] = useState("");
  const [loadingResendCodeEmail, setLoadingResendCodeEmail] = useState(false);
  const [, setOpenSidebarMobile] = useGlobal("openSidebarMobile");
  const [, setLoadingSearchMatches] = useGlobal("loadingSearchMatches");

  const { sendError } = useSendError();
  const { ownFetch } = useOwnFetch();

  const resendCodeEmail = async () => {
    let message = "CODIGO DE VERIFICACION ENVIADO!";
    try {
      setLoadingResendCodeEmail(true);
      setMessageResendCodeEmail("");
      await ownFetch(urlApiResendCodeEmail(), "GET");
    } catch (error) {
      message = "ALGO SALIO MAL, VUELVE A INTENTARLO!";
      await sendError(error);
    }

    setLoadingResendCodeEmail(false);
    setMessageResendCodeEmail(message);
  };

  const urlApiResendCodeEmail = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/verify/:userId/resend-code")
      .param({
        userId: authUser.id,
      })
      .toString();

  const logOut = () => {
    setLoadingSearchMatches(false);
    setOpenSidebarMobile(false);
    doSignOut();
  };

  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={!get(authUser, "isVerified")}
    >
      <FormVerifyEmailContainer>
        <div className="header-modal">
          <span className="name-user">
            Hola <b>{get(authUser, "name")}</b>{" "}
          </span>
          <span className="text-title-modal">
            Verifique su cuenta en su correo, si el correo no aparece por favor
            revisar en <b>Spam</b>, sino le llegó el correo vuelva a reenviar
            uno nuevo.
          </span>
          <span className="message-verified-email">
            {messageResendCodeEmail}
          </span>
        </div>
        <div className="body-modal">
          <ButtonBombo
            loading={loadingResendCodeEmail}
            onClick={() => resendCodeEmail()}
            type="secondary"
            bgColorEvents={darkTheme.basic.black}
            border={`2px solid ${darkTheme.basic.action} !important`}
            colorEvents={darkTheme.basic.action}
            color={darkTheme.basic.action}
            bgColorBefore={true}
          >
            REENVIAR CÓDIGO
          </ButtonBombo>
        </div>
        <div className="footer-modal">
          <div className="link-sing-up" onClick={() => logOut()}>
            Cerrar sesión
          </div>
        </div>
      </FormVerifyEmailContainer>
    </ModalContainer>
  );
};

const FormVerifyEmailContainer = styled.div`
  .header-modal {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .name-user {
      font-size: 1.3rem;
      font-weight: 500;
      color: ${(props) => props.theme.basic.white};
      margin-bottom: 10px;
    }

    .text-title-modal {
      font-size: 1rem;
      color: ${(props) => props.theme.basic.white};
    }

    .message-verified-email {
      color: ${(props) => props.theme.basic.white};
      font-weight: 500;
      padding: 10px 0;
    }
  }

  .body-modal {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
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
  }
`;
