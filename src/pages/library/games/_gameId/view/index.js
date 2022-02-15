import React, { useEffect, useGlobal, useMemo, useState } from "reactn";
import styled from "styled-components";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useRouter } from "next/router";
import { mediaQuery } from "../../../../../constants";
import { config } from "../../../../../firebase";
import { spinLoader } from "../../../../../components/common/loader";
import { updateGame } from "../index";
import { useSendError } from "../../../../../hooks";
import { useFetch } from "../../../../../hooks/useFetch";
import { BingoView } from "./BingoView";
import { HangedView } from "./HangedView";
import { SideBar } from "./SideBar";
import { RouletteView } from "./RouletteView";

// TODO: This component is long consider a refactoring.
export const GameView = (props) => {
  const router = useRouter();
  const { gameId, adminGameId, folderId } = router.query;

  const { Fetch } = useFetch();
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
    const gameIndex = newGames.findIndex((_game) => _game.id === game.id);
    newGames.splice(gameIndex, 1);
    setGames(newGames);

    try {
      await Fetch(`${resource.api}/games/${game.id}/users/${authUser.id}`, "DELETE");
      router.back();
    } catch (error) {
      await sendError(error, "deleteGame");
    }
  };

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
      <SideBar game={game} {...props} createTokenToPlay={createTokenToPlay} />
      {game?.adminGame?.name === "bingo" && (
        <BingoView
          game={game}
          moveGameToFolder={moveGameToFolder}
          setIsVisibleModalMove={setIsVisibleModalMove}
          isVisibleModalMove={isVisibleModalMove}
          createTokenToPlay={createTokenToPlay}
          toggleFavorite={toggleFavorite}
          deleteGame={deleteGame}
          {...props}
        />
      )}
      {game?.adminGame?.name === "hanged" && (
        <HangedView
          game={game}
          moveGameToFolder={moveGameToFolder}
          setIsVisibleModalMove={setIsVisibleModalMove}
          isVisibleModalMove={isVisibleModalMove}
          createTokenToPlay={createTokenToPlay}
          toggleFavorite={toggleFavorite}
          deleteGame={deleteGame}
          {...props}
        />
      )}
      {game?.adminGame?.name === "roulette" && (
        <RouletteView
          game={game}
          moveGameToFolder={moveGameToFolder}
          setIsVisibleModalMove={setIsVisibleModalMove}
          isVisibleModalMove={isVisibleModalMove}
          createTokenToPlay={createTokenToPlay}
          toggleFavorite={toggleFavorite}
          deleteGame={deleteGame}
          {...props}
        />
      )}
    </GameViewContainer>
  );
};

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
