import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { ButtonBombo, Image } from "../../components";
import defaultTo from "lodash/defaultTo";
import { config } from "../../firebase";
import { mediaQuery } from "../../styles/constants";
import { Desktop } from "../../utils";

export const EsportsGames = (props) => {
  const [games] = useGlobal("games");

  return (
    <EsportsSection>
      <div className="main-container">
        <div className="title">JUEGOS DE ESPORTS</div>
        <div className="description">
          Los E-sports son muy conocidos y jugados hoy en día en todo el mundo.
          Nosotros damos la posibilidad de organizar torneos y competencias para
          sus colaboradores con populares juegos como: Fifa21, Call of Duty,
          Dota2 y mucho más.
          <br />
          ¡Prepárate para lucir tu lado gamer con ebomboevents!
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
        <Desktop>
          <div className="blue-planet">
            <Image
              src={`${config.storageUrl}/landing/blue-planet.svg`}
              height={"100%"}
              width={"100%"}
            />
          </div>
        </Desktop>
      </div>
      <BackgroundLine src={`${config.storageUrl}/landing/green-line.svg`} />
    </EsportsSection>
  );
};

const EsportsSection = styled.section`
  padding: 1rem;
  width: 100%;
  background: transparent;
  position: relative;

  ${mediaQuery.afterTablet} {
    padding: 2rem;
  }

  .main-container {
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 999;

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
      margin-left: 2rem;

      ${mediaQuery.afterTablet} {
        font-size: 20px;
        line-height: 25px;
        text-align: center;
      }
    }

    .integration-games {
      max-width: 100%;
      overflow: auto;
      position: relative;
      z-index: 2;

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

    .blue-planet {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 200px;
      height: auto;
      z-index: 1;
      transform: translate(50%, 50%);
    }
  }
`;

const BackgroundLine = styled.div`
  position: absolute;
  top: 0%;
  left: 0;
  width: 70%;
  height: 110%;
  background-image: url(${(props) => props.src});
  background-size: 250%;
  background-repeat: no-repeat;
  z-index: 0;
  background-position: 75% 0%;

  ${mediaQuery.afterTablet} {
    top: 18%;
    right: 0;
    width: 40%;
    background-size: 140%;
    background-position: 100% 0%;
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
