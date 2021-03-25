import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { Upload } from "../../../../../components";
import { useParams } from "react-router";
import { config } from "../../../../../firebase";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import assign from "lodash/assign";
import isEmpty from "lodash/isEmpty";
import UrlAssembler from "url-assembler";
import moment from "moment";
import { useInterval } from "../../../../../utils/useHooks";
import { dateToTimeMarker } from "../../../../../utils/convertor";
import { ButtonBombo } from "../../../../../components/common";
import { darkTheme } from "../../../../../styles/theme";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../utils/useFetch/useFetch";

const INTERVAL = 1000;

export const Claim = (props) => {
  const { matchId } = useParams();
  const [authUser] = useGlobal("user");

  const [isLoadingSendClaim, setIsLoadingSendClaim] = useState(false);
  const [isDisable, setIsDisable] = useState(true);
  const [claimTimer, setClaimTimer] = useState(0);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const isChallenger = get(props.match, "challengerIds", []).includes(
    get(authUser, "id")
  );
  const userRol = isChallenger ? "challenger" : "challenged";
  const currentClaim = get(props.match, `${userRol}Claim`, null);

  const validationSchema = yup.object().shape({
    message: yup.string().required(),
    imageUrl: yup.string().required(),
    imageUrlThumb: yup.string().required(),
  });

  const { register, handleSubmit } = useForm({
    validationSchema,
  });

  useInterval(
    () => {
      if (isEmpty(props.match.claimCreateAt)) return;

      const claimTimer_ = dateToTimeMarker({
        initial: moment(props.match.claimCreateAt.toDate()).add(1, "day"),
      });

      setClaimTimer(claimTimer_);
    },
    !isEmpty(props.match.claimCreateAt) ? INTERVAL : null
  );

  const sendClaim = async (data) => {
    try {
      setIsLoadingSendClaim(true);

      await ownFetch(urlApiLobbyClaim(), "PUT", mapClaim(data));
    } catch (error) {
      handleError({ ...error, action: "sendClaim" });
    } finally {
      setIsLoadingSendClaim(false);
    }
  };

  const urlApiLobbyClaim = () =>
    new UrlAssembler(`${config.serverUrlMatches}`)
      .template("/matches/:matchId/claim")
      .param({
        matchId: matchId,
      })
      .toString();

  const mapClaim = (data) => {
    return assign(
      {},
      {
        ...data,
        userId: authUser.id,
      }
    );
  };

  const imageNameClaim = () => {
    const userRol = props.isChallenger() ? "challenger" : "challenged";

    return `${userRol}-claim`;
  };

  return (
    <Container>
      <div className="title">EL ENCUENTRO HA ENTRADO EN DISPUTA</div>
      <div className="description">
        Este encuentro se encuentra en proceso de disputa porque ambos jugadores
        han ingresado resultados contradictorios.
        <br />
        Por favor, envíanos la evidencia que muestre que ganaste y le daremos la
        victoria al jugador correcto. Las disputas son resueltas hasta 24 horas
        después de iniciarse, sé paciente :)
      </div>
      <div className="warning">
        Recuerda: Subir resultados falsos tendrá consecuencias financieras.
      </div>
      <div className="false-claim-effect">
        <span>1er vez = $5</span>
        <span>2da vez = $25</span>
        <span>3era vez = $100 + bloqueo de cuenta</span>
      </div>
      {!currentClaim &&
      moment(props.match.claimFinishAt.toDate()).isAfter(moment()) ? (
        <>
          <div className="time">
            {
              // props.currentMatch.hasClaim
              //     ? claimTimer :
              get(props, "claimTime", "00:00:00")
            }
          </div>
          <div className="time-subtitle">Para subir tu evidencia</div>
          <div className="description">
            Evidencia enviada después de las{" "}
            <span>
              {moment(props.match.finishAt.toDate()).format(
                "DD/MM/YYYY hh:mm A"
              )}{" "}
            </span>
            EDT no será considerada.
          </div>
          <Form
            onSubmit={handleSubmit(sendClaim)}
            autocomplete="off"
            noValidate
          >
            <Upload
              styled={{ width: "60%", minWidth: "245px" }}
              ref={register}
              isImage={true}
              buttonText="Subir evidencia"
              accept="image/*"
              bucket="claims"
              filePath={`matches/${matchId}`}
              fileName={imageNameClaim()}
              setImageUrlToDocument={() => setIsDisable(false)}
              name="imageUrl"
              document={currentClaim}
              icon={false}
              download={false}
            />
            <div className="question">¿Qué sucedio?</div>
            <textarea
              ref={register}
              name="message"
              defaultValue={get(currentClaim, "message", "")}
              placeholder="Cuéntanos lo que pasó..."
            />
            <div className="buttons-container">
              <ButtonBombo
                width="200px"
                loading={isLoadingSendClaim}
                htmlType="submit"
                disabled={isDisable}
              >
                Enviar
              </ButtonBombo>
              <ButtonBombo
                background={darkTheme.basic.danger}
                color={darkTheme.basic.blackDarken}
                border="none"
                width="200px"
                bgColorEvents={`${darkTheme.basic.danger}CC`}
                colorEvents={darkTheme.basic.blackDarken}
                loading={props.loadingSteps}
                onClick={() => {
                  props.updateMatch(4, "grant victory");
                }}
              >
                Conceder victoria
              </ButtonBombo>
            </div>
          </Form>
        </>
      ) : (
        <>
          <div className="time">{claimTimer}</div>
          <div className="description">
            Vamos a intentar revisar su queja lo antes posible, sin embargo, las
            quejas pueden ser revisadas en un plazo 24 horas
          </div>
          <div className="description">
            No podrá jugar ningun encuentro hasta que la disputa se resuelva
          </div>
          <div className="buttons-container">
            <ButtonBombo disabled={true} width="200px">
              Ya subiste tu evidencia
            </ButtonBombo>
            <ButtonBombo
              background={darkTheme.basic.danger}
              color={darkTheme.basic.blackDarken}
              width="200px"
              bgColorEvents={darkTheme.basic.danger}
              colorEvents={`${darkTheme.basic.blackDarken}CC`}
              loading={props.loadingSteps}
              onClick={() => {
                props.updateMatch(4, "grant victory");
              }}
            >
              Conceder victoria
            </ButtonBombo>
          </div>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  color: #${(props) => props.theme.basic.white};
  text-align: center;

  .title {
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.basic.danger};
    margin-top: 1rem;
    margin-bottom: 1.5rem;
  }

  .description {
    font-size: 12px;
    line-height: 15px;
    font-weight: normal;
    margin-bottom: 1rem;

    span {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  .warning {
    color: ${(props) => props.theme.basic.action};
    font-size: 12px;
    line-height: 15px;
    font-weight: normal;
  }

  .false-claim-effect {
    display: flex;
    flex-direction: column;
    color: ${(props) => props.theme.basic.action};
    font-size: 14px;

    span {
      color: ${(props) => props.theme.basic.white};
    }
  }

  .time {
    color: ${(props) => props.theme.basic.primary};
    font-size: 35px;
    font-weight: bold;
  }

  .time-subtitle {
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    margin-bottom: 0.5rem;
  }

  .question {
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
  }

  .buttons-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-top: 1rem;
  }
`;

const Form = styled.form`
  text-align: left;
  width: 95%;

  textarea {
    width: 100%;
    background: ${(props) => props.theme.basic.blackDarken};
    border: none;
    padding: 10px;
    border-radius: 5px;
    height: 100px;
    resize: none;
  }
`;
