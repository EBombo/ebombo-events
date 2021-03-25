import React, { useGlobal } from "reactn";
import get from "lodash/get";
import { ButtonBombo } from "../../../../../components";
import styled from "styled-components";
import { mediaQuery } from "../../../../../styles/constants";
import { Desktop, Tablet } from "../../../../../utils";
import { showMoney } from "../../../../../utils/showMoney";
import { Icon } from "../../../../../components/common/Icons";

export const WaitingCompleteTeams = (props) => {
  const [authUser] = useGlobal("user");

  return (
    <Container>
      <div className="description">
        Para empezar a jugar, cada capitán debe invitar a su equipo y completar
        el ticket de entrada Una vez el equipo este completo empezara la partida
        <Desktop>
          <br />
          Si en{" "}
          <span className="green">
            {get(props, "matchTime", "00:00:00")}
          </span>{" "}
          no se ha ingresado los resultados del encuentro, ebombo le dara el
          triunfo al usuario que los ingresó
        </Desktop>
      </div>

      {props.match.playersIds.includes(authUser.id) &&
      !props.match.challengerAcceptInvitation
        .concat(props.match.challengedAcceptInvitation)
        .includes(authUser.id) ? (
        <div>
          <ButtonBombo
            margin="0.5rem auto"
            width="100%"
            onClick={() => {
              if (
                get(props, "match.realMoney", true) &&
                showMoney(authUser) < get(props, "match.gameEntryCost", 0)
              )
                return props.showNotification(
                  "Dinero insufiente",
                  "Para retar a un jugador debes recargar"
                );

              if (
                !get(props, "match.realMoney", true) &&
                get(authUser, "match.ebCoins", 0) <
                  get(props, "match.gameEntryCost", 0)
              )
                return props.showNotification(
                  "Dinero jugable insufiente.",
                  "Para aceptar el reto debes conseguri mas dinero jugable."
                );

              props.updateMatch(0);
            }}
            disabled={props.loadingSteps}
          >
            Aceptar
          </ButtonBombo>
          <ButtonBombo
            type="secondary"
            width="100%"
            onClick={() => props.rejectInvitation(authUser.id)}
            disabled={props.loadingSteps}
          >
            Rechazar
          </ButtonBombo>
        </div>
      ) : (
        <div>
          <ButtonBombo
            margin="0.5rem auto"
            width="100%"
            onClick={() => props.updateMatch(0)}
            disabled={true}
          >
            Mi equipo esta listo
            <Icon type="arrow-right" />
          </ButtonBombo>
          <ButtonBombo
            width="100%"
            onClick={() => props.setIsVisibleModalProblem(true)}
          >
            ¿Tienes un problema?
          </ButtonBombo>
        </div>
      )}
      <Tablet>
        <div className="description">
          Si en{" "}
          <span className="green">{get(props, "matchTime", "00:00:00")}</span>{" "}
          no se ha ingresado los resultados del encuentro, ebombo le dara el
          triunfo al usuario que los ingresó
        </div>
      </Tablet>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 1rem;

  .description {
    color: ${(props) => props.theme.basic.white};
    font-size: 12px;
    line-height: 18px;
    margin: 0.5rem 0;

    .green {
      color: ${(props) => props.theme.basic.primary};
    }
  }

  ${mediaQuery.afterTablet} {
    width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 2rem;
    padding: 0 2rem;
  }
`;
