import React, { useState } from "reactn";
import styled from "styled-components";
import { Input } from "../../components/form";
import get from "lodash/get";
import { ListGameView } from "./ListGameView";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";

export const DesktopLibraryGames = (props) => {
  const [listType, setListType] = useState("icons");
  const [tab, setTab] = useState("all");
  const router = useRouter();

  return (
    <GamesContainer>
      <div className="nav-container">
        <div className="tabs-container">
          <div
            className={`tab ${tab === "all" ? "active" : ""}`}
            onClick={() => setTab("all")}
          >
            Mis juegos
          </div>
          <div
            className={`tab middle ${tab === "favorites" ? "active" : ""}`}
            onClick={() => setTab("favorites")}
          >
            Favoritos
          </div>
          <div
            className={`tab ${tab === "drafts" ? "active" : ""}`}
            onClick={() => setTab("drafts")}
          >
            Borradores
          </div>
        </div>

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
          <ListGameView game={game} listType={listType} {...props} />
        ))}
        {isEmpty(props.games) && (
          <div className="empty-container">No cuentas con juegos.</div>
        )}
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

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;

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
        border-right: 2px solid ${(props) => props.theme.basic.grayLighten};
      }

      .active {
        background: ${(props) => props.theme.basic.whiteLight};
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;