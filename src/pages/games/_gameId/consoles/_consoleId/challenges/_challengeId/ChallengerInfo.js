import React, {useGlobal} from "reactn";
import styled from "styled-components";
import {Levels} from "../../../../../../../components";
import {useHistory, useParams} from "react-router";
import get from "lodash/get";
import {mediaQuery} from "../../../../../../../styles/constants";
import {config} from "../../../../../../../firebase";
import {Image} from "../../../../../../../components/common/Image";
import {Icon} from "../../../../../../../components/common/Icons";
import moment from "moment";
import {Anchor} from "../../../../../../../components/common/Anchor";

export const ChallengerContainer = (props) => {
  const history = useHistory();
  const { gameId, consoleId } = useParams();
  const [authUser] = useGlobal("user");

  const expired = () =>
    moment(props.challenge.createAt.toDate())
      .add(30, "minutes")
      .isBefore(new Date());

  return (
    <Container>
      <div className="challenger-info">
        <h3>
          {expired()
            ? "Desafío Expirado"
            : get(props, "challenge.challenger.id", "") ===
                get(authUser, "id") && get(props, "challenge.challenged", null)
            ? "Invitación Enviada"
            : get(props, "challenge.challenger.id", "") === get(authUser, "id")
            ? "Mi Desafío Abierto"
            : get(props, "challenge.challenged.id", "") === get(authUser, "id")
            ? "Invitación Recibida"
            : "Desafío Abierto"}
        </h3>
        <h4>
          {expired()
            ? "Este desafio ha sido cancelado por ebombo"
            : get(props, "challenge.challenger.id", "") ===
                get(authUser, "id") && get(props, "challenge.challenged", null)
            ? `Has invitado ha jugar a ${get(
                props,
                "challenge.challenged.nickname",
                ""
              )}`
            : get(props, "challenge.challenger.id", "") === get(authUser, "id")
            ? "Has publicado un desafío"
            : get(props, "challenge.challenged.id", null) ===
              get(authUser, "id")
            ? `${get(
                props,
                "challenge.challenger.nickname",
                ""
              )} te ha invitado a jugar`
            : `${get(
                props,
                "challenge.challenger.nickname"
              )} publico un desafío`}
        </h4>
        <div className="challenger-challenge-info">
          <div className="info">
            <Image
              src={
                props.challenge.challenger.profileImageUrlThumb
                  ? props.challenge.challenger.profileImageUrlThumb
                  : `${config.storageUrl}/resources/perfil-icon.svg`
              }
              height="73px"
              width="70px"
              margin="0"
              borderRadius="5px"
              size="cover"
            />
            <div className="challenger-game-info">
              <div className="description">
                <h3>
                  {get(
                    props.findRequiredUserAccount(gameId, consoleId),
                    "description"
                  )}
                  :
                </h3>
                <p
                  className="see-profile"
                  onClick={() =>
                    history.push(
                      `/users/${get(props, "challenge.challenger.id", "")}`
                    )
                  }
                >
                  <Anchor type="primary" underlined>
                    Ver Perfil <Icon type="right" />
                  </Anchor>
                </p>
              </div>
              <h4>
                {get(
                  props.findRequiredUserAccount(gameId, consoleId),
                  "description"
                ).includes("SUPER CELL") ? (
                  <a
                    href={get(
                      props,
                      `challenge.challenger.userAccounts[${get(
                        props.findRequiredUserAccount(gameId, consoleId),
                        "id"
                      )}]`,
                      "-"
                    )}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "underline" }}
                  >
                    Link
                  </a>
                ) : (
                  get(
                    props,
                    `challenge.challenger.userAccounts[${get(
                      props.findRequiredUserAccount(gameId, consoleId),
                      "id"
                    )}]`,
                    "-"
                  )
                )}
              </h4>
              <Levels
                gamesStatistics={get(
                  props,
                  "challenge.challenger.gamesStatistics",
                  []
                )}
                gameId={get(props, "challenge.game.id", "")}
                key={get(props, "challenge.game.id", "")}
                style={{ textAlign: "left" }}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid #404040;

  ${mediaQuery.afterTablet} {
    padding: 0 0 0 2rem;
    border-bottom: none;
  }

  h3 {
    color: ${(props) => props.theme.basic.action};
  }

  h4 {
    color: ${(props) => props.theme.basic.white};
  }

  .challenger-challenge-info {
    display: flex;
    justify-content: space-between;
    margin-top: 0.5rem;

    .info {
      display: grid;
      width: 100%;
      grid-template-columns: 75px auto;
      min-width: 200px;
      align-items: center;

      img {
        border-radius: 5px;
        width: 80px;
        height: 80px;
      }

      .challenger-game-info {
        .description {
          ${mediaQuery.afterTablet} {
            display: flex;
            justify-content: space-between;
          }

          h3 {
            font-weight: bold;
            font-size: 14px;
            line-height: 18px;
            color: ${(props) => props.theme.basic.primary};
          }
          .see-profile {
            cursor: pointer;
            color: ${(props) => props.theme.basic.primary};
            font-size: 0.7rem;
            margin: 0;
          }
        }

        h4 {
          font-weight: normal;
          font-size: 14px;
          line-height: 18px;
          color: ${(props) => props.theme.basic.white};
        }
      }
    }
  }
`;
