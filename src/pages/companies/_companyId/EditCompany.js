import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { config } from "../../../firebase";
import { useSendError } from "../../../hooks";
import { useFetch } from "../../../hooks/useFetch";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import { ButtonAnt, Input } from "../../../components/form";
import { FileUpload } from "../../../components/common/FileUpload";
import get from "lodash/get";
import { Switch } from "antd";
import { mediaQuery } from "../../../constants";

export const EditCompany = (props) => {
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");

  const [loading, setLoading] = useState(false);
  const [logoImgUrl, setlogoImgUrl] = useState(props.company?.logoImgUrl || null);
  const [userIdentification, setUserIdentification] = useState(props.company.userIdentification ?? false);

  const schema = object().shape({
    name: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const mapCompany = (data) => ({
    name: data.name,
    usersIds: [authUser.id],
    userIdentification,
    logoImgUrl,
  });

  const saveCompany = async (data) => {
    try {
      setLoading(true);

      const companyMapped = mapCompany(data);

      const { error } = await Fetch(
        `${config.serverUrl}/api/companies/${props.company.id}`,
        props.company?.name ? "PUT" : "POST",
        companyMapped
      );

      props.showNotification(
        error ? "ERROR" : "OK",
        error ? "Algo salió mal" : "Guardado!",
        error ? "error" : "success"
      );

      if (error) throw Error(error);
    } catch (error) {
      await sendError(error, "saveCompany");
    }

    setLoading(false);
  };

  return (
    <EditContainer>
      <div className="company-container">
        <form onSubmit={handleSubmit(saveCompany)}>
          <div className="top-container">
            <div className="title">Detalles de la marca</div>
            <ButtonAnt color="secondary" htmlType="submit" loading={loading} className="btn-submit">
              Guardar
            </ButtonAnt>
          </div>
          <div className="bottom-container">
            <div className="description">
              Agregue una marca personalizada a sus juegos cargando el logotipo de su organización y escogiendo los
              colores.
            </div>
            <FileUpload
              buttonLabel={logoImgUrl ? "Cambiar logo" : "Agregar logo"}
              file={logoImgUrl}
              preview={true}
              fileName="companyLogoImgUrl"
              bucket="companies"
              filePath={`/${props.company.id}`}
              sizes="200x200"
              disabled={props.isLoading}
              afterUpload={(resizeImages) => setlogoImgUrl(resizeImages[0].url)}
            />

            <div className="label">Nombre de organización</div>
            <Input
              id="name"
              name="name"
              variant="primary"
              error={errors.name}
              ref={register}
              autoComplete="off"
              defaultValue={get(props, "company.name", "")}
            />

            <div className="flex-container">
              <div className="label">Identicación del jugador</div>
              <Switch checked={userIdentification} onChange={() => setUserIdentification(!userIdentification)} />
            </div>

            <div className="description padding-bottom">
              La activación de la función de identificador de jugador la convierte en la configuración predeterminada
              para todos los kahoots. Sin embargo, los hosts pueden desactivar esta función. La función de
              identificación del jugador permite a los anfitriones realizar un seguimiento del progreso de los jugadores
              en una serie de kahoots haciendo coincidir sus puntuaciones con direcciones de correo electrónico, nombres
              u otros parámetros.
            </div>
          </div>
        </form>
      </div>
    </EditContainer>
  );
};

const EditContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};

  form {
    .top-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};

      .title {
        font-family: Lato;
        font-style: normal;
        font-weight: 500;
        font-size: 15px;
        line-height: 19px;
        color: ${(props) => props.theme.basic.blackLighten};
      }

      .btn-submit {
        padding: 5px !important;
      }
    }

    .bottom-container {
      padding: 1rem;

      .description {
        font-family: Lato;
        font-style: normal;
        font-weight: 500;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.blackDarken};
      }

      .label {
        font-family: Lato;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 16px;
        margin-top: 1rem;
      }
    }

    .flex-container {
      display: flex;
      align-items: center;
      margin: 1rem 0;

      .label {
        margin: 0 1rem 0 0;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    padding: 2rem;
    form {
      max-width: 423px;
      background: ${(props) => props.theme.basic.whiteLight};
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
      border-radius: 2px;

      .padding-bottom {
        padding-bottom: 5rem;
      }
    }
  }
`;
