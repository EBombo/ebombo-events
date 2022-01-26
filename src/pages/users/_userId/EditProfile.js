import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ButtonAnt, Input } from "../../../components/form";
import { object, string } from "yup";
import { useForm } from "react-hook-form";
import get from "lodash/get";
import { useSendError } from "../../../hooks";
import { useFetch } from "../../../hooks/useFetch";
import { config } from "../../../firebase";
import { FileUpload } from "../../../components/common/FileUpload";
import { mediaQuery } from "../../../constants";

export const EditProfile = (props) => {
  const { Fetch } = useFetch();
  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");

  const [loading, setLoading] = useState(false);
  const [profileImgUrl, setProfileImgUrl] = useState(props.user.profileImgUrl ?? "");

  const schema = object().shape({
    name: string().required(),
    lastName: string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      // TODO: Validate userName [unique].
      // TODO: update searchName in firebase.
      const userMapped = mapUser(data);

      const { error } = await Fetch(`${config.serverUrl}/api/users/${get(authUser, "id")}/edit`, "PUT", userMapped);

      props.showNotification(
        error ? "ERROR" : "OK",
        error ? "Algo salió mal" : "Guardado!",
        error ? "error" : "success"
      );

      if (error) throw Error(error);
    } catch (error) {
      await sendError(error, "updateProfile");
    }
    setLoading(false);
  };

  const mapUser = (data) => ({
    name: data.name,
    lastName: data.lastName,
    userName: data.userName,
    profileImgUrl,
  });

  return (
    <EditContainer>
      <div className="forms-container">
        <div className="first-container">
          <div className="title">Información del usuario</div>
          <form onSubmit={handleSubmit(updateProfile)}>
            <div className="top-container">
              <div className="img-container">
                <FileUpload
                  buttonLabel={profileImgUrl ? "Cambiar Imagen" : "Subir "}
                  file={profileImgUrl}
                  preview={true}
                  bucket="users"
                  fileName="profileImgUrl"
                  filePath={`/${authUser?.id}`}
                  sizes="200x200"
                  disabled={props.isLoading}
                  afterUpload={(resizeImages) => setProfileImgUrl(resizeImages[0].url)}
                />
              </div>
              <ButtonAnt
                color="secondary"
                htmlType="submit"
                disabled={loading || authUser?.id !== props.user.id}
                loading={loading}
                className="btn-submit"
              >
                Guardar
              </ButtonAnt>
            </div>

            <div className="inputs-container">
              <label htmlFor="userName">Usuario</label>
              <Input
                id="userName"
                name="userName"
                variant="primary"
                error={errors.userName}
                ref={register}
                autoComplete="off"
                defaultValue={get(props, "user.userName", "")}
                placeholder="Usuario"
                disabled={authUser?.id !== props.user.id}
              />

              <label htmlFor="name">Nombre</label>
              <Input
                name="name"
                variant="primary"
                error={errors.name}
                ref={register}
                autoComplete="off"
                defaultValue={get(props, "user.name", "")}
                placeholder="Nombre"
              />

              <label htmlFor="lastName">Apellido</label>
              <Input
                name="lastName"
                variant="primary"
                error={errors.lastName}
                ref={register}
                autoComplete="off"
                defaultValue={get(props, "user.lastName", "")}
                placeholder="Apellido"
              />
            </div>
          </form>
        </div>
      </div>
      {/*
      <div className="delete">
          <Anchor underlined variant="danger" fontSize="11px">
            Eliminar cuenta
          </Anchor>
      </div>
      <div className="description">
        Si hace esto, perderá el acceso a todos los juegos que creó. Si solo desea darse de baja de su plan actual,
        vaya a la página de facturación.
      </div>
       */}
    </EditContainer>
  );
};

const EditContainer = styled.div`
  width: 100%;

  .ant-popover-title {
    display: none;
  }

  .ant-popover {
    max-width: 300px !important;
  }

  .delete {
    padding: 0 1rem;
    margin-bottom: 0.5rem;
  }

  .description {
    padding: 0 1rem;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 16px;
  }

  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    color: ${(props) => props.theme.basic.blackLighten};
    height: 30px;
    padding: 0.5rem 1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
  }

  form {
    width: 100%;

    .top-container {
      position: relative;

      .img-container {
        margin: 1rem auto;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .btn-submit {
        position: absolute;
        top: 0;
        right: 10px;
        padding: 5px !important;
      }
    }

    .inputs-container {
      padding: 1rem;

      label {
        font-family: Lato;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 16px;
        display: flex;
        align-items: center;
        margin: 0.5rem 0;
      }

      input {
        margin-bottom: 0.5rem;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    background: ${(props) => props.theme.basic.whiteLight};
    padding: 1rem;
    border-radius: 8px;

    .forms-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: 50px;
      align-items: flex-end;
    }
  }
`;

const PopoverContent = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: ${(props) => props.theme.basic.whiteLight};
`;
