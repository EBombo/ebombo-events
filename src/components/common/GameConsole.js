import React from "reactn";
import get from "lodash/get";
import styled from "styled-components";

export const GameConsole = (props) => {
  return (
    <ConsoleContainer
      gameConsole={get(props, "gameConsole.name", "")
        .split(" ")
        .join("")
        .toUpperCase()}
      style={props.style}
    >
      <span className="text-level">
        <b> {get(props, "gameConsole.name", "")}</b>
      </span>
    </ConsoleContainer>
  );
};

const ConsoleContainer = styled.div`
  text-align: ${(props) => get(props.style, "textAlign", "center")};
  font-size: ${(props) => get(props.style, "fontSize", "10px")};
  padding: 0 0.5rem;
  color: ${(props) =>
    props.gameConsole === "PS5"
      ? props.theme.colorConsoles.PS5
      : props.gameConsole === "PS4"
      ? props.theme.colorConsoles.PS4
      : props.gameConsole === "PS3"
      ? props.theme.colorConsoles.PS3
      : props.gameConsole === "MULTIPLATAFORMA"
      ? props.theme.colorConsoles.MULTIPLATAFORMA
      : props.gameConsole === "XBOX360"
      ? props.theme.colorConsoles.XBOX360
      : props.gameConsole === "XBOXONE"
      ? props.theme.colorConsoles.XBOXONE
      : props.gameConsole === "XBOXSERIESX"
      ? props.theme.colorConsoles.XBOXSERIESX
      : props.gameConsole === "PC"
      ? props.theme.colorConsoles.PC
      : props.gameConsole === "MOBILE"
      ? props.theme.colorConsoles.MOBILE
      : props.theme.basic.white};
  border: 1px solid
    ${(props) =>
      props.gameConsole === "PS5"
        ? props.theme.colorConsoles.PS5
        : props.gameConsole === "PS4"
        ? props.theme.colorConsoles.PS4
        : props.gameConsole === "PS3"
        ? props.theme.colorConsoles.PS3
        : props.gameConsole === "MULTIPLATAFORMA"
        ? props.theme.colorConsoles.MULTIPLATAFORMA
        : props.gameConsole === "XBOX360"
        ? props.theme.colorConsoles.XBOX360
        : props.gameConsole === "XBOXONE"
        ? props.theme.colorConsoles.XBOXONE
        : props.gameConsole === "XBOXSERIESX"
        ? props.theme.colorConsoles.XBOXSERIESX
        : props.gameConsole === "PC"
        ? props.theme.colorConsoles.PC
        : props.gameConsole === "MOBILE"
        ? props.theme.colorConsoles.MOBILE
        : props.theme.basic.white};
`;
