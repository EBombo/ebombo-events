import React, { useEffect, useGlobal, useState } from "reactn";
import get from "lodash/get";
import { Icon } from "../../../../../../../components/common/Icons";
import { ButtonBombo, Input, Upload } from "../../../../../../../components";
import { EditTeamInfo } from "./EditTeamInfo";
import { config, firestore } from "../../../../../../../firebase";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../../../utils/useFetch/useFetch";
import styled from "styled-components";
import moment from "moment";
import { Image } from "../../../../../../../components/common/Image";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import isEmpty from "lodash/isEmpty";
import { mediaQuery } from "../../../../../../../styles/constants";
import { ModalContainer } from "../../../../../../../components/common/ModalContainer";
import { Anchor } from "../../../../../../../components/common/Anchor";
import { InscriptionContainer } from "./InscriptionIndividual";
import sizes from "../../../../../../../styles/constants/sizes";

export const InscriptionTeam = (props) => {
  const [authUser] = useGlobal("user");
  const [currentCurrency] = useGlobal("currentCurrency");
  const [, setIsVisibleModalUserAccount] = useGlobal(
    "isVisibleModalUserAccount"
  );

  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [teamImageUrl, setTeamImageUrl] = useState(null);
  const [newTournamentTeamId, setNewTournamentTeamId] = useState(null);
  const [isVisibleModalImage, setIsVisibleModalImage] = useState(null);
  const [isVisibleModalAddInfo, setIsVisibleModalAddInfo] = useState(false);

  const schema = object().shape({
    teamName: string().required(),
  });

  const { errors, handleSubmit, register } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    if (
      !props.tournamentTeam &&
      moment().isBefore(props.tournament.inscriptionDate.toDate())
    ) {
      const newId = firestore.collection("tournamentTeams").doc().id;
      console.log("nuevo ID", newId);
      setNewTournamentTeamId(newId);
    }
  }, [props.tournamentTeam]);

  const sendInvitation = async (userId, body = null) => {
    try {
      setLoadingAction(true);

      await ownFetch(
        `${config.serverUrl}/tournament-teams/${get(
          props,
          "tournamentTeam.id"
        )}/users/${userId}/sent-invitation`,
        "PUT",
        body
      );
    } catch (error) {
      handleError({ ...error, action: "sendInvitation" });
    }
    setLoadingAction(false);
  };

  const rejectInvitation = async (userId) => {
    try {
      setLoadingAction(true);
      await ownFetch(
        `${config.serverUrl}/tournament-teams/${get(
          props,
          "tournamentTeam.id"
        )}/users/${userId}/reject-invitation`,
        "PUT"
      );
    } catch (error) {
      handleError({ ...error, action: "rejectInvitation" });
    }
    setLoadingAction(false);
  };

  const acceptInvitation = async (user_) => {
    try {
      if (
        !get(
          user_,
          `userAccounts.${get(props.requiredUserAccount, "id", null)}`,
          null
        )
      )
        return setIsVisibleModalUserAccount(true);

      await ownFetch(
        `${config.serverUrl}/tournament-teams/${get(
          props.tournamentTeam,
          "id"
        )}/users/${user_.id}/accept-invitation`,
        "PUT"
      );
    } catch (error) {
      handleError({ ...error, action: "acceptInvitation" });
    }
  };

  const teamInscription = async (data) => {
    await props.userInscription({
      id: newTournamentTeamId,
      name: data.teamName,
      teamImageUrlThumb: teamImageUrl,
    });
  };

  const modalAddInfo = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleModalAddInfo}
      onCancel={() => setIsVisibleModalAddInfo(!isVisibleModalAddInfo)}
    >
      <ModalAddInfo>
        <div className="subtitle">Ningún:</div>
        <div className="description">
          El equipo no esta asociado con cualquier jugador.
        </div>
        <div className="subtitle">No registrado:</div>
        <div className="description">
          El tipo de jugador no esta registrado en la plataforma. Puede
          introducir cualquier nombre.
        </div>
        <div className="subtitle">Registrado:</div>
        <div className="description">
          Este tipo de jugador aparece en la página web. Cada usuario registrado
          en la página web tien un ID de Ebombo.
        </div>
      </ModalAddInfo>
    </ModalContainer>
  );

  const modalEditPicture = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleModalImage}
      onCancel={() => setIsVisibleModalImage(!isVisibleModalImage)}
    >
      <Upload
        styled={{ width: "200px" }}
        isImage={true}
        accept="image/*"
        bucket="tournamentTeams"
        filePath={`tournamentTeams/${newTournamentTeamId}`}
        fileName="teamImageUrl"
        name="teamImageUrl"
        buttonText="Subir Escudo del Equipo"
        document={{ id: newTournamentTeamId }}
        afterUpload={(teamImage_) =>
          setTeamImageUrl(teamImage_["teamImageUrlThumb"])
        }
        sizeResized="300x300"
      />
    </ModalContainer>
  );

  return (
    <Container>
      {isVisibleModalAddInfo && modalAddInfo()}
      {isVisibleModalImage && modalEditPicture()}
      {(!props.tournamentTeam ||
        (get(props, "tournamentTeam.inscriptionUrl") &&
          !get(props, "tournamentTeam.isPayed"))) &&
        moment().isBefore(props.tournament.inscriptionDate.toDate()) && (
          <div className="inscription-container">
            <div className="logo-container">
              <Image
                src={
                  teamImageUrl
                    ? teamImageUrl
                    : `${config.storageUrl}/resources/teams-default.svg`
                }
                borderRadius={teamImageUrl ? "50%" : "0"}
                height="55px"
                width="55px"
                margin="0"
                size={teamImageUrl ? "cover" : "contain"}
              />
              <span
                className="change-logo"
                onClick={() => setIsVisibleModalImage(true)}
              >
                <img
                  src={`${config.storageUrl}/resources/tournament/pencil.svg`}
                  alt=""
                />
                Cambiar Logo
              </span>
            </div>
            <form onSubmit={handleSubmit(teamInscription)}>
              <Input
                error={errors.teamName}
                ref={register}
                variant="primary"
                marginBottom="0.5rem"
                type="text"
                name="teamName"
                placeholder="Nombre del Equipo"
              />
              <ButtonBombo
                type="primary"
                width="100%"
                margin="0 auto"
                loading={props.loadingInscription}
                disabled={
                  !authUser ||
                  (get(props, "tournamentTeam.inscriptionUrl") &&
                    !get(props, "tournamentTeam.isPayed")) ||
                  !isEmpty(props.tournamentTeam) ||
                  get(props, "tournament.countTournamentTeams", 0) >=
                    props.tournament.playersLimit
                }
                htmlType="submit"
              >
                {get(props, "tournamentTeam.inscriptionUrl") &&
                !get(props, "tournamentTeam.isPayed") ? (
                  "ESPERA DE CONFIRMACION"
                ) : (
                  <>
                    Inscripción (
                    {`${currentCurrency}${get(
                      props,
                      "tournament.entryCost",
                      0
                    )}`}
                    )
                  </>
                )}
              </ButtonBombo>
            </form>
          </div>
        )}
      {props.tournamentTeam &&
        get(props, "tournamentTeam.isPayed") &&
        get(props, "tournamentTeam.playerIdsAcceptInvitation", []).includes(
          get(authUser, "id")
        ) && (
          <>
            <InscriptionContainer>
              <div className="success-inscription">
                Te has inscrito al torneo correctamente
                <Icon type="check-circle" />
              </div>
              <div>
                Por favor únete al grupo de Whatsapp o Discord para
                <br />
                indicaciones o anuncios del torneo.
              </div>
              <Anchor
                underlined
                fontSize={sizes.font.extraLarge}
                type={"primary"}
                textAlign={"left"}
                url={get(props, "tournament.whatsappUrl", "")}
              >
                Grupo de Whatsapp
                <img
                  src={`${config.storageUrl}/resources/wsp-icon.svg`}
                  alt=""
                />
              </Anchor>
            </InscriptionContainer>
            {get(props, "tournamentTeam.players[0].id", "-") ===
              get(authUser, "id") && (
              <EditTeamInfo
                {...props}
                setIsVisibleModalAddInfo={setIsVisibleModalAddInfo}
                sendInvitation={sendInvitation}
                rejectInvitation={rejectInvitation}
                acceptInvitation={acceptInvitation}
              />
            )}
          </>
        )}
      {props.tournamentTeam &&
        get(props, "tournamentTeam.isPayed") &&
        get(props, "tournamentTeam.players[0].id", "-") !==
          get(authUser, "id") &&
        !get(props, "tournamentTeam.playerIdsAcceptInvitation", []).includes(
          get(authUser, "id")
        ) && (
          <AcceptInvitationContainer>
            <div className="captain-container">
              {get(props, "tournamentTeam.players[0].nickname", "")} te ha
              invitado a participar en un torneo.
            </div>
            <EditTeamInfo
              {...props}
              sendInvitation={sendInvitation}
              rejectInvitation={rejectInvitation}
              acceptInvitation={acceptInvitation}
            />
            <div className="btns-container">
              <ButtonBombo
                type="primary"
                width="100%"
                margin="0 0 1rem 0"
                disabled={loadingEvent}
                onClick={async () => {
                  if (!authUser) return;
                  setLoadingEvent(true);
                  await acceptInvitation(authUser);
                  setLoadingEvent(false);
                }}
              >
                Aceptar
              </ButtonBombo>
              <ButtonBombo
                type="secondary"
                width="100%"
                margin="0"
                disabled={loadingEvent}
                onClick={async () => {
                  if (!props.rejectInvitation && !authUser) return;
                  setLoadingEvent(true);
                  await props.rejectInvitation(get(authUser, "id"));
                  setLoadingEvent(false);
                }}
              >
                Rechazar
              </ButtonBombo>
            </div>
          </AcceptInvitationContainer>
        )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;

  .inscription-container {
    padding: 1rem;

    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      max-width: 110px;

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
    }

    form {
      margin: 1rem 0;
    }
  }

  ${mediaQuery.afterTablet} {
    .inscription-container {
      max-width: 350px;
    }
  }
`;

const AcceptInvitationContainer = styled.div`
  .captain-container {
    margin: 0.5rem 0;
    padding: 1rem;
    font-weight: normal;
    font-size: 11px;
    line-height: 14px;
    color: ${(props) => props.theme.basic.whiteDarken};
  }

  .btns-container {
    padding: 1rem;
    max-width: 550px;
  }
`;

const ModalAddInfo = styled.div`
  .subtitle {
    font-size: 9px;
    line-height: 11px;
    color: ${(props) => props.theme.basic.primary};
    margin-bottom: 3px;
  }
  .description {
    font-weight: 500;
    font-size: 11px;
    line-height: 14px;
    color: ${(props) => props.theme.basic.whiteDarken};
    margin-bottom: 0.5rem;
  }
`;
