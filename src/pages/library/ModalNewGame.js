import React, { useGlobal, useState } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../components/common/ModalContainer";
import { ButtonAnt } from "../../components/form";
import { darkTheme } from "../../theme";
import { sizes } from "../../constants";
import { useSendError } from "../../hooks";
import { firestore } from "../../firebase";
import { useRouter } from "next/router";

const imageUrl =
  "https://mk0snacknation9jc4nw.kinstacdn.com/wp-content/uploads/2020/08/27-Virtual-Trivia-Ideas-For-People-Who-Know-Facts-And-Nothing-Else-copy.png";

export const ModalNewGame = (props) => {
  const router = useRouter();
  const { folderId } = router.query;

  const [games] = useGlobal("games");
  const [authUser] = useGlobal("user");
  const { sendError } = useSendError();
  const [isLoading, setIsLoading] = useState(false);

  const fetchParent = async () => {
    if (!folderId) return null;
    const parentRef = await firestore.collection("folders").doc(folderId).get();
    return parentRef.data();
  };

  const createGameToPlay = async (game) => {
    try {
      setIsLoading(true);
      const gameToPlayRef = firestore.collection("gamesToPlay");
      const newGameToPlayId = gameToPlayRef.doc().id;

      const parent = await fetchParent();

      await gameToPlayRef.doc(newGameToPlayId).set(
        {
          id: newGameToPlayId,
          createAt: new Date(),
          updateAt: new Date(),
          deleted: false,
          parent,
          game,
          description: "...",
          imageUrl,
          user: authUser,
          usersIds: [authUser?.id],
        },
        { merge: true }
      );

      props.fetchGames && props.fetchGames();
    } catch (error) {
      console.error(error);
      sendError(error, "createGameToPlay");
    }
    props.setIsVisibleModalGame(false);
    setIsLoading(false);
  };

  return (
    <ModalContainer
      footer={null}
      closable={false}
      visible={props.isVisibleModalGame}
      padding={"1rem"}
      top="30%"
      background={darkTheme.basic.whiteLight}
      onCancel={() => props.setIsVisibleModalGame(!props.isVisibleModalGame)}
    >
      <NewGameContainer>
        <div className="title">Crear un nuevo juego</div>
        <div className="games">
          {games.map((game) => (
            <div className="game" key={game.id}>
              <div className="title-game">{game.name}</div>
              <ButtonAnt
                margin="5px auto"
                onClick={() => createGameToPlay(game)}
                disabled={isLoading}
                loading={isLoading}
              >
                CREAR
              </ButtonAnt>
            </div>
          ))}
        </div>
        <ButtonAnt
          margin="20px auto auto auto"
          variant="contained"
          color="gray"
          size="big"
          disabled={isLoading}
          onClick={() => props.setIsVisibleModalGame(false)}
        >
          Cerrar
        </ButtonAnt>
      </NewGameContainer>
    </ModalContainer>
  );
};

const NewGameContainer = styled.div`
  .title {
    font-weight: bold;
    font-size: ${sizes.font.normal};
    color: ${(props) => props.theme.basic.black};
    border-bottom: 1px solid ${(props) => props.theme.basic.black};
    margin: auto 10px;
  }

  .games {
    font-weight: bold;
    font-size: ${sizes.font.normal};
    color: ${(props) => props.theme.basic.black};
    margin: auto 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;

    .game {
      text-align: center;
      border-radius: 5px;
      margin: 10px;
      box-shadow: 0 0 5px ${(props) => props.theme.basic.black};

      .title-game {
        border-radius: 5px 5px 0 0;
        padding: 10px;
        color: ${(props) => props.theme.basic.white};
        background: ${(props) => props.theme.basic.black};
      }
    }
  }
`;
