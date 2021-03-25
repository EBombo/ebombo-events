import React, { useEffect, useGlobal, useRef, useState } from "reactn";
import styled from "styled-components";
import { ButtonBombo } from "../../../../../components";
import get from "lodash/get";
import { Icon } from "../../../../../components/common/Icons";
import moment from "moment";
import { useHistory } from "react-router";
import { config } from "../../../../../firebase";
import { mediaQuery } from "../../../../../styles/constants";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../utils/useFetch/useFetch";

const interval = 1000;

export const WaitingChallenger = (props) => {
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const [loadingUpdateMatch, setLoadingUpdateMatch] = useState(false);

  const [matchTime, setMatchTime] = useState("00:00");
  const [endChallenge, setEndChallenge] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  let currentInterval = useRef(null);

  useEffect(() => {
    if (props.match.acceptedAt) {
      if (
        moment(props.match.acceptedAt.toDate())
          .add(10, "minutes")
          .isBefore(new Date())
      ) {
        props.userCancelMatch("directCancel");
        history.push("/");
      }

      currentInterval.current && clearInterval(currentInterval.current);
      currentInterval.current = createInterval();
      return;
    }
    currentInterval.current && clearInterval(currentInterval.current);
  }, [props.match, endChallenge]);

  const createInterval = () =>
    setInterval(() => {
      const still = moment(props.match.acceptedAt.toDate()).add(10, "minutes");
      const time = moment(still).diff(moment());

      const newTime = moment.duration(time);
      const minutes =
        newTime.minutes() > 10 ? newTime.minutes() : `0${newTime.minutes()}`;
      const seconds =
        newTime.seconds() > 10 ? newTime.seconds() : `0${newTime.seconds()}`;

      if (minutes === 0 && seconds < 0) setEndChallenge(true);

      setMatchTime(minutes + ":" + seconds);
    }, interval);

  const updateMatch = async (match) => {
    setLoadingUpdateMatch(true);
    try {
      await ownFetch(
        `${config.serverUrlMatches}/matches/${match.id}/challenger-ready`,
        "PUT"
      );
    } catch (error) {
      handleError({ ...error, action: "updateMatch" });
    }
    setLoadingUpdateMatch(false);
  };

  return (
    <Container>
      {get(props, `match.challenger[0].id`) === get(authUser, "id") ? (
        <div className="challenger-content">
          <div>
            <p>Un rival ha aceptado el desafío</p>
            <p>
              Si no confirmas en{" "}
              <span className="time-remaining" key={matchTime}>
                {matchTime}
              </span>{" "}
              el desafío se cerrará automáticamente
            </p>
          </div>
          <div className="buttons-container">
            <ButtonBombo
              margin="1rem 0 !important"
              width="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              onClick={() => updateMatch(props.match)}
              loading={loadingUpdateMatch}
              disbled={loadingUpdateMatch}
            >
              Estoy Listo
              <Icon type="arrow-right" />
            </ButtonBombo>
            <ButtonBombo
              margin="1rem 0 !important"
              width="100%"
              type="secondary"
              onClick={() => props.userCancelMatch("directCancel")}
              loading={props.loadingCancelMatch}
              disbled={props.loadingCancelMatch}
            >
              Rechazar
            </ButtonBombo>
          </div>
        </div>
      ) : (
        <div className="challenged-content">
          <span>
            Desafio aceptado <Icon type="check-circle" />
          </span>
          <p>
            Has aceptado el desafío de{" "}
            {get(props, "match.challenger[0].nickname", "")}
          </p>
          <p>
            Si {get(props, "match.challenger[0].nickname", "")} no confirma en{" "}
            <span className="time-remaining" key={matchTime}>
              {matchTime}
            </span>{" "}
            minutos la sala se cerrará automáticamente
          </p>
          <p className="action">
            Cuando tu rival esté listo te enviaremos un correo electrónico y un
            mensaje a tu inbox para notificarte.
          </p>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  padding: 0 1rem;

  ${mediaQuery.afterTablet} {
    padding: 0 2rem;
  }

  .challenger-content {
    ${mediaQuery.afterTablet} {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 15%;
      align-items: center;
    }

    div:first-child {
      p {
        font-style: normal;
        font-weight: normal;
        font-size: 11px;
        line-height: 14px;
        color: #c4c4c4;

        .time-remaining {
          color: ${(props) => props.theme.basic.action};
        }
      }
    }
  }

  .challenged-content {
    span {
      color: ${(props) => props.theme.basic.primary};
    }

    p {
      font-weight: 500;
      font-size: 12px;
      line-height: 15px;
      color: #c4c4c4;

      .time-remaining {
        color: ${(props) => props.theme.basic.action};
      }
    }

    .action {
      color: ${(props) => props.theme.basic.action};
    }
  }
`;
