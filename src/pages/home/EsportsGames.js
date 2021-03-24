import React, {useGlobal} from "reactn";
import styled from "styled-components";
import {ButtonBombo} from "../../components";
import defaultTo from "lodash/defaultTo";
import {config} from "../../firebase";
import {mediaQuery} from "../../styles/constants";

export const EsportsGames = (props) => {
  const [games] = useGlobal("games");

  return (
      <EsportsSection>
        <div className="main-container">
          <div className="title">JUEGOS DE ESPORTS</div>
          <div className="description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lacus egestas
            ut rhoncus eu euismod sed dictum porttitor ac. Vel mattis egestas
            consequat sed in magna quam adipiscing justo. Nisl sem feugiat duis
            enim. Aliquam scelerisque viverra erat felis vulputate donec. Sagittis
            quis ullamcorper
          </div>
          <a href="#contact">
            <ButtonBombo type="primary">Contactanos</ButtonBombo>
          </a>
          <div className="integration-games">
            <div className="games-container">
              {defaultTo(games, []).map((game) => (
                  <GameContent
                      borderColor={game.color}
                      backgroundImage={game.landingImageUrlThumb}
                      key={game.name}
                  >
                    <div className="name">{game.name}</div>
                  </GameContent>
              ))}
            </div>
          </div>
        </div>
      </EsportsSection>
  );
};

const EsportsSection = styled.section`
  padding: 1rem;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/4.png"});

  ${mediaQuery.afterTablet} {
    padding: 2rem;
  }

  .main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;

    .title {
      font-weight: bold;
      font-size: 15px;
      line-height: 19px;
      color: ${(props) => props.theme.basic.white};
      margin-bottom: 1rem;
      text-align: right;

      ${mediaQuery.afterTablet} {
        font-size: 25px;
        line-height: 31px;
      }
    }

    .description {
      font-weight: normal;
      font-size: 12px;
      line-height: 15px;
      color: ${(props) => props.theme.basic.white};
      text-align: right;
      margin-bottom: 1rem;

      ${mediaQuery.afterTablet} {
        font-size: 20px;
        line-height: 25px;
        text-align: center;
      }
    }

    .integration-games {
      max-width: 100%;
      overflow: auto;

      ::-webkit-scrollbar {
        height: 4px;
      }

      .games-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
      }
    }
  }
`;

const GameContent = styled.section`
  width: 150px;
  height: 250px;
  border-radius: 21px;
  margin: 0 1rem;
  filter: drop-shadow(0px 0px 10px ${(props) => props.borderColor});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${(props) => props.backgroundImage});
  border-radius: 10px;

  .name {
    border-radius: 10px;
    color: ${(props) => props.theme.basic.white};
    background: ${(props) => `${props.borderColor}30`};
    border: 3px solid ${(props) => props.borderColor};
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 900;
    font-size: 19px;
    line-height: 22px;
  }
`;
