import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "./ModalContainer";
import { darkTheme } from "../../theme";
import { Anchor, ButtonAnt, Input } from "../form";
import { config, firestore } from "../../firebase";
import { snapshotToArray } from "../../utils";
import { Image } from "./Image";
import get from "lodash/get";
import * as yup from "yup";
import { useForm } from "react-hook-form";

let timer = 0;
let delay = 200;
let prevent = false;

export const ModalMove = (props) => {
  const [authUser] = useGlobal("user");
  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [folderSelected, setFolderSelected] = useState(null);
  const [isVisibleNewFolder, setIsVisibleNewFolder] = useState(false);

  const schema = yup.object().shape({
    name: yup.string().required(),
  });

  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    if (!authUser) return;

    const fetchFolders = async () => {
      let folderRef = firestore
        .collection("folders")
        .where("usersIds", "array-contains", authUser?.id ?? null)
        .where("deleted", "==", false);

      folderRef = folderId ? folderRef.where("parentId", "==", folderId) : folderRef.where("parentId", "==", null);

      folderRef.onSnapshot((foldersQuery) => {
        const folders_ = snapshotToArray(foldersQuery);
        setFolderSelected(null);
        setFolders(folders_);
      });
    };

    fetchFolders();
  }, [authUser, folderId]);

  const doClickAction = (folder) => setFolderSelected(folder);

  const doDoubleClickAction = (folder) => setFolderId(folder.id);

  const handleClick = (folder) => {
    timer = setTimeout(() => {
      if (!prevent) doClickAction(folder);

      prevent = false;
    }, delay);
  };

  const handleDoubleClick = (folder) => {
    clearTimeout(timer);
    prevent = true;
    doDoubleClickAction(folder);
  };

  const saveNewFolder = async (data) => {
    try {
      setIsLoading(true);
      const folderRef = firestore.collection("folders");
      const newFolderId = folderRef.doc().id;

      const path = props.parent ? `${props.parent.path}/${data.name}` : `/${data.name}`;

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
    setIsVisibleNewFolder(false);
    setIsLoading(false);
  };

  return (
    <ModalContainer
      background={darkTheme.basic.whiteLight}
      visible={props.isVisibleModalMove}
      onCancel={() => props.setIsVisibleModalMove(false)}
      footer={null}
      padding={"1rem"}
    >
      <Content>
        <div className="title">Mover juego</div>
        <div className="second-container">
          <div className="go-back" onClick={() => setFolderId(folders[0]?.parent?.parentId || null)}>
            <Image
              src={`${config.storageUrl}/resources/arrows/arrowLeft.svg`}
              width="12px"
              height="10px"
              size="contain"
              margin="0 5px 0 0"
              filter="brightness(0.5)"
            />
            Atrás
          </div>
          <Anchor underlined variant="primary" onClick={() => setIsVisibleNewFolder(true)}>
            Nuevo folder
          </Anchor>
        </div>
        <div className="folders-container">
          <div className="subtitle">Selecciona el lugar</div>

          {isVisibleNewFolder && (
            <div className="new-folder">
              <NewFolderContent>
                <Image
                  src={`${config.storageUrl}/resources/folder.svg`}
                  width="25px"
                  height="20px"
                  size="contain"
                  margin="0 10px 0 0"
                />
                <form onSubmit={handleSubmit(saveNewFolder)} autoComplete="off" noValidate className="form">
                  <div className="input-container">
                    <Input placeholder="Folder sin nombre" name="name" ref={register} error={errors.name} />
                  </div>
                  <ButtonAnt color="default" disabled={isLoading} onClick={() => setIsVisibleNewFolder(false)}>
                    Cancelar
                  </ButtonAnt>
                  <ButtonAnt color="primary" disabled={isLoading} loading={isLoading} htmlType="submit">
                    Crear
                  </ButtonAnt>
                </form>
              </NewFolderContent>
            </div>
          )}
          <div className="folders">
            {folders.map((folder) => (
              <FolderContent
                key={folder.id}
                selected={folder.id === get(folderSelected, "id", null)}
                onClick={() => handleClick(folder)}
                onDoubleClick={() => handleDoubleClick(folder)}
              >
                <Image
                  src={`${config.storageUrl}/resources/purple-folder.svg`}
                  width="25px"
                  height="20px"
                  size="contain"
                  margin="0 10px 0 0"
                />
                <div className="name">{folder.name}</div>
              </FolderContent>
            ))}
          </div>
        </div>
        <div className="btns-container">
          <ButtonAnt color="default" onClick={() => props.setIsVisibleModalMove(false)}>
            Cancelar
          </ButtonAnt>
          <ButtonAnt
            color="secondary"
            disabled={!folderSelected}
            onClick={() => {
              props.moveToFolder(folderSelected);
              props.setIsVisibleModalMove(false);
            }}
          >
            Mover
          </ButtonAnt>
        </div>
      </Content>
    </ModalContainer>
  );
};

const Content = styled.div`
  width: 100%;
  .title {
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 29px;
    color: ${(props) => props.theme.basic.blackDarken};
  }
  .second-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 1rem 0;

    .go-back {
      display: flex;
      align-items: center;
      color: ${(props) => props.theme.basic.blackDarken};
      cursor: pointer;
    }
  }

  .folders-container {
    background: ${(props) => props.theme.basic.whiteDark};
    border: 1.5px solid #dedede;
    box-sizing: border-box;
    border-radius: 8px;
    height: 280px;
    overflow: auto;
    padding: 0.5rem;

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: 900;
      font-size: 13px;
      line-height: 16px;
      color: ${(props) => props.theme.basic.grayLight};
    }
  }

  .btns-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 1rem 0;
  }
`;

const FolderContent = styled.button`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  height: 46px;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  margin: 1rem auto;
  cursor: pointer;
  border: none;
  ${(props) => props.selected && `border: 1px solid ${props.theme.basic.primary};`}

  .name {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 13px;
    line-height: 16px;
    color: ${(props) => props.theme.basic.grayLight};
  }
`;

const NewFolderContent = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  height: 46px;
  padding: 0.5rem;
  display: grid;
  align-items: center;
  grid-template-columns: 25px auto;
  grid-gap: 1rem;
  margin: 1rem auto;
  cursor: pointer;
  border: none;

  form {
    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      height: 30px;
      padding: 5px 10px;
      margin-bottom: 4px;
    }
  }
`;
