import React, { useEffect, useGlobal, useState } from "reactn";
import { Controller, useForm } from "react-hook-form";
import { message } from "antd";
import {
  BackButton,
  ButtonBombo,
  DatePicker,
  Input,
  Upload,
} from "../../../../components";
import { config, firestore } from "../../../../firebase";
import get from "lodash/get";
import assign from "lodash/assign";
import { gaError, snapshotToArray } from "../../../../utils";
import * as yup from "yup";
import { date, string } from "yup";
import styled from "styled-components";
import { mediaQuery } from "../../../../styles/constants";
import UrlAssembler from "url-assembler";
import { useHistory } from "react-router";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";
import { darkTheme } from "../../../../styles/theme";
import { Desktop } from "../../../../utils";
import { Image } from "../../../../components/common/Image";
import { ModalContainer } from "../../../../components/common/ModalContainer";
import moment from "moment";

export const EditProfile = (props) => {
  const history = useHistory();
  const [authUser] = useGlobal("user");
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const [user] = useState(authUser);
  const [isVisibleVerifyAccount, setIsVisibleVerifyAccount] = useState(false);
  const [, setIsVisibleEditProfilePicture] = useGlobal(
    "isVisibleEditProfilePicture"
  );

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const schema = yup.object().shape({
    name: yup.string().required(),
    lastName: yup.string().required(),
    nickname: string()
      .required()
      .matches(
        /^[a-zA-Z0-9\-_]{1,20}$/,
        "Sólo válido letras, números y sin espacios"
      )
      .test(
        "is-nickname",
        "Nombre de usuario ya existe",
        async (nickname) => !(await existNickName(nickname))
      ),
    phoneNumber: yup.string().required().min(5),
    birthDate: date().required(),
  });

  const { register, errors, handleSubmit, watch, control, setValue } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!authUser) history.push("/vs");
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setValue("nickname", watch("nickname").replace(/\s+/g, " ").trim());
  }, [watch("nickname")]); //eslint-disable-line react-hooks/exhaustive-deps

  const existNickName = async (nickName) => {
    const userExists = await firestore
      .collection("users")
      .where("nickname", "==", nickName)
      .get();

    const users = snapshotToArray(userExists).filter(
      (user_) => user_.id !== authUser.id
    );

    return !!users.length;
  };

  const updateRegistration = async (data) => {
    try {
      setLoadingUpdateUser(true);

      await ownFetch(
        `${config.serverUrl}/user/${authUser.id}`,
        "PUT",
        mapUser(data)
      );

      message.success("Registro actualizado.");
    } catch (error) {
      gaError("Error", "PUT /user/:userId");
      handleError({ ...error, action: "updateRegistration" });
    }
    setLoadingUpdateUser(false);
  };

  const mapUser = (data) => assign({}, user, data);

  const sendDocumentUrl = async (file) => {
    try {
      await ownFetch(apiDocumentUrl(authUser), "PUT", file);

      message.success("Foto subida con éxito!", 5);
    } catch (error) {
      handleError({ ...error, action: "sendDocumentUrl" });
    }
    setIsVisibleVerifyAccount(false);
  };

  const apiDocumentUrl = (user) => {
    let template = "/users/:userId/document";
    return new UrlAssembler(`${config.serverUrl}`)
      .template(template)
      .param({ userId: user.id })
      .toString();
  };

  const modalVerifyAccount = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleVerifyAccount}
      onCancel={() => setIsVisibleVerifyAccount(false)}
    >
      <UserUploadDocument>
        <label className="description">
          {" "}
          Sube una foto de tu documento de identidad (DNI) o una foto de tu
          pasaporte{" "}
        </label>
        <Upload
          isImage={true}
          accept="image/*"
          bucket="documents"
          filePath={`users/${authUser.id}`}
          fileName="document"
          name="documentImageUrl"
          listType="picture-card"
          buttonText="Subir foto"
          document={authUser}
          afterUpload={sendDocumentUrl}
          sizeResized="800x800"
        />
      </UserUploadDocument>
    </ModalContainer>
  );

  return (
    <SettingsWithStyle>
      <div className="profile-container">
        <BackButton color={darkTheme.basic.blackLighten} />
        {isVisibleVerifyAccount && modalVerifyAccount()}
        <ProfileContainer>
          <div className="left-content">
            <Image
              src={
                authUser.profileImageUrlThumb
                  ? authUser.profileImageUrlThumb
                  : `${config.storageUrl}/resources/perfil-icon.svg`
              }
              height="60px"
              width="60px"
              borderRadius="50%"
              size="cover"
            />
            <img
              className="edit-photo"
              src={`${config.storageUrl}/resources/upload-icon.svg`}
              alt="icon-edit"
              onClick={() => setIsVisibleEditProfilePicture(true)}
            />
          </div>
          <div className="right-content">
            <h4>
              ID de ebombo: <span>{authUser.nickname}</span>
            </h4>
          </div>
        </ProfileContainer>
        <form
          className="form-setting-user"
          onSubmit={handleSubmit(updateRegistration)}
          noValidate
        >
          <div className="subtitle">Nombre</div>
          <div className="content-item">
            <Input
              variant="primary"
              disabled={!!user.verifiedDocument}
              type="text"
              name="name"
              error={errors.name}
              ref={register}
              autoComplete="off"
              defaultValue={get(user, "name", "")}
              placeholder="Nombre"
            />
          </div>
          <div className="subtitle">Apellido</div>
          <div className="content-item">
            <Input
              variant="primary"
              disabled={!!user.verifiedDocument}
              type="text"
              name="lastName"
              error={errors.lastName}
              ref={register}
              autoComplete="off"
              defaultValue={get(user, "lastName", "")}
              placeholder="Apellido"
            />
          </div>
          <div className="subtitle">Fecha de nacimiento</div>
          <div className="label-tc">
            <Controller
              width="100%"
              name="birthDate"
              control={control}
              defaultValue={
                user.birthDate ? moment(user.birthDate.toDate()) : null
              }
              as={
                <DatePicker
                  disabled={!!user.birthDate}
                  variant="secondary"
                  style={{ width: "100%" }}
                  error={errors.birthDate}
                  placeholder="Fecha de nacimiento"
                  format={"DD/MM/YYYY"}
                  inputReadOnly
                  required
                />
              }
            />
          </div>
          <div className="subtitle">Nombre de usuario</div>
          <div className="content-item">
            <Input
              variant="secondary"
              type="text"
              name="nickname"
              autoComplete="off"
              error={errors.nickname}
              ref={register}
              defaultValue={get(user, "nickname", "")}
              placeholder="Nombre de usuario"
            />
          </div>
          <div className="subtitle">Correo</div>
          <div className="content-item">
            <Input
              variant="primary"
              type="text"
              disabled
              defaultValue={get(user, "email", "")}
            />
          </div>
          <div className="subtitle">Celular</div>
          <div className="content-item">
            <Input
              variant="primary"
              name="phoneNumber"
              disabled={authUser.phoneNumber}
              type="number"
              error={errors.phoneNumber}
              ref={register}
              defaultValue={get(user, "phoneNumber", "")}
              placeholder="Ingresa tu número de teléfono"
            />
          </div>
          <ButtonsContainer>
            <ButtonBombo
              margin="0px 1rem 0 0"
              type="secondary"
              colorEvents={darkTheme.basic.blackLighten}
              color={darkTheme.basic.blackLighten}
              border={`1px solid ${darkTheme.basic.blackLighten}`}
              onClick={() => setIsVisibleVerifyAccount(true)}
            >
              Validar cuenta
            </ButtonBombo>
            <ButtonBombo
              margin="0"
              htmlType="submit"
              loading={loadingUpdateUser}
              disabled={loadingUpdateUser}
            >
              Actualizar
            </ButtonBombo>
          </ButtonsContainer>
        </form>
      </div>
      <Desktop>
        <div className="empty-container"></div>
      </Desktop>
    </SettingsWithStyle>
  );
};

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 0.5rem;
`;

const UserUploadDocument = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 1.5rem;
  align-items: center;
  padding: 0.5rem 0;
`;

const SettingsWithStyle = styled.div`
  height: 100vh;
  background: ${(props) => props.theme.basic.gray};
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .empty-container {
    background: ${(props) => props.theme.basic.blackDarken};
  }

  .profile-container {
    padding: 1rem;

    .form-setting-user {
      max-width: 550px;

      .subtitle {
        color: ${(props) => props.theme.basic.blackLighten};
        font-weight: 600;
        font-size: 12px;
        line-height: 15px;
      }

      ${mediaQuery.afterTablet} {
        width: 100%;
        line-height: 35px;
      }

      .content-item {
        margin-bottom: 10px;
      }
    }
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;

  .left-content {
    position: relative;
    .edit-photo {
      position: absolute;
      bottom: 0;
      right: 0;
      height: 15px;
      cursor: pointer;
    }
  }

  .right-content {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
    .see-profile {
      font-size: 7px;
      line-height: 9px;
      text-decoration: underline;
      color: ${(props) => props.theme.basic.blackLighten};
    }
    h4 {
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.blackLighten};
      font-weight: 500;
      span {
        font-weight: bold;
      }
    }
  }
`;
