import React, { useEffect, useGlobal, useState } from "reactn";
import { ButtonBombo, Input, Upload } from "../../../../../../../components";
import { config } from "../../../../../../../firebase";
import get from "lodash/get";
import { Icon } from "../../../../../../../components/common/Icons";
import { Image } from "../../../../../../../components/common/Image";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../../../utils/useFetch/useFetch";
import { ModalContainer } from "../../../../../../../components/common/ModalContainer";
import { mediaQuery } from "../../../../../../../styles/constants";
import { SearchUser } from "../../../../../../../components/common/SearchUser";
import { AddNonRegisterPlayer } from "./AddNonRegisterPlayer";
import styled from "styled-components";
import { ListPlayersToRegister } from "./ListPlayersToRegister";
import sizes from "../../../../../../../styles/constants/sizes";

export const EditTeamInfo = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleModalImage, setIsVisibleModalImage] = useState(null);
  const [editTeam, setEditTeam] = useState(false);
  const [tab, setTab] = useState("none");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    setUsers(get(props, "tournamentTeam.players", []));
  }, [props.tournamentTeam.players]);

  const saveTeamImage = async (teamImageUrls) => {
    try {
      await ownFetch(
        `${config.serverUrl}/tournament-teams/${props.tournamentTeam.id}/image`,
        "PUT",
        { teamImageUrls }
      );
    } catch (error) {
      handleError({ ...error, action: "saveTeamImage" });
    }
  };

  const saveName = async (name) => {
    try {
      await ownFetch(
        `${config.serverUrl}/tournament-teams/${props.tournamentTeam.id}/name`,
        "PUT",
        {
          name,
        }
      );
    } catch (error) {
      handleError({ ...error, action: "saveName" });
    }
  };

  const saveNewTeam = async () => {
    setLoading(true);

    const usersIds = users.map((user) => user.id);
    const playersIds = props.tournamentTeam.players.map((user) => user.id);

    const usersRemoved = props.tournamentTeam.players.filter(
      (user) => !usersIds.includes(user.id)
    );

    let usersAdd = usersIds.filter((userId) => !playersIds.includes(userId));

    const promiseUsersRemoved = usersRemoved.map(
      async (user) => await props.rejectInvitation(user.id)
    );
    await Promise.all(promiseUsersRemoved);

    usersAdd = users.filter((user) => usersAdd.includes(user.id));

    const promiseUsersAdd = usersAdd.map(
      async (user) => await props.sendInvitation(user.id, { user })
    );

    await Promise.all(promiseUsersAdd);

    const newName = document.getElementById("team-name").value;

    if (props.tournamentTeam.name !== newName) await saveName(newName);

    setLoading(false);
    setEditTeam(false);
  };

  const addNoRegisterMember = (data) => {
    if (users.some((user_) => user_.id === data.memberName.split(" ").join("")))
      return props.showNotification("ERROR", "El usuario ya esta registrado");

    if (users.length >= props.tournament.rule.totalPlayers)
      return props.showNotification(
        "ERROR",
        "Se ha completado la cantidad de usuarios"
      );

    setUsers(
      users.concat([
        { id: data.memberName.split(" ").join(""), nickname: data.memberName },
      ])
    );
  };

  const modalEditPicture = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleModalImage}
      onCancel={() => setIsVisibleModalImage(!isVisibleModalImage)}
    >
      <Upload
        styled={{ width: "200px" }}
        isImage={true}
        listType="picture-card"
        accept="image/*"
        bucket="tournamentTeams"
        filePath={`tournamentTeams/${props.tournamentTeam.id}`}
        fileName="teamImageUrl"
        name="teamImageUrl"
        buttonText="Subir Escudo del Equipo"
        document={props.tournamentTeam}
        afterUpload={(teamImageUrls) => saveTeamImage(teamImageUrls)}
        sizeResized="300x300"
      />
    </ModalContainer>
  );

  return (
    <TeamInfoContainer>
      {isVisibleModalImage && modalEditPicture()}
      <div className="logo-container">
        <Image
          size={props.tournamentTeam.teamImageUrlThumb ? "cover" : "contain"}
          src={
            props.tournamentTeam.teamImageUrlThumb
              ? props.tournamentTeam.teamImageUrlThumb
              : `${config.storageUrl}/resources/teams-default.svg`
          }
          borderRadius={props.tournamentTeam.teamImageUrlThumb ? "50%" : "0"}
          height="55px"
          width="55px"
          margin="0"
        />
        {get(props, "tournamentTeam.players[0].id", "-") ===
          get(authUser, "id") && (
          <span
            className={`change-logo ${editTeam ? "" : "disabled"}`}
            onClick={() => editTeam && setIsVisibleModalImage(true)}
          >
            <img
              src={`${config.storageUrl}/resources/tournament/pencil.svg`}
              alt=""
            />
            Cambiar Logo
          </span>
        )}
      </div>
      <div className="team-name">
        <Input
          variant="primary"
          type="text"
          name="teamName"
          maxWidth="200px"
          defaultValue={get(props, "tournamentTeam.name", "")}
          disabled={
            get(props, "tournamentTeam.players[0].id", "-") !==
              get(authUser, "id") || !editTeam
          }
          placeholder="Nombre del Equipo"
          id="team-name"
        />
      </div>

      <div className="members-container">
        <div className="subtitle">Miembros de tu equipo</div>
        {get(props, "tournamentTeam.players[0].id", "-") ===
          get(authUser, "id") && (
          <div className="add-members">
            <span className="info">
              <Icon
                type="info-circle"
                onClick={() => props.setIsVisibleModalAddInfo(true)}
              />
              Agregar:
            </span>
            <div className={`tabs-edit ${editTeam ? "" : "tabs-disabled"}`}>
              <div
                className={`tab ${
                  editTeam ? (tab === "none" ? "active" : "") : "disabled"
                }`}
                onClick={() => setTab("none")}
              >
                Ningúno
              </div>
              <div
                className={`tab ${
                  editTeam
                    ? tab === "no-register"
                      ? "middle active"
                      : "middle"
                    : "middle-disabled disabled"
                }`}
                onClick={() => setTab("no-register")}
              >
                No registrado
              </div>
              <div
                className={`tab ${
                  editTeam ? (tab === "register" ? "active" : "") : "disabled"
                }`}
                onClick={() => setTab("register")}
              >
                Registrado
              </div>
            </div>
          </div>
        )}
        {editTeam && tab === "no-register" && (
          <AddNonRegisterPlayer addNoRegisterMember={addNoRegisterMember} />
        )}
        {editTeam && tab === "register" && (
          <div className="register">
            <SearchUser
              type="primary"
              completeUser
              sendInvitation={(user) => {
                if (users.some((user_) => user_.id === user.id))
                  return props.showNotification(
                    "ERROR",
                    "El usuario ya esta registrado"
                  );

                if (users.length >= props.tournament.rule.totalPlayers)
                  return props.showNotification(
                    "ERROR",
                    "Se ha completado la cantidad de usuarios"
                  );

                setUsers(users.concat([user]));
              }}
            />
          </div>
        )}
        <div className="members">
          <div className="members-content">
            <ListPlayersToRegister
              editTeam={editTeam}
              users={users}
              setUsers={setUsers}
              tournamentTeam={props.tournamentTeam}
            />
            {!editTeam &&
              get(props, "tournamentTeam.players[0].id", "-") ===
                get(authUser, "id") && (
                <ButtonBombo
                  type="primary"
                  width="100%"
                  margin="1rem 0"
                  disabled={editTeam}
                  onClick={() => setEditTeam(true)}
                  className="button"
                >
                  Editar
                </ButtonBombo>
              )}
            {editTeam &&
              get(props, "tournamentTeam.players[0].id", "-") ===
                get(authUser, "id") && (
                <>
                  <ButtonBombo
                    type="primary"
                    width="100%"
                    margin="1rem 0"
                    disabled={!editTeam || loading}
                    loading={loading}
                    onClick={saveNewTeam}
                    className="button"
                  >
                    Guardar Equipo
                  </ButtonBombo>
                  <ButtonBombo
                    type="secondary"
                    width="100%"
                    margin="0"
                    disabled={loading}
                    loading={loading}
                    onClick={() => {
                      setUsers(get(props, "tournamentTeam.players", []));
                      setEditTeam(false);
                    }}
                    className="button"
                  >
                    Cancelar
                  </ButtonBombo>
                </>
              )}
            <div className="legend">
              <div className="title">Leyenda:</div>
              <div className="description">
                <img
                  src={`${config.storageUrl}/resources/circle-check.svg`}
                  alt=""
                />
                inscripcción confirmada
              </div>
              <div className="description">
                <img
                  src={`${config.storageUrl}/resources/circle-empty.svg`}
                  alt=""
                />
                en espera de la confirmación del jugador invitado
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeamInfoContainer>
  );
};

