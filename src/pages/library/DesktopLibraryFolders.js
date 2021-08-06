import React, { useState, useGlobal } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import { Input, ButtonAnt } from "../../components/form";
import { Image } from "../../components/common/Image";
import { ModalNewFolder } from "./ModalNewFolder";
import { ModalNewGame } from "./ModalNewGame";
import { config } from "../../firebase";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { ListGameView } from "./ListGameView";

export const DesktopLibraryFolders = (props) => {
  const [authUser] = useGlobal("user");
  const [listType, setListType] = useState("icons");
  const [isVisibleModalGame, setIsVisibleModalGame] = useState(false);
  const [isVisibleModalFolder, setIsVisibleModalFolder] = useState(false);
  const router = useRouter();

  return (
    <FoldersContainer>
      {isVisibleModalFolder && (
        <ModalNewFolder
          {...props}
          isVisibleModalFolder={isVisibleModalFolder}
          setIsVisibleModalFolder={setIsVisibleModalFolder}
        />
      )}
      {isVisibleModalGame && (
        <ModalNewGame
          isVisibleModalGame={isVisibleModalGame}
          setIsVisibleModalGame={setIsVisibleModalGame}
        />
      )}
      <div className="nav-container">
        <div className="path">
          {get(authUser, "company.name", "")} {props.parent?.path}
        </div>

        <div className="list-type">
          <div className="search-bar">
            <Input
              variant="clear"
              placeholder="Buscar"
              marginBottom="0"
              border={`2px solid #C4C4C4`}
              borderRadius="4px"
              width="225px"
            />
          </div>
          <Image
            src={`${config.storageUrl}/resources/folder.svg`}
            height={"30px"}
            width={"30px"}
            size={"contain"}
            margin={"0 5px"}
            onClick={() => setIsVisibleModalFolder(true)}
          />
          <Image
            src={`${config.storageUrl}/resources/social.svg`}
            height={"30px"}
            width={"30px"}
            size={"contain"}
            margin={"0 5px"}
            onClick={() => setIsVisibleModalFolder(true)}
          />

          <div className="icons" onClick={() => setListType("icons")}>
            <div className={`${listType === "icons" ? "active" : ""}`} />
            <div className={`${listType === "icons" ? "active" : ""}`} />
          </div>
          <div className="list" onClick={() => setListType("list")}>
            <div className={`${listType === "list" ? "active" : ""}`} />
            <div className={`${listType === "list" ? "active" : ""}`} />
            <div className={`${listType === "list" ? "active" : ""}`} />
          </div>
        </div>
      </div>
      <div className="folders-container">
        {isEmpty(props.folders) ? (
          <div className="empty-message">No cuentas con folders</div>
        ) : (
          props.folders.map((folder) => (
            <div
              key={folder.id}
              className="folder"
              onClick={() => router.push(`/library/folders/${folder.id}`)}
            >
              <div className="left">
                <Image
                  src={`${config.storageUrl}/resources/folder-black.svg`}
                  width="20px"
                  height="25px"
                  className="icon"
                  margin="0 10px 0 0"
                />
                <div className="name">{folder.name}</div>
              </div>
              <div className="right">
                <div />
                <div />
                <div />
              </div>
            </div>
          ))
        )}
      </div>
      {!isEmpty(props.games) ? (
        <div className="btn-container">
          <ButtonAnt
            variant="contained"
            color="primary"
            onClick={() => setIsVisibleModalGame(true)}
          >
            Crear juego
          </ButtonAnt>
        </div>
      ) : (
        <div className="games-container">
          {props.games.map((game) => (
            <ListGameView game={game} listType={listType} {...props} />
          ))}
        </div>
      )}
    </FoldersContainer>
  );
};

const FoldersContainer = styled.div`
  width: 100%;
  padding: 2rem;
  background: ${(props) => props.theme.basic.whiteDark};
  height: 100%;
  overflow: auto;

  .btn-container {
    width: 100%;
    height: 300px;
    border: 3px dashed ${(props) => props.theme.basic.grayLighten};
    box-sizing: border-box;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .games-container {
    width: 100%;
  }

  .folders-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 280px));
    grid-gap: 1rem;
    margin: 2rem 0;

    .folder {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: ${(props) => props.theme.basic.whiteLight};
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
      border-radius: 5px;
      height: 45px;
      padding: 0 1rem;
      cursor: pointer;

      .left {
        display: flex;
        align-items: center;
      }

      .right {
        height: 18px;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;

        div {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${(props) => props.theme.basic.black};
        }
      }
    }
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .search-bar {
      margin-right: 20px;
    }

    .list-type {
      display: flex;
      align-items: center;

      .icons {
        margin-right: 5px;
        cursor: pointer;
        div {
          border: 2px solid ${(props) => props.theme.basic.grayLighten};
          box-sizing: border-box;
          border-radius: 3px;
          width: 35px;
          height: 15px;
          margin-bottom: 2px;
        }

        .active {
          border: 2px solid ${(props) => props.theme.basic.secondary};
        }
      }

      .list {
        cursor: pointer;
        div {
          border: 2px solid ${(props) => props.theme.basic.grayLighten};
          box-sizing: border-box;
          border-radius: 3px;
          width: 35px;
          height: 9px;
          margin-bottom: 2px;
        }

        .active {
          border: 2px solid ${(props) => props.theme.basic.secondary};
        }
      }
    }
  }
`;