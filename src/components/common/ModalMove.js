import React, { useEffect, useGlobal, useState, useRef } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "./ModalContainer";
import { darkTheme } from "../../theme";
import { Anchor, ButtonAnt } from "../form";
import { config, firestore } from "../../firebase";
import { snapshotToArray } from "../../utils";
import { Image } from "./Image";
import get from "lodash/get";

let timer = 0;
let delay = 200;
let prevent = false;

export const ModalMove = (props) => {
  const [authUser] = useGlobal("user");
  const [folderId, setFolderId] = useState(null);
  const [folders, setFolders] = useState([]);
  const [folderSelected, setFolderSelected] = useState(null);

  useEffect(() => {
    if (!authUser) return;

    fetchFolders();
  }, [authUser, folderId]);

  const createFolder = () => {
    console.log("creating");
  };

  const fetchFolders = async () => {
    let folderRef = firestore
      .collection("folders")
      .where("usersIds", "array-contains", authUser?.id ?? null)
      .where("deleted", "==", false);

    folderRef = folderId
      ? folderRef.where("parentId", "==", folderId)
      : folderRef.where("parentId", "==", null);

    folderRef.onSnapshot((foldersQuery) => {
      const folders_ = snapshotToArray(foldersQuery);
      setFolders(folders_);
    });
  };

  const doClickAction = (folder) => {
    setFolderSelected(folder);
  };

  const doDoubleClickAction = (folder) => {
    setFolderId(folder.id);
  };

  const handleClick = (e) => {
    timer = setTimeout(function () {
      if (!prevent) {
        doClickAction(e);
      }
      prevent = false;
    }, delay);
  };

  const handleDoubleClick = (e) => {
    clearTimeout(timer);
    prevent = true;
    doDoubleClickAction(e);
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
          <div
            className="go-back"
            onClick={() => {
              console.log(folders[0]);
              setFolderId(folders[0]?.parent?.parentId || null);
            }}
          >
            <Image
              src={`${config.storageUrl}/resources/arrows/arrowLeft.svg`}
              width="12px"
              height="10px"
              size="contain"
              margin="0 5px 0 0"
              filter="grayscale(100%)"
            />
            Atrás
          </div>
          <Anchor underlined variant="primary" onClick={() => createFolder()}>
            Nuevo folder
          </Anchor>
        </div>
        <div className="folders-container">
          <div className="subtitle">Selecciona el lugar</div>
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
          <ButtonAnt
            color="default"
            onClick={() => props.setIsVisibleModalMove(false)}
          >
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
            Mover aca
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
  ${(props) =>
    props.selected && `border: 1px solid ${props.theme.basic.primary};`}

  .name {
    font-family: Lato;
    font-style: normal;
    font-weight: 900;
    font-size: 13px;
    line-height: 16px;
    color: ${(props) => props.theme.basic.grayLight};
  }
`;