const TeamInfoContainer = styled.section`
  width: 100%;

  .logo-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 110px;
    margin-left: 1rem;
    margin-bottom: 0.5rem;

    .change-logo {
      margin-top: 0.5rem;
      font-weight: 500;
      font-size: 10px;
      line-height: 12px;
      color: ${(props) => props.theme.basic.primary};
      border: 1px solid ${(props) => props.theme.basic.primary};
      border-radius: 3px;
      padding: 0 0.5rem;
      cursor: pointer;

      img {
        margin-right: 5px;
      }
    }

    .disabled {
      color: ${(props) => props.theme.basic.grayLighten};
      border: 1px solid ${(props) => props.theme.basic.grayLighten};
    }
  }

  .team-name {
    padding: 0 1rem;
    max-width: 550px;
  }

  .members-container {
    .subtitle {
      padding: 0 1rem;
      font-style: normal;
      font-weight: 600;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.white};
      margin-bottom: 0.5rem;
    }

    .info {
      padding: 0 1rem;
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: 300;
      font-size: 10px;
      line-height: 12px;
      color: ${(props) => props.theme.basic.white};
      margin-bottom: 5px;
    }

    svg {
      color: ${(props) => props.theme.basic.primary};
      margin-right: 5px;
    }

    .tabs-edit {
      margin: 0 1rem 1rem;
      border: 1px solid ${(props) => props.theme.basic.primary};
      display: inline-flex;
      border-radius: 4px;

      .tab {
        padding: 0.5rem;
        font-weight: 500;
        font-size: 10px;
        line-height: 12px;
        color: ${(props) => props.theme.basic.primary};
        background: transparent;
        cursor: pointer;
      }

      .middle {
        border-left: 1px solid ${(props) => props.theme.basic.primary};
        border-right: 1px solid ${(props) => props.theme.basic.primary};
      }

      .middle-disabled {
        border-left: 1px solid ${(props) => props.theme.basic.grayLighten};
        border-right: 1px solid ${(props) => props.theme.basic.grayLighten};
      }

      .disabled {
        color: ${(props) => props.theme.basic.grayLighten};
      }

      .active {
        color: ${(props) => props.theme.basic.blackDarken};
        background: ${(props) => props.theme.basic.primary};
      }
    }

    .tabs-disabled {
      border: 1px solid ${(props) => props.theme.basic.grayLighten};
    }

    .no-register-form {
      padding: 1rem;
      max-width: 550px;

      .button-container {
        display: flex;
        justify-content: flex-end;
      }
    }

    .register {
      max-width: 550px;
    }
  }

  .members {
    position: relative;
    padding: 1rem;
    border-top: 2px solid ${(props) => props.theme.basic.grayDark};

    .members-content {
      ${mediaQuery.afterTablet} {
        max-width: 250px;
      }

      .member {
        max-width: 550px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;

        .member-info {
          display: flex;
          align-items: center;

          .nickname {
            margin-left: 5px;
            font-weight: 500;
            font-size: 11px;
            line-height: 14px;
            color: ${(props) => props.theme.basic.white};
          }
        }

        .member-status {
          .captain {
            color: ${(props) => props.theme.basic.blackDarken};
            font-weight: bold;
            background: ${(props) => props.theme.basic.primary};
            border-radius: 50px;
            padding: 1px 5px;
            font-size: ${sizes.font.normal};
          }

          .remove {
            margin-left: 10px;
          }
        }
      }

      .legend {
        margin: 1rem 0;
        .title {
          font-style: normal;
          font-weight: 500;
          font-size: ${sizes.font.normal};
          line-height: 14px;
          color: ${(props) => props.theme.basic.white};
        }
        .description {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          font-weight: 500;
          font-size: ${sizes.font.normal};
          line-height: 14px;
          color: ${(props) => props.theme.basic.grayDark};
          margin-top: 0.5rem;
          img {
            margin-right: 5px;
          }
        }
      }

      ${mediaQuery.afterTablet} {
        .ant-btn {
          max-width: 250px;
        }
      }
    }
  }
`;
