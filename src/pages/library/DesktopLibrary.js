import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { config } from "../../firebase";
import { Input } from "../../components/form";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { ListGameView } from "./ListGameView";

export const DesktopLibrary = (props) => {
  const [listType, setListType] = useState("icons");
  const [tab, setTab] = useState("all");
  const router = useRouter();

  return (
    <DesktopLibraryContainer>
      <div className="left-container">
        <div className="subtitle">Libreria</div>
        <div
          className={`item games ${
            get(router, "asPath", "") === "/library/games" ? "active" : ""
          }`}
          onClick={() => router.push("/library/games")}
        >
          <Image
            src={`${config.storageUrl}/resources/purple-puzzle.svg`}
            width="20px"
            height="25px"
            className="icon"
            margin="0 20px 0 0"
          />
          <div className="name">Mis juegos</div>
        </div>
        <div
          className={`item favorites ${
            get(router, "asPath", "").includes("/library/folders")
              ? "active"
              : ""
          }`}
          onClick={() => router.push("/library/folders")}
        >
          <Image
            src={`${config.storageUrl}/resources/purple-folder.svg`}
            width="20px"
            height="25px"
            className="icon"
            margin="0 20px 0 0"
          />
          <div className="name">Folders</div>
        </div>
      </div>
      <div className="right-container">
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
          {get(router, "query.item", "games") &&
            props.games.map((game) => (
              <ListGameView
                game={game}
                listType={listType}
                key={game.id}
                {...props}
              />
            ))}
          {isEmpty(props.games) && (
            <div className="empty-container">No cuentas con juegos.</div>
          )}
        </div>
      </div>
    </DesktopLibraryContainer>
  );
};

const DesktopLibraryContainer = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  display: grid;
  grid-template-columns: 250px auto;

  .right-container {
    padding: 2rem;
    background: ${(props) => props.theme.basic.whiteDark};

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
        }
      }
    }
  }

  .left-container {
    background: ${(props) => props.theme.basic.whiteLight};
    color: ${(props) => props.theme.basic.grayLight};
    box-shadow: 2px 0px 4px rgba(0, 0, 0, 0.25);

    .subtitle {
      font-family: Lato;
      font-style: normal;
      font-weight: 500;
      font-size: 15px;
      line-height: 18px;
      padding: 0.5rem;
    }

    .item {
      cursor: pointer;
      font-family: Lato;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      width: 100%;
      height: 42px;
      background: ${(props) => props.theme.basic.whiteLight};
    }

    .item:hover {
      background: ${(props) => props.theme.basic.whiteDark};
    }

    .active {
      background: ${(props) => props.theme.basic.whiteDark};
    }

    .games {
      border-radius: 3px 3px 0px 0px;
    }

    .favorites {
      border-radius: 0px 0px 3px 3px;
    }

    .selected {
      background: #f2f2f2;
    }
  }
`;
