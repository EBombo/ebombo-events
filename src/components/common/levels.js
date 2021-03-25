import React from "reactn";
import get from "lodash/get";
import styled from "styled-components";
import {colorLevels} from "../../styles/constants";

export const Levels = (props) => {
  const findLevel = () =>
    get(
      props.gamesStatistics.find(
        (game) => get(game, "gameId", "") === props.gameId
      ),
      "level",
      0
    );

  return props.isRounded ? (
    <CircledContainer level={findLevel()} {...props}>
      {findLevel()}
    </CircledContainer>
  ) : (
    <LevelsContainer level={findLevel()} {...props}>
      <span className="text-level">
        <b>Level {findLevel()}</b>
      </span>
    </LevelsContainer>
  );
};

const CircledContainer = styled.div`
  text-align: center;
  width: 12px;
  height: 12px;
  font-size: ${(props) => get(props.style, "fontSize", "10px")};
  padding: ${(props) => (props.padding ? props.padding : "0")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
  border-radius: 50%;
  color: ${props=>props.theme.basic.black};
  background-color: ${(props) =>
    props.level === 0
      ? colorLevels.level0
      : props.level === 1
      ? colorLevels.level1
      : props.level === 2
      ? colorLevels.level2
      : colorLevels.level3};
`;

const LevelsContainer = styled.div`
  text-align: ${(props) => get(props.style, "textAlign", "center")};
  font-size: ${(props) => get(props.style, "fontSize", "10px")};
  padding: ${(props) => (props.padding ? props.padding : "0")};
  margin: ${(props) => (props.margin ? props.margin : "0")};
  min-width: 60px;

  color: ${(props) =>
    props.level === 0
      ? colorLevels.level0
      : props.level === 1
      ? colorLevels.level1
      : props.level === 2
      ? colorLevels.level2
      : colorLevels.level3};

  border: ${(props) =>
    props.border
      ? `1px solid ${
          props.level === 0
            ? colorLevels.level0
            : props.level === 1
            ? colorLevels.level1
            : props.level === 2
            ? colorLevels.level2
            : colorLevels.level3
        }`
      : "none"};
`;
