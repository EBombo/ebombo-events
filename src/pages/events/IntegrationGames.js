import React, {useGlobal, useState} from "reactn";
import styled from "styled-components";
import {config, firestore} from "../../firebase";
import {ButtonBombo} from "../../components";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import {mediaQuery} from "../../styles/constants";
import {Icon} from "../../components/common/Icons";
import {lazy, Suspense} from "react";
import {spinLoader} from "../../utils";
import {ModalContainer} from "../../components/common/ModalContainer";

const EditIntegrationGame = lazy(() => import("./EditIntegrationGame"));

export const IntegrationGames = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [currentGame, setCurrentGame] = useState({});

  return (
      <IntegrationSection id="games">
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <Suspense fallback={spinLoader()}>
            <EditIntegrationGame
              setIsVisibleModal={setIsVisibleModal}
              isVisibleModal={isVisibleModal}
              currentGame={currentGame}
              {...props}
            />
          </Suspense>
        </ModalContainer>
      )}
      <div className="main-container">
        <div className="title">JUEGOS DE INTEGRACIÓN</div>
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
            {defaultTo(get(props, "events.integrationGames"), []).map(
              (game) => (
                <GameContent
                  backgroundColor={game.backgroundColor}
                  borderColor={game.borderColor}
                  backgroundImage={game.backgroundImageUrl}
                  key={game.name}
                >
                  <div className="the-card">
                    <div className="front">
                      <div className="name">{game.name}</div>
                    </div>
                    <div className="back">
                      <div className="name">{game.name}</div>
                      <div className="description">{game.description}</div>
                    </div>
                  </div>
                  {get(authUser, "isAdmin") && (
                    <div className="container-edit">
                      <Icon
                        className="icon"
                        type="edit"
                        onClick={() => {
                          setCurrentGame(game);
                          setIsVisibleModal(true);
                        }}
                      />
                      <Icon
                        className="icon-delete"
                        type="delete"
                        onClick={() => {
                          props.deleteElement(game, "integrationGames");
                        }}
                      />
                    </div>
                  )}
                </GameContent>
              )
            )}
            {get(authUser, "isAdmin") && (
              <ButtonBombo
                type="action"
                onClick={() => {
                  setCurrentGame({
                    id: firestore.collection("events").doc().id,
                  });
                  setIsVisibleModal(true);
                }}
              >
                Añadir
              </ButtonBombo>
            )}
          </div>
        </div>
      </div>
    </IntegrationSection>
  );
};

const IntegrationSection = styled.section`
  padding: 1rem;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-image: url(${config.storageUrl + "/resources/b2bLanding/3.png"});
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
      text-align: left;
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
      text-align: center;
      .games-container {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        margin: 1rem 0;
      }
    }
  }
`;

const GameContent = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 21px;
  margin: 0 1rem;
  filter: drop-shadow(0px 0px 10px ${(props) => props.borderColor});

  .the-card {
    position: absolute;
    border-radius: 21px;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: all 0.5s ease;

    .front {
      position: absolute;
      border-radius: 21px;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background-repeat: no-repeat;
      background-position: center;
      background-size: cover;
      background-image: url(${(props) => props.backgroundImage});
      color: ${(props) => props.theme.basic.white};
      border: 3px solid ${(props) => props.borderColor};
      .name {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-radius: 18px;
        font-weight: 900;
        font-size: 25px;
        line-height: 29px;
        background: ${(props) => `${props.backgroundColor}90`};
      }
    }
    .back {
      position: absolute;
      border-radius: 21px;
      width: 200px;
      height: 200px;
      backface-visibility: hidden;
      background: ${(props) => props.backgroundColor};
      color: ${(props) => props.theme.basic.white};
      transform: rotateY(180deg);
      border: 3px solid ${(props) => props.borderColor};
      padding: 0.5rem;
      .name {
        text-align: center;
        font-weight: bold;
        font-size: 12px;
        line-height: 15px;
        border-bottom: 1px solid ${(props) => props.theme.basic.white};
      }
      .description {
        margin-top: 0.5rem;
        font-size: 12px;
        line-height: 15px;
        text-align: center;
      }
    }
  }

  .the-card:hover {
    transform: rotateY(180deg);
  }

  .container-edit {
    position: absolute;
    width: 25px;
    height: 25px;
    cursor: pointer;
    top: 0;
    right: -11px;
    svg {
      width: 20px;
      height: 20px;
      color: ${(props) => props.theme.basic.white};
    }
    .icon-delete {
      margin-top: 5px;
      svg {
        color: ${(props) => props.theme.basic.danger};
      }
    }
  }
`;
