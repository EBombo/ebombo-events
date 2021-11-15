import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useRouter } from "next/router";
import { Desktop, mediaQuery, Tablet } from "../../../../../constants";
import { Image } from "../../../../../components/common/Image";
import { CloseCircleOutlined } from "@ant-design/icons";
import { config, firestoreBingo } from "../../../../../firebase";
import { ButtonAnt } from "../../../../../components/form";
import { darkTheme } from "../../../../../theme";
import { Tooltip } from "antd";
import { bingoCard } from "../../../../../components/common/DataList";
import { CardContainer } from "../Bingo";
import { spinLoader } from "../../../../../components/common/loader";
import { ModalMove } from "../../../../../components/common/ModalMove";
import { updateGame } from "../index";
import { useSendError } from "../../../../../hooks";

// TODO: This component is long consider a refactoring.
export const GameView = (props) => {
  const router = useRouter();
  const { gameId, adminGameId, folderId } = router.query;

  const { sendError } = useSendError();

  const [authUser] = useGlobal("user");
  const [adminGames] = useGlobal("adminGames");
  const [games, setGames] = useGlobal("userGames");

  const [resource, setResource] = useState(null);
  const [isVisibleModalMove, setIsVisibleModalMove] = useState(false);

  const game = useMemo(() => {
    if (!gameId) return {};
    if (!games?.length) return {};

    const currentGame = games.find((game) => game.id === gameId);

    return currentGame ?? {};
  }, [games, gameId]);

  useEffect(() => {
    if (isEmpty(adminGames)) return;

    const currentResource = adminGames.find((resource_) => resource_.id === adminGameId);

    setResource(currentResource);
  }, [adminGames]);

  const redirectToGameViewWithFolder = (folderId) => {
    folderId
      ? router.push(`/library/games/${gameId}/view?adminGameId=${adminGameId}&folderId=${folderId}`)
      : router.push(`/library/games/${gameId}/view?adminGameId=${adminGameId}`);
  };

  const moveGameToFolder = async (folder) => {
    if (!game) return;

    try {
      await updateGame(game.adminGame, { id: game.id, parentId: folder?.id }, authUser);

      redirectToGameViewWithFolder(folder?.id);
    } catch (error) {
      await sendError(error);
    }
  };

  const deleteGame = async () => {
    let newGames = games;
    const gameIndex = newGames.findIndex((game) => game.id === props.game.id);
    newGames.splice(gameIndex, 1);
    setGames(newGames);

    try {
      await firestoreBingo.doc(`games/${game.id}`).update({
        deleted: true,
      });
    } catch (error) {
      console.error(error);
      sendError(error, "deleteGame");
    }
  };

  const showBingoCard = () => (
    <CardContainer
      backgroundColor={get(game, "backgroundColor", "")}
      backgroundImage={get(game, "backgroundImg", "")}
      titleColor={get(game, "titleColor", "")}
      blocksColor={get(game, "blocksColor", "")}
      numberColor={get(game, "numberColor", "")}
    >
      <ModalMove
        moveToFolder={moveGameToFolder}
        setIsVisibleModalMove={setIsVisibleModalMove}
        isVisibleModalMove={isVisibleModalMove}
        {...props}
      />
      <div className="card-title">{get(game, "title", "")}</div>
      <table>
        <thead className="thead">
          <tr>
            <th>{get(game, "letters.b", "")}</th>
            <th>{get(game, "letters.i", "")}</th>
            <th>{get(game, "letters.n", "")}</th>
            <th>{get(game, "letters.g", "")}</th>
            <th>{get(game, "letters.o", "")}</th>
          </tr>
        </thead>
        <tbody className="tbody">
          {bingoCard.map((arrNums, index) => (
            <tr key={`key-${index}`}>
              {arrNums.map((num, idx) => (
                <td key={`key-${num}-${idx}`}>{num}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </CardContainer>
  );

  const createTokenToPlay = async () => {
    try {
      const gameName = game.adminGame.name.toLowerCase();
      const redirectUrl = `${config.bomboGamesUrl}/${gameName}/lobbies/new?gameId=${game.id}&userId=${authUser?.id}`;

      window.open(redirectUrl, "blank");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleFavorite = async () => {
    let newGames = games;
    const gameIndex = newGames.findIndex((game) => game.id === game.id);

    newGames[gameIndex].isFavorite = !get(newGames[gameIndex], "isFavorite", false);

    setGames(newGames);

    try {
      await Fetch(`${resource.domain}/api/games/${game.id}/users/${authUser.id}`, "PUT", {
        isFavorite: newGames[gameIndex].isFavorite,
      });
    } catch (error) {
      await sendError(error, "createGame");
    }
  };

  if (!game) return spinLoader();

  return (
    <GameViewContainer>
      <Tablet>
        <div className="cover-container">
          <Image
            src={game.coverImgUrl ? game.coverImgUrl : `${config.storageUrl}/resources/empty-cover.svg`}
            width="100%"
            height="100px"
            size="cover"
          />
          <div className="close">
            <CloseCircleOutlined onClick={() => router.back()} />
          </div>
        </div>
        <div className="game-details">
          <div className="name">{get(game, "title", "")}</div>
          <div className="reproductions">
            <div className="times-played">
              <Image
                src={`${config.storageUrl}/resources/purple-play.svg`}
                height="19px"
                width="19px"
                size="contain"
                margin="0 5px 0 0"
              />
              {get(game, "timesPlayed", 0)}
            </div>
            <div className="amount-numbers">
              <Image
                src={`${config.storageUrl}/resources/amount.svg`}
                height="19px"
                width="19px"
                size="contain"
                margin="0 5px 0 0"
              />
              {get(game, "amountNumbers", 75)}
            </div>
          </div>
        </div>
        <div className="actions-container">
          <div className="left-container">
            <ButtonAnt variant="contained" color="default">
              Ver juegos pasados
            </ButtonAnt>
          </div>
          <div className="right-container">
            <div
              className="edit"
              onClick={() => {
                folderId
                  ? router.push(`/library/games/${game.id}?adminGameId=${adminGameId}&folderId=${folderId}`)
                  : router.push(`/library/games/${game.id}?adminGameId=${adminGameId}`);
              }}
            >
              <Image
                src={`${config.storageUrl}/resources/pencil.svg`}
                height="18px"
                width="18px"
                size="contain"
                margin="0 5px 0 0"
              />
            </div>
            <Tooltip
              placement="bottomRight"
              trigger="click"
              title={
                <ToolTipContent>
                  <div className="option" onClick={() => setIsVisibleModalMove(true)}>
                    <Image
                      src={`${config.storageUrl}/resources/move.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    Mover
                  </div>
                  <div className="option">
                    <Image
                      src={`${config.storageUrl}/resources/duplicate.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    Duplicar
                  </div>
                  <div className="option" onClick={() => deleteGame()}>
                    <Image
                      src={`${config.storageUrl}/resources/delete.svg`}
                      width={"16px"}
                      height={"16px"}
                      size={"contain"}
                      margin={"0 15px 0 0"}
                    />
                    Borrar
                  </div>
                </ToolTipContent>
              }
              color={darkTheme.basic.whiteLight}
            >
              <div className="more-actions">
                <div />
                <div />
                <div />
              </div>
            </Tooltip>
          </div>
        </div>
      </Tablet>
      <Desktop>
        <div className="left-container-desktop">
          <Image
            src={game.coverImgUrl ? game.coverImgUrl : `${config.storageUrl}/resources/empty-cover.svg`}
            width="100%"
            height="194px"
            size="cover"
          />
          <div className="name">{get(game, "name", "")}</div>

          <div className="actions-container">
            <div className="btns-container">
              <ButtonAnt
                color="secondary"
                margin="0 1rem"
                onClick={() => {
                  get(props, "game.parentId", null)
                    ? router.push(`/library/games/${game.id}?adminGameId=${adminGameId}&folderId=${folderId}`)
                    : router.push(`/library/games/${game.id}?adminGameId=${adminGameId}`);
                }}
              >
                Editar
              </ButtonAnt>
              <ButtonAnt variant="contained" color="primary" onClick={createTokenToPlay}>
                Jugar
              </ButtonAnt>
            </div>
            <div className="more-actions">
              {game.isFavorite ? (
                <Image
                  src={`${config.storageUrl}/resources/yellow-star.svg`}
                  width="20px"
                  height="20px"
                  className="icon"
                  margin="0 10px 0 0"
                  onClick={() => toggleFavorite()}
                />
              ) : (
                <Image
                  src={`${config.storageUrl}/resources/star.svg`}
                  width="20px"
                  height="20px"
                  className="icon"
                  margin="0 10px 0 0"
                  onClick={() => toggleFavorite()}
                />
              )}
              <Tooltip
                placement="bottomRight"
                trigger="click"
                title={
                  <ToolTipContent>
                    <div className="option" onClick={() => setIsVisibleModalMove(true)}>
                      <Image
                        src={`${config.storageUrl}/resources/move.svg`}
                        width={"16px"}
                        height={"16px"}
                        size={"contain"}
                        margin={"0 15px 0 0"}
                      />
                      Mover
                    </div>
                    <div className="option">
                      <Image
                        src={`${config.storageUrl}/resources/duplicate.svg`}
                        width={"16px"}
                        height={"16px"}
                        size={"contain"}
                        margin={"0 15px 0 0"}
                      />
                      Duplicar
                    </div>
                    <div className="option" onClick={() => deleteGame()}>
                      <Image
                        src={`${config.storageUrl}/resources/delete.svg`}
                        width={"16px"}
                        height={"16px"}
                        size={"contain"}
                        margin={"0 15px 0 0"}
                      />
                      Borrar
                    </div>
                  </ToolTipContent>
                }
                color={darkTheme.basic.whiteLight}
              >
                <div className="more">
                  <div />
                  <div />
                  <div />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </Desktop>
      <div>
        <div className="subtitle">Cartilla</div>
        <div className="specifications">
          <div>
            <Desktop>
              <div className="description">Descripcción:</div>
              <div className="amount-numbers">1- {get(game, "amountNumbers", 75)} números</div>
            </Desktop>
            <div className="left-container">
              <div className="color">
                <div className="label">Fondo</div>
                {get(game, "backgroundImg", null) ? (
                  <div className="name">(Imagen)</div>
                ) : (
                  <div className="name">
                    <ColorBlock color={get(game, "backgroundColor", "")} />
                    {get(game, "backgroundColor", "").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="color">
                <div className="label">Bloques</div>
                <div className="name">
                  <ColorBlock color={get(game, "blocksColor", "")} />
                  {get(game, "blocksColor", "").toUpperCase()}
                </div>
              </div>
              <div className="color">
                <div className="label">Título</div>
                <div className="name">
                  <ColorBlock color={get(game, "titleColor", "")} />
                  {get(game, "titleColor", "").toUpperCase()}
                </div>
              </div>
              <div className="color">
                <div className="label">Números</div>
                <div className="name">
                  <ColorBlock color={get(game, "numberColor", "")} />
                  {get(game, "numberColor", "").toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="right-container">{showBingoCard()}</div>
        </div>
        <Tablet>
          <div className="btn-container">
            <ButtonAnt onClick={createTokenToPlay}>Jugar</ButtonAnt>
          </div>
        </Tablet>
      </div>
    </GameViewContainer>
  );
};

const ColorBlock = styled.div`
  width: 29px;
  height: 36px;
  background: ${(props) => (props.color ? props.color : props.theme.basic.whiteLight)};
  border: 1px solid ${(props) => props.theme.basic.grayLight};
  box-sizing: border-box;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
`;

const GameViewContainer = styled.div`
  width: 100%;

  .btn-container {
    width: 100%;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;

    button {
      padding: 5px 40px !important;
    }
  }

  .specifications {
    padding: 0.5rem;
    display: grid;
    grid-template-columns: 120px auto;
    grid-gap: 1rem;

    .left-container {
      .color {
        .label {
          font-family: Lato;
          font-style: normal;
          font-weight: 500;
          font-size: 13px;
          line-height: 16px;
          color: ${(props) => props.theme.basic.grayLight};
          margin: 0.5rem 0;
        }

        .name {
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          font-family: Encode Sans;
          font-style: normal;
          font-weight: bold;
          font-size: 13px;
          line-height: 16px;
          color: ${(props) => props.theme.basic.grayLight};
        }
      }
    }

    .right-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .cover-container {
    position: relative;

    .close {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;

      svg {
        font-size: 20px;
      }
    }
  }

  .game-details {
    background: ${(props) => props.theme.basic.whiteLight};
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

    .name {
      font-family: Lato;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 18px;
      padding: 0.5rem;
      border-bottom: 0.5px solid rgba(102, 102, 102, 0.1);
    }

    .reproductions {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem;

      .times-played {
        display: flex;
        align-items: center;
        margin-right: 20px;
      }

      .amount-numbers {
        display: flex;
        align-items: center;
      }
    }
  }

  .actions-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;

    .right-container {
      display: flex;
      align-items: center;

      .edit,
      .more-actions {
        width: 48px;
        height: 36px;
        background: ${(props) => props.theme.basic.whiteLight};
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .more-actions {
        flex-direction: column;
        justify-content: space-evenly;
        margin-left: 10px;

        div {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: ${(props) => props.theme.basic.black};
        }
      }
    }
  }

  .subtitle {
    padding: 0.5rem;
    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.grayLight};
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 350px auto;

    .left-container-desktop {
      height: calc(100vh - 50px);
      background: ${(props) => props.theme.basic.whiteLight};

      .name {
        padding: 1rem;
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 29px;
        color: ${(props) => props.theme.basic.blackDarken};
      }

      .actions-container {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .btns-container {
          display: flex;
          align-items: center;
        }

        .more-actions {
          display: flex;
          align-items: center;

          .more {
            height: 18px;
            display: flex;
            justify-content: space-evenly;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            padding: 0 5px;

            div {
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: ${(props) => props.theme.basic.black};
            }
          }
        }
      }
    }

    .subtitle {
      padding: 2rem;
    }

    .specifications {
      padding: 0 2rem;
      display: grid;
      grid-template-columns: 250px auto;
      grid-gap: 1rem;

      .description {
        font-family: Lato;
        font-style: normal;
        font-weight: bold;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.grayLight};
      }

      .amount-numbers {
        display: flex;
        align-items: center;
        padding: 0.5rem 0;
        font-family: Lato;
        font-style: normal;
        font-size: 13px;
        line-height: 16px;
        color: ${(props) => props.theme.basic.grayLight};
      }

      .left-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-gap: 1rem;
        height: 200px;
      }

      .right-container {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
`;

const ToolTipContent = styled.div`
  background: ${(props) => props.theme.basic.whiteLight};
  box-sizing: border-box;
  color: ${(props) => props.theme.basic.grayLight};

  .option {
    display: flex;
    align-items: center;
    font-family: Lato;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 19px;
    padding: 0.5rem;
    cursor: pointer;
  }
`;
