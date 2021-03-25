import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ButtonBombo, Input, Upload } from "../../../components";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { mediaQuery } from "../../../styles/constants";
import { Desktop, Tablet } from "../../../utils";
import { config, firestore } from "../../../firebase";
import { useParams } from "react-router-dom";
import UrlAssembler from "url-assembler";
import { useHistory } from "react-router";
import { useOwnFetch } from "../../../utils/useFetch/useFetch";
import { useSendError } from "../../../components/error-fallback/useSendError";
import moment from "moment";

export const CompleteInscription = (props) => {
  const schema = object().shape({
    name: string().required(),
    lastName: string().required(),
    idGame: string().required(),
  });

  const { tournamentId } = useParams();
  const history = useHistory();

  const [authUser] = useGlobal("user");
  const [, setIsVisibleLoginModal] = useGlobal("isVisibleLoginModal");
  const [loadingInscription, setLoadingInscription] = useState(false);
  const [formId] = useState(firestore.collection("tournamentTeams").doc().id);
  const [inscriptionUrl, setInscriptionUrl] = useState(null);

  const { sendError } = useSendError();
  const { ownFetch } = useOwnFetch();

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const userInscription = async (data) => {
    try {
      if (!props.validatePassword()) return;

      if (!authUser) return setIsVisibleLoginModal(true);

      if (
        !inscriptionUrl &&
        get(props, "tournament.linkType", "") === "payment"
      )
        return props.showNotification(
          "ERROR PAGO",
          "Debes subir la comprobante de tu pago"
        );

      if (
        get(props, "tournament.linkType", "") !== "payment" &&
        get(authUser, "money", 0) < get(props, "tournament.entryCost", null)
      )
        return props.showNotification(
          "DINERO INSUFIENTE",
          "Para poder inscribirte al torneo debes recargar."
        );

      setLoadingInscription(true);

      const account = props.findRequiredUserAccount(
        props.tournament.game.id,
        props.tournament.console.id
      );

      await ownFetch(urlApiInscription(), "PUT", {
        ...data,
        inscriptionUrl,
        accountId: account.id,
      });

      history.push(
        `/games/${props.tournament.game.id}/consoles/${props.tournament.console.id}/tournaments/${tournamentId}`
      );
    } catch (error) {
      console.log(error);
      props.showNotification(
        "ERROR",
        get(error, "statusText", "Algo salio mal,intentalo nuevamente")
      );
      await sendError({ ...error, action: "userInscription" });
    }
    setLoadingInscription(false);
  };

  const urlApiInscription = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/tournaments/:tournamentId/users/:userId/brief")
      .param({
        tournamentId: tournamentId,
        userId: authUser.id,
      })
      .toString();

  const contentFooter = () => (
    <>
      {get(props, "tournament.linkType", "") === "payment" && (
        <div className="description">
          <div>
            - Para inscribirte en el torneo necesitas subir una constancia de
            pago
          </div>
          <div>- Los organizadores del torneo validarán esto en unas horas</div>
          <div>
            - Una vez validado el pago quedara exitosamente inscrito en el
            torneo
          </div>
          <div>
            - Si hay un problema con su pago nos pondremos en contacto con usted
          </div>
        </div>
      )}

      {!get(props, "tournament.playerIds", []).includes(authUser.id) &&
        get(props, "tournament.linkType", "") === "payment" && (
          <Upload
            isImage={true}
            accept="image/*"
            bucket="tournamentTeams"
            filePath={`tournamentTeams/${formId}`}
            fileName="inscription"
            name="inscriptionUrl"
            buttonText="Subir pago"
            document={inscriptionUrl}
            afterUpload={(tournamentTeamsPayment) =>
              setInscriptionUrl(tournamentTeamsPayment.inscriptionUrl)
            }
            sizeResized="300x300"
          />
        )}

      <ButtonBombo
        htmlType="submit"
        margin="10px 0"
        disabled={
          loadingInscription ||
          get(props, "tournament.playerIds", []).includes(authUser.id) ||
          moment().isAfter(
            get(props, "tournament.inscriptionDate", moment()).toDate()
          )
        }
        loading={loadingInscription}
      >
        Inscribirme
      </ButtonBombo>

      {get(props, "tournament.playerIds", []).includes(authUser.id) && (
        <div className="label-success">SU SOLICITUD YA FUE ENVIADA</div>
      )}
      {!get(props, "tournament.playerIds", []).includes(authUser.id) &&
        get(props, "tournament.linkType", "") === "payment" && (
          <>
            <div className="description">
              En caso que quieras pagar con tu tarjeta de crédio, débito o
              cuenta de PAY PAL tendrás que hacerlo mediante la plataforma. Una
              vez recargues te puedes inscribir al torneo.
            </div>
            <div className="description">
              Si quieres inscibirte con saldo que cuentas en la plataforma lo
              tendrás que hacer mediante la página web.
            </div>
          </>
        )}
    </>
  );

  return (
    <FormCss onSubmit={handleSubmit(userInscription)} noValidate>
      <div>
        <div>¡Hola!</div>
        <div>
          Por favor completa el siguiente formulario para inscribirte en el
          torneo
        </div>
        <br />
        <br />
        <Input
          variant="primary"
          placeholder="Nombre"
          label="Nombre"
          ref={register}
          name="name"
          defaultValue={get(authUser, "name")}
          error={errors.name}
        />
        <Input
          variant="primary"
          placeholder="Apellido"
          label="Apellido"
          ref={register}
          name="lastName"
          error={errors.lastName}
          defaultValue={get(authUser, "lastName")}
          className="item-input"
        />
        <Input
          variant="primary"
          placeholder="ID de juego"
          label="ID de juego"
          ref={register}
          name="idGame"
          error={errors.idGame}
          className="item-input"
        />
        <Desktop>{contentFooter()}</Desktop>
        <Tablet>
          <div>
            {props.children}
            {contentFooter()}
          </div>
        </Tablet>
      </div>
      <Desktop>
        <div>{props.children}</div>
      </Desktop>
    </FormCss>
  );
};

export const FormCss = styled.form`
  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 400px 400px;
    grid-column-gap: 2rem;
    justify-content: center;
  }

  color: ${(props) => props.theme.basic.white};

  .label {
    color: ${(props) => props.theme.basic.white};
  }

  .description {
    font-size: 12px;
    margin-bottom: 10px;
  }

  .label-success {
    color: ${(props) => props.theme.basic.primary};
  }

  .description-green {
    color: ${(props) => props.theme.basic.primary};
    padding-bottom: 1rem;
  }

  .ant-select {
    border-radius: 3px !important;
  }

  .ant-select-single.ant-select-show-arrow .ant-select-selection-item,
  .ant-select-single.ant-select-show-arrow .ant-select-selection-placeholder {
    font-size: 14px;
  }
`;
