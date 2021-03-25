import React, {useEffect} from "reactn";
import {useSendError} from "./useSendError";
import styled from "styled-components";
import {config} from "../../firebase";
import {ButtonBombo} from "../common";

export const ErrorFallback = (props) => {
  const { sendError } = useSendError();

  useEffect(() => {
    console.error(props.error);
    sendError(props.error);
    if (props.error.data) console.debug(props.error.data);
  }, [props.error, sendError]);

  return (
    <ContainerError>
      <img src={`${config.storageUrl}/resources/ebombo-white.svg`} alt="" />
      <h2>ERROR</h2>
      <div className="description">
        Ha ocurrido un error en nuestra plataforma. Ya estamos trabajando para
        resolverlo. Por favor regrese al inicio.
      </div>
      <div className="buttons-container">
        <ButtonBombo
          margin={"1rem 0"}
          width={"100%"}
          maxWidth={"400px"}
          onClick={() => (window.location.href = "/")}
        >
          VOLVER AL INICIO
        </ButtonBombo>
        {props.resetErrorBoundary && (
          <ButtonBombo
            margin={"1rem 0"}
            onClick={props.resetErrorBoundary}
            maxWidth={"400px"}
            width={"100%"}
          >
            INTENTALO NUEVAMENTE
          </ButtonBombo>
        )}
      </div>
    </ContainerError>
  );
};

const ContainerError = styled.div`
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.basic.default};

  img {
    height: 40px;
    margin: 1rem 0;
  }

  h2 {
    color: ${(props) => props.theme.basic.white};
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
  }

  .description {
    margin: 1rem 0;
    color: ${(props) => props.theme.basic.white};
    text-align: center;
    font-weight: 500;
    font-size: 12px;
    line-height: 15px;
  }

  .buttons-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
