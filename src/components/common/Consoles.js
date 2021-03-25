import React, {useGlobal} from "reactn";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import styled from "styled-components";
import {useParams} from "react-router";

export const Consoles = (props) => {
  const { gameId, consoleId } = useParams();
  const [consoles] = useGlobal("consoles");
  const [games] = useGlobal("games");

  const currentGameId = () =>
    props.selectedGame ? props.selectedGame.id : defaultTo(gameId, "");

  const currentConsoleId = () =>
    props.selectedConsole ? props.selectedConsole.id : defaultTo(consoleId, "");

  const consoles_ = () =>
    defaultTo(consoles, []).filter((console_) =>
      get(
        games.find((game) => game.id === currentGameId()),
        "consoleIds",
        []
      ).includes(console_.id)
    );

  const onClickConsole = (console) => props.onClick && props.onClick(console);

  return props.isDesktop ? (
    <ContainerDesktop>
      <div className="consoles-items">
        {consoles_().map((console) => (
          <div
            key={`key-consoles-items${console.id}`}
            className={`console-options ${
              currentConsoleId() === console.id ? "item selected" : "item"
            }`}
            onClick={() => onClickConsole(console)}
          >
            <img
              src={get(console, "iconUrl", "-")}
              style={{ width: "25px" }}
              alt="vs"
            />
            <span className="item-name"> {get(console, "name", "game")} </span>
          </div>
        ))}
      </div>
    </ContainerDesktop>
  ) : (
    <ContainerMobile>
      <div className="console-title">Seleccionar Consola</div>
      <div className="consoles">
        {consoles_().map((console) => (
          <div
            className={`console-options ${
              currentConsoleId() === console.id ? "console-selected" : ""
            }`}
            key={console.id}
            onClick={() => onClickConsole(console)}
          >
            {console.name}
          </div>
        ))}
      </div>
    </ContainerMobile>
  );
};

const ContainerDesktop = styled.div`
  width: 100%;
  left: 0;
  overflow: auto;

  .console-title {
    color: ${(props) => props.theme.basic.primary};
    font-size: 12px;
    margin: 5px 0;
  }

  .consoles-items {
    height: 71px;
    width: 100%;
    overflow: auto;
    margin: 0 auto;
    display: -webkit-box;

    .item {
      background: ${(props) => props.theme.basic.blackDarken};
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: ${(props) => props.theme.basic.white};
      cursor: pointer;
      min-width: 4.5rem;
      animation: ease-in 0.5s;
      border-radius: 5px;
      margin: 0 5px;
      i {
        font-size: 18px;
      }
      span {
        text-align: center;
        margin-top: 5px;
        font-size: 0.5rem;
      }
    }
    .selected {
      background: ${(props) => props.theme.basic.blackDarken};
      border: 1px solid ${(props) => props.theme.basic.primary};
      img {
        filter: brightness(100%);
      }
      span {
        font-size: 0.6rem;
        color: ${(props) => props.theme.basic.primary};
      }
    }
  }
`;

const ContainerMobile = styled.div`
  color: ${(props) => props.theme.basic.white};

  .title {
    font-size: 1rem;
    font-weight: bold;
    margin: 5px 0px;
  }

  .consoles {
    overflow: auto;
    padding: 5px 0px;
    width: 100%;
    display: -webkit-box;

    .console-options {
      cursor: pointer;
      font-size: 0.7rem;
      font-weight: bold;
      background: ${(props) => props.theme.basic.blackDarken};
      color: ${(props) => props.theme.basic.white};
      border-radius: 10px;
      border: 2px solid ${(props) => props.theme.basic.primary};
      padding: 3px 14px;
      margin: 0px 5px;
      width: 115px;
      text-align: center;
    }

    .console-selected {
      color: ${(props) => props.theme.basic.blackDarken};
      background: ${(props) => props.theme.basic.primary};
    }
  }
`;
