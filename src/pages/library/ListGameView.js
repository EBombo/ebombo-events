import React, { useState } from "reactn";
import styled from "styled-components";
import { Image } from "../../components/common/Image";
import { ButtonAnt, Checkbox } from "../../components/form";

export const ListGameView = (props) => {
  return (
    <>
      {props.listType === "icons" && (
        <IconsContainer>
          <div className="select">
            <Checkbox />
          </div>
          <Image
            src={props.game.imageUrl}
            width="144px"
            height="131px"
            margin="0"
            size="cover"
          />
          <div className="main-content">
            <div className="description">{props.game.description}</div>
            <div className="buttons-container">
              <ButtonAnt variant="contained" color="blue" margin="0 1rem">
                Editar
              </ButtonAnt>
              <ButtonAnt variant="contained" color="darkgreen">
                Jugar
              </ButtonAnt>
            </div>
          </div>
        </IconsContainer>
      )}
    </>
  );
};

const IconsContainer = styled.div`
  width: 100%;
  background: ${(props) => props.theme.basic.whiteLight};
  display: grid;
  grid-template-columns: 80px 144px auto;
  align-items: center;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;

  .select {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .main-content {
    position: relative;
    height: 100%;
    width: 100%;

    .description {
      padding: 1rem;
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      color: ${(props) => props.theme.basic.black};
    }

    .buttons-container {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 45px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 1rem;
      background: ${(props) => props.theme.basic.whiteDark};
      border-radius: 0px 0px 5px 0px;
    }
  }
`;
