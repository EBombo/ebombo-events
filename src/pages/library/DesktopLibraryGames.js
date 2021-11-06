import React, { useGlobal, useState, useEffect } from "reactn";
import styled from "styled-components";
import { Input } from "../../components/form";
import { ListGameView } from "./ListGameView";
import isEmpty from "lodash/isEmpty";
import { spinLoaderMin } from "../../components/common/loader";
import { ModalMove } from "../../components/common/ModalMove";
import { useSendError } from "../../hooks";
import { updateGame } from "./games/_gameId";

export const DesktopLibraryGames = (props) => {
  const [games, setGames] = useGlobal("userGames");
  const [listType, setListType] = useState("icons");
  const [tab, setTab] = useState("all");
  const [loadingGames] = useGlobal("loadingGames");
  const [isVisibleModalMove, setIsVisibleModalMove] = useState(false);
  const { sendError } = useSendError();
  const [authUser] = useGlobal("user");

  const [selectedGameToMove, setSelectedGameToMove] = useState(null);

  const moveGameToFolder = async (folder) => {
    if (!selectedGameToMove) return;

    try {
      await updateGame(selectedGameToMove.adminGame, { id: game.id, parentId: folder?.id }, authUser);

      props.fetchGames();
    } catch (error) {
      await sendError(error);
    }
  };

  useEffect(() => {
    if (tab === "favorites") {
      const _games = games.filter((game) => !!game.isFavorite);
      setGames(_games);
    } else {
      props.fetchGames();
    }
  }, [tab]);

  return (
    <GamesContainer>
      <ModalMove
        moveToFolder={moveGameToFolder}
        setIsVisibleModalMove={setIsVisibleModalMove}
        isVisibleModalMove={isVisibleModalMove}
        {...props}
      />
      <div className="nav-container">
        <div className="tabs-search-container">
          <div className="tabs-container">
            <div className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>
              Mis juegos
            </div>
            <div className={`tab middle ${tab === "favorites" ? "active" : ""}`} onClick={() => setTab("favorites")}>
              Favoritos
            </div>
            {/*<div*/}
            {/*  className={`tab ${tab === "drafts" ? "active" : ""}`}*/}
            {/*  onClick={() => setTab("drafts")}*/}
            {/*>*/}
            {/*  Borradores*/}
            {/*</div>*/}
          </div>

          <div className="search-bar">
            <Input type="search" placeholder="Buscar" />
          </div>
        </div>

        <div className="list-type">
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

      <div className="list-container">
        {props.games.map((game) => (
          <ListGameView
            game={game}
            key={game.id}
            listType={listType}
            initModalMove={(toggle) => {
              setIsVisibleModalMove(toggle);
              setSelectedGameToMove(game);
            }}
            {...props}
          />
        ))}
        {loadingGames
          ? spinLoaderMin()
          : isEmpty(props.games) && <div className="empty-container">No cuentas con juegos.</div>}
      </div>
    </GamesContainer>
  );
};

const GamesContainer = styled.div`
  padding: 2rem;
  background: ${(props) => props.theme.basic.whiteDark};
  height: 100%;
  overflow: auto;

  .list-container {
    margin-top: 2rem;
  }

  .empty-container {
    display: flex;
    justify-content: center;
    padding: 2rem;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 18px;
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
      :hover:not(.active) {
        div {
          border-color: ${(props) => props.theme.basic.secondaryHover};
        }
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
      :hover:not(.active) {
        div {
          border-color: ${(props) => props.theme.basic.secondaryHover};
        }
      }
    }
  }

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .tabs-search-container {
      display: grid;
      grid-template-columns: auto 300px;
      grid-gap: 1rem;
      background: transparent;
    }

    .tabs-container {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      border-radius: 4px;
      box-sizing: border-box;
      border: 2px solid ${(props) => props.theme.basic.grayLighten};

      .tab {
        padding: 0.5rem 1rem;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 18px;
        cursor: pointer;
      }

      .middle {
        border-left: 2px solid ${(props) => props.theme.basic.grayLighten};
        //border-right: 2px solid ${(props) => props.theme.basic.grayLighten};
      }

      .active {
        background: ${(props) => props.theme.basic.whiteLight};
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;
