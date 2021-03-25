import React from "react";
import styled from "styled-components";
import { mediaQuery } from "../../styles/constants";
import { useGlobal } from "reactn";
import { useHistory } from "react-router";
import { ButtonBombo } from "../../components/common";

export const LandingGames = () => {
  const history = useHistory();

  const [games] = useGlobal("games");

  return (
    <ContainerLandingGames>
      <div className="title">Juegos disponibles</div>
      <div className="games">
        {games.map((game) => (
          <Game
            key={game.id}
            disabled={game.disabled}
            image={game.landingImageUrlThumb}
          >
            <div
              className="game"
              onClick={() =>
                history.push(
                  `/games/${game.id}/consoles/${game.consoleIds[0]}/challenges`
                )
              }
            >
              <div className="game-content">
                <div className="game-soon">Próximamente</div>
              </div>
            </div>
            <div className="game-name">{game.name}</div>
          </Game>
        ))}
      </div>
    </ContainerLandingGames>
  );
};

const ContainerLandingGames = styled.div`
  background: ${(props) => props.theme.basic.blackDarken};
  width: 100%;
  color: ${(props) => props.theme.basic.white};
  padding: 1rem;
  ${mediaQuery.afterTablet} {
    padding: 3rem 2.5rem;
  }
  .title {
    font-weight: 500;
    margin: 1rem 0;
    text-align: center;
    font-size: 16px;
    ${mediaQuery.afterTablet} {
      font-size: 21px;
      text-align: left;
      display: inherit;
    }
  }

  .games {
    overflow: auto;
    padding: 0.5rem 0;
    width: 100%;
    display: -webkit-box;
  }
`;

const Game = styled.div`
  width: 220px;
  margin-right: 1.5rem;
  .game {
    cursor: pointer;
    width: 100%;
    height: 305px;
    border-radius: 15px;
    position: relative;
    background-image: url("${(props) => props.image}");
    background-size: cover;
    background-position: center;

    &-content {
      width: 100%;
      height: 100%;
      background-color: ${(props) =>
        props.disabled ? props.theme.basic.default : "initial"};
      overflow-y: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 15px;
    }

    &-soon {
      visibility: ${(props) => (props.disabled ? "visible" : "hidden")};
      font-weight: 500;
      font-size: 20px;
    }
  }

  .game-name {
    width: 100%;
    margin: 0.5rem 0;
    font-weight: 600;
    font-size: 18px;
    text-align: center;
  }
`;
