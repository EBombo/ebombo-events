import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import {mediaQuery} from "../../styles/constants";
import {ButtonBombo} from "./ButtonBombo";
import UrlAssembler from "url-assembler";
import {config} from "../../firebase";
import {message} from "antd";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../utils/useFetch/useFetch";

export const Suggestion = () => {
  const [authUser] = useGlobal("user");

  const [suggestion, setSuggestion] = useState("");
  const [isLoadingSendSuggestion, setIsLoadingSendSuggestion] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const sendSuggestion = async (event) => {
    event.preventDefault();
    try {
      setIsLoadingSendSuggestion(true);

      await ownFetch(urlApiChatMessage(), "POST", { suggestion: suggestion });

      setSuggestion("");
      message.success("Se envio correctamente la sugerencia", 5);
    } catch (error) {
      handleError({ ...error, action: "sendSuggestion" });
    } finally {
      setIsLoadingSendSuggestion(false);
    }
  };

  const urlApiChatMessage = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/suggestions/:userId")
      .param({
        userId: authUser.id,
      })
      .toString();

  return (
    <ContainerSuggestion>
      <div className="title-suggestion">¿TIENES ALGUNA DUDA O SUGERENCIA?</div>
      <div className="form-container">
        {isEmpty(authUser) ? (
          <div className="alert-message">
            Se necesita iniciar sesión para enviar una sugerencia
          </div>
        ) : (
          <form onSubmit={sendSuggestion} className="send-suggestion">
            <textarea
              placeholder="Escribe una sugerencia"
              rows="5"
              cols="60"
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              className="input-suggestion"
              required
            />
            <div className="content-button">
              <ButtonBombo
                loading={isLoadingSendSuggestion}
                htmlType="submit"
                margin="0 !important"
              >
                Enviar
              </ButtonBombo>
            </div>
          </form>
        )}
      </div>
    </ContainerSuggestion>
  );
};

const ContainerSuggestion = styled.div`
  .title-suggestion {
    margin: 10px 0 !important;
    font-weight: bold;
    font-size: 12px;
    line-height: 12px;
    color: ${(props) => props.theme.colorGrey.grey};
  }

  .form-container {
    background: transparent;
    margin: 0.5rem 0px;
    border-radius: 6px;

    ${mediaQuery.afterTablet} {
      width: 70%;
    }

    .alert-message {
      text-align: center;
      color: ${(props) => props.theme.basic.action};
    }

    .send-suggestion {
      textarea {
        color: ${(props) => props.theme.basic.white};
      }

      .input-suggestion {
        background: ${(props) => props.theme.basic.blackDarken};
        padding: 6px 10px;
        border-radius: 3px;
        border: none;
        font-size: 0.7rem;
        width: 100%;
      }

      .content-button {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
`;
