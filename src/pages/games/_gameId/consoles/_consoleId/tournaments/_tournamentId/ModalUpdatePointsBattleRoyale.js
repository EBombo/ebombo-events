import React from "reactn";
import styled from "styled-components";
import { UserImageProfile } from "../../../../../../../components/users/UserImageProfile";
import get from "lodash/get";
import { ButtonBombo, Input } from "../../../../../../../components";
import { config } from "../../../../../../../firebase";

export const ModalUpdatePointsBattleRoyale = (props) => {
  return (
    <ModalUpdatePointsCss>
      <div className="title">Ingresa los resultados</div>
      <div className="body">
        <div className="users">
          <div className="sub-title">Equipo</div>
          {props.currentTeam.players.map((user, index) => (
            <div key={`key-list-user-modal-points-${index}`} className="user">
              <UserImageProfile
                url={get(
                  user,
                  "profileImageUrlThumb",
                  `${config.storageUrl}/resources/perfil-icon.svg`
                )}
              />
              <div className="user no-wrap">{get(user, "nickname", "")}</div>
            </div>
          ))}
        </div>
        <div className="inputs">
          <div className="sub-title">Puesto</div>
          <Input
            type="number"
            min={0}
            defaultValue={get(
              props,
              `currentTeam.score[${props.indexMatch}].position`,
              0
            )}
            onChange={(event) =>
              props.setCurrentScore({
                ...props.currentScore,
                position: +event.target.value,
              })
            }
          />
        </div>
        <div className="inputs">
          <div className="sub-title">Kills</div>
          {props.currentTeam.players.map((user) => (
            <Input
              type="number"
              min={0}
              key={`key-input-score-${user.id}`}
              defaultValue={get(
                props.currentTeam,
                `score[${props.indexMatch}][${user.id}]`,
                0
              )}
              onChange={(event) =>
                props.setCurrentScore({
                  ...props.currentScore,
                  [user.id]: +event.target.value,
                })
              }
            />
          ))}
        </div>
      </div>
      <div className="footer">
        <ButtonBombo
          width="250px"
          onClick={() => props.saveScore()}
          loading={props.loadingScore}
        >
          Ingresar resultados
        </ButtonBombo>
        <ButtonBombo
          disabled={props.loadingScore}
          danger
          width="250px"
          onClick={() => props.setIsVisibleModalPoints(false)}
        >
          Cancelar
        </ButtonBombo>
        <div className="label">
          Una vez subidos los resultados no hay vuelta atras
        </div>
      </div>
    </ModalUpdatePointsCss>
  );
};

const ModalUpdatePointsCss = styled.div`
  color: ${(props) => props.theme.basic.white};
  max-width: 300px;
  margin: auto;

  .title {
    font-size: 1rem;
    margin-bottom: 10px;
  }

  .body {
    font-size: 0.7rem;
    display: grid;
    grid-template-columns: auto auto auto;

    * {
      margin: auto;
    }

    .users {
      .user {
        margin-bottom: 25px;
      }

      * {
        display: flex;
        margin: 0 5px;
      }
    }

    .inputs {
      input {
        width: 50px;
        background: ${(props) => props.theme.basic.blackDarken};
        color: ${(props) => props.theme.basic.primary};
        border: none;
      }
    }

    .users,
    .inputs {
      .sub-title {
        text-align: center;
        margin-bottom: 10px;
      }
    }
  }

  .footer {
    button {
      margin: 5px auto;
    }

    .label {
      text-align: center;
    }
  }
`;
