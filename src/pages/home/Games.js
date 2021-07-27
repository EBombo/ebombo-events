import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { firestore } from "../../firebase";
import { ButtonAnt } from "../../components/form";
import { Carousel } from "../../components/common/Carousel";
import { ModalContainer } from "../../components/common/ModalContainer";
import { Icon } from "../../components/common/Icons";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import chunk from "lodash/chunk";
import { mediaQuery } from "../../constants";
import { Desktop, Tablet } from "../../constants";

import EditGame from "./EditGame";

export const Games = (props) => {
  const [authUser] = useGlobal("user");
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [currentGame, setCurrentGame] = useState({});
  const [active, setActive] = useState("integration");

  const contentCarousel = (arrElements) => (
    <div>
      {arrElements.map((ele) => (
        <GameContent backgroundImage={ele.backgroundImageUrl} key={ele.name}>
          <div className="thumb">
            <div className="mask" />
          </div>
          <div className="details">
            <div className="name">{ele.name}</div>
            <div className="description">{ele.description}</div>
          </div>
          {get(authUser, "isAdmin") && (
            <div className="container-edit">
              <Icon
                className="icon"
                type="edit"
                onClick={() => {
                  setCurrentGame(ele);
                  setIsVisibleModal(true);
                }}
              />
              <Icon
                className="icon-delete"
                type="delete"
                onClick={() => {
                  props.deleteElement(ele, "integrationGames");
                }}
              />
            </div>
          )}
        </GameContent>
      ))}
    </div>
  );

  return (
    <IntegrationSection ref={props.refProp}>
      {isVisibleModal && get(authUser, "isAdmin") && (
        <ModalContainer
          footer={null}
          visible={isVisibleModal}
          onCancel={() => setIsVisibleModal(!isVisibleModal)}
        >
          <EditGame
            setIsVisibleModal={setIsVisibleModal}
            isVisibleModal={isVisibleModal}
            currentGame={currentGame}
            active={active}
            {...props}
          />
        </ModalContainer>
      )}
      <div className="tabs-container">
        <div className="integration-games">
          <div
            className={`name ${active === "integration" ? "active" : ""}`}
            onClick={() => setActive("integration")}
          >
            Integración
          </div>
        </div>
        <div className="esports-games">
          <div
            className={`name ${active === "esports" ? "active" : ""}`}
            onClick={() => setActive("esports")}
          >
            e-sports
          </div>
        </div>
      </div>

      <Desktop>
        <div className="wrapper">
          {defaultTo(
            active === "integration"
              ? get(props, "events.integrationGames")
              : get(props, "events.esportsGames"),
            []
          ).map((game) => (
            <GameContent
              backgroundImage={game.backgroundImageUrl}
              key={game.name}
            >
              <div className="thumb">
                <div className="mask" />
              </div>
              <div className="details">
                <div className="name">{game.name}</div>
                <div className="description">{game.description}</div>
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
          ))}
          {get(authUser, "isAdmin") && (
            <ButtonAnt
              variant="outlined"
              color="action"
              onClick={() => {
                setCurrentGame({
                  id: firestore.collection("events").doc().id,
                });
                setIsVisibleModal(true);
              }}
            >
              Añadir
            </ButtonAnt>
          )}
        </div>
      </Desktop>
      <Tablet>
        {
          <Carousel
            components={chunk(
              defaultTo(
                active === "integration"
                  ? get(props, "home.integrationGames")
                  : get(props, "home.esportsGames"),
                []
              ),
              2
            ).map((arr) => contentCarousel(arr))}
            position={"center"}
          />
        }
      </Tablet>
    </IntegrationSection>
  );
};

const IntegrationSection = styled.section`
  width: 100%;
  background: ${(props) => props.theme.basic.white};
  position: relative;
  position: relative;

  .title {
    font-weight: bold;
    font-size: 15px;
    line-height: 19px;
    color: ${(props) => props.theme.basic.white};
    margin-bottom: 1rem;
  }

  .tabs-container {
    height: 90px;
    width: 100%;
    background: ${(props) => props.theme.basic.secondary};
    display: grid;
    grid-template-columns: repeat(2, 50%);
    align-items: center;
    .integration-games,
    .esports-games {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;

      .name {
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0.5rem;
        font-style: normal;
        font-weight: bold;
        font-size: 15px;
        line-height: 19px;
        color: ${(props) => props.theme.basic.white};
        cursor: pointer;
      }

      .active {
        color: ${(props) => props.theme.basic.primary};
        border-bottom: 3px solid ${(props) => props.theme.basic.primary};
      }
    }
  }

  .wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 25px;
      line-height: 31px;
    }

    .integration-games,
    .esports-games {
      .name {
        font-size: 28px;
        line-height: 35px;
      }
    }
  }
`;

const GameContent = styled.div`
  position: relative;
  overflow: hidden;
  height: 340px;
  background-image: url(${(props) => props.backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  .thumb {
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    .mask {
      background: rgba(75, 191, 135, 0.67);
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      height: 100%;
      width: 100%;
      transition: all 0.3s ease-in-out;
    }
  }
  .details {
    color: ${(props) => props.theme.basic.white};
    position: absolute;
    height: 100%;
    width: 100%;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .name {
      text-align: center;
      font-style: normal;
      font-weight: bold;
      font-size: 40px;
      line-height: 50px;
    }

    .description {
      padding: 0.5rem;
      font-style: normal;
      font-weight: normal;
      font-size: 17px;
      line-height: 21px;
      text-align: center;
      opacity: 0;
    }
  }

  &:hover {
    .mask {
      opacity: 1;
    }
    .description {
      opacity: 1;
    }
  }

  .container-edit {
    position: absolute;
    height: 15px;
    cursor: pointer;
    top: 0;
    right: 0;
    display: flex;
    z-index: 3;

    svg {
      width: 15px;
      height: 15px;
      color: ${(props) => props.theme.basic.action};
    }

    .icon-delete {
      margin-left: 5px;

      svg {
        color: ${(props) => props.theme.basic.danger};
      }
    }
  }

  ${mediaQuery.afterTablet} {
    height: 300px;
  }
`;
