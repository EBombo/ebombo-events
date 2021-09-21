import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Desktop, Tablet, mediaQuery } from "../../constants";
import { ButtonAnt, Input } from "../../components/form";
import { darkTheme } from "../../theme";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { firestore } from "../../firebase";
import { useSendError } from "../../hooks";

export const ModalNewFolder = (props) => {
  const router = useRouter();
  const { folderId } = router.query;
  const { sendError } = useSendError();
  const [authUser] = useGlobal("user");
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const editFolder = async (data) => {
    try {
      setIsLoading(true);

      await firestore.doc(`folders/${props.folder.id}`).update({
        name: data.name,
      });

      props.fetchFolders();
    } catch (error) {
      console.error(error);
      sendError(error, "editFolder");
    }
    props.setIsVisibleModalFolder(false);
    setIsLoading(false);
  };

  const saveNewFolder = async (data) => {
    try {
      setIsLoading(true);
      const folderRef = firestore.collection("folders");
      const newFolderId = folderRef.doc().id;

      const path = folderId
        ? `${props.parent.path}/${data.name}`
        : `/${data.name}`;

      await folderRef.doc(newFolderId).set(
        {
          ...data,
          id: newFolderId,
          path,
          parent: props.parent || null,
          parentId: props.parent?.id || null,
          createAt: new Date(),
          updateAt: new Date(),
          deleted: false,
          user: authUser,
          usersIds: [authUser?.id],
        },
        { merge: true }
      );
    } catch (error) {
      console.error(error);
      sendError(error, "saveNewFolder");
    }
    props.setIsVisibleModalFolder(false);
    setIsLoading(false);
  };

  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={props.isVisibleModalFolder}
      padding={"1rem"}
      top={"40%"}
      background={darkTheme.basic.whiteLight}
      onCancel={() =>
        props.setIsVisibleModalFolder(!props.isVisibleModalFolder)
      }
    >
      <NewFolderContainer>
        <div className="title">Crear folder</div>
        <Desktop>
          <div className="label">Nombre</div>
        </Desktop>
        <form
          onSubmit={handleSubmit(props.folder ? editFolder : saveNewFolder)}
          autoComplete="off"
          noValidate
          className="form"
        >
          <div className="input-container">
            <Input
              defaultValue={props.folder ? props.folder.name : ""}
              placeholder="Folder sin nombre"
              name="name"
              ref={register}
              error={errors.name}
            />
          </div>
          <div className="buttons-container">
            <ButtonAnt
              color="default"
              disabled={isLoading}
              onClick={() => props.setIsVisibleModalFolder(false)}
            >
              Cerrar
            </ButtonAnt>
            <ButtonAnt
              color="primary"
              disabled={isLoading}
              loading={isLoading}
              htmlType="submit"
            >
              Crear
            </ButtonAnt>
          </div>
        </form>
      </NewFolderContainer>
    </ModalContainer>
  );
};

const NewFolderContainer = styled.div`
  width: 100%;

  .title {
    width: 100%;
    text-align: center;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    margin-bottom: 0.5rem;
    color: ${(props) => props.theme.basic.black};
  }

  .label {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    margin-top: 1rem;
    color: ${(props) => props.theme.basic.black};
  }

  .form {
    .input-container {
      margin: 1rem 0;
    }

    button {
      padding: 5px 40px !important;
    }
  }
  .buttons-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  ${mediaQuery.afterTablet} {
    .title {
      text-align: left;
      font-size: 25px;
    }

    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    text-align: left;
  }
`;
