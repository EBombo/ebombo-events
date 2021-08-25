import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { ModalContainer } from "../../components/common/ModalContainer";
import { ButtonAnt } from "../../components/form";
import { darkTheme } from "../../theme";
import { sizes } from "../../constants";
import { useRouter } from "next/router";

export const ModalNewGame = (props) => {
  const router = useRouter();
  const { folderId } = router.query;
  const [games] = useGlobal("resources");

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
                onClick={() => {
                  folderId
                    ? router.push(
                        `/library/games/new?resourceId=${game.id}&folderId=${folderId}`
                      )
                    : router.push(`/library/games/new?resourceId=${game.id}`);
                }}
              >
                CREAR
              </ButtonAnt>
            </div>
          ))}
        </div>
        <ButtonAnt
          margin="20px auto auto auto"
          variant="contained"
          color="default"
          size="big"
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
