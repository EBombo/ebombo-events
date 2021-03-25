import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { ButtonBombo } from "../../../../../../../components";
import get from "lodash/get";
import moment from "moment";
import { mediaQuery } from "../../../../../../../styles/constants";
import { useHistory } from "react-router";

export const WaitingChallenged = (props) => {
  const [authUser] = useGlobal("user");
  const history = useHistory();

  const expired = () =>
    moment(props.challenge.createAt.toDate())
      .add(30, "minutes")
      .isBefore(new Date());

  return (
    <Container>
      {get(props, "challenge.challenger.id", "") === get(authUser, "id") &&
      !expired() &&
      !props.challenge.isClosed ? (
        <div>
          <div className={"buttons-container"}>
            {get(props, "challenge.challenged", null) &&
              !get(props, "challenge.challengedReady", null) && (
                <ButtonBombo
                  width="100%"
                  margin="5px auto"
                  onClick={() =>
                    props.deleteChallenge(props.challenge, authUser.id)
                  }
                  loading={props.rejectingChallenge}
                  disabled={
                    props.rejectingChallenge || props.loadingCreateMatch
                  }
                >
                  Cancelar Invitación
                </ButtonBombo>
              )}
          </div>
          <p>
            - Espera a que un rival acepte tu desafío, sé paciente :)
            <br />
            - Cuando acepten tu desafío podrás decidir si deseas jugar o no
            <br />
            - Los desafíos estan visibiles por 30 minutos en la plataforma
            <br />
            <span>
              Cuando tu rival esté listo te enviaremos un correo electrónico y
              un mensaje a tu inbox para notificarte.
            </span>
          </p>
        </div>
      ) : expired() || props.challenge.isClosed ? (
        <div className="buttons-container">
          <ButtonBombo
            width="80%"
            onClick={() =>
              get(props, "challenge.challenger.id", null) ===
              get(authUser, "id")
                ? get(props, "challenge.challenged.id")
                  ? history.push(
                      `/games/${props.challenge.game.id}/consoles/${props.challenge.console.id}/challenges/new/users/${props.challenge.challenged.id}`
                    )
                  : history.push(
                      `/games/${props.challenge.game.id}/consoles/${props.challenge.console.id}/challenges/new`
                    )
                : history.push(
                    `/games/${props.challenge.game.id}/consoles/${props.challenge.console.id}/challenges/new/users/${props.challenge.challenger.id}`
                  )
            }
            loading={props.loadingCreateMatch}
            disabled={props.rejectingChallenge}
          >
            {get(props, "challenge.challenger.id", "") === get(authUser, "id")
              ? "Publicar este desafio otra vez"
              : "Invitar usuario a jugar"}
          </ButtonBombo>
          <br />
          {get(props, "challenge.challenged.id", "") ===
            get(authUser, "id") && (
            <ButtonBombo
              type="secondary"
              width="100%"
              onClick={() =>
                props.deleteChallenge(props.challenge, authUser.id)
              }
              loading={props.rejectingChallenge}
              disabled={props.rejectingChallenge || props.loadingCreateMatch}
            >
              Rechazar
            </ButtonBombo>
          )}
        </div>
      ) : get(props, "challenge.challenged", null) &&
        get(props, "challenge.challenged.id", null) === get(authUser, "id") ? (
        <div className="buttons-container">
          <ButtonBombo
            width="100%"
            margin="5px auto"
            onClick={() =>
              props.updateChallenge(props.challenge, "challengedReady")
            }
            loading={props.loadingCreateMatch}
            disabled={props.loadingCreateMatch || props.rejectingChallenge}
          >
            Aceptar
          </ButtonBombo>
          <ButtonBombo
            type="secondary"
            width="100%"
            onClick={() => props.deleteChallenge(props.challenge, authUser.id)}
            loading={props.rejectingChallenge}
            disabled={props.rejectingChallenge || props.loadingCreateMatch}
          >
            Rechazar
          </ButtonBombo>
        </div>
      ) : (
        <div className="buttons-container">
          <ButtonBombo
            width="100%"
            onClick={() =>
              props.updateChallenge(props.challenge, "challengedReady")
            }
            loading={props.loadingCreateMatch}
            disabled={props.loadingCreateMatch}
          >
            Aceptar
          </ButtonBombo>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  p {
    font-style: normal;
    font-weight: normal;
    font-size: 11px;
    line-height: 14px;
    color: #c4c4c4;
    padding: 1rem;

    ${mediaQuery.afterTablet} {
      padding: 0 1rem;
    }

    span {
      color: ${(props) => props.theme.basic.action};
    }
  }

  .buttons-container {
    padding: 1rem;
    ${mediaQuery.afterTablet} {
      padding-left: 20%;
    }
  }
`;
