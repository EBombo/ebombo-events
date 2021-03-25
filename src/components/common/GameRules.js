import React, {useGlobal} from "reactn";
import styled from "styled-components";
import get from "lodash/get";

export const GameRules = (props) => {
  const [games] = useGlobal("games");

  const findGame = () => games.find((game) => game.id === props.gameId);

  return (
    <Container {...props}>
      <div
        dangerouslySetInnerHTML={{
          __html: get(findGame(), "gameRule", "Sin reglas").replace(
            /\r?\n/g,
            "<br />"
          ),
        }}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 0.5rem;
  background: ${(props) =>
    props.background ? props.background : "transparent"};
  border-radius: 5px;

  .title {
    font-weight: 600;
    font-size: 17px;
    margin-bottom: 0.5rem;
  }

  .subtitle {
    font-weight: 600;
    font-size: 15px;
    margin: 0.5rem 0;
  }

  .description {
    margin-bottom: 1rem;

    ul:nth-of-type(1) {
      list-style-position: inside;
      padding: 0;
    }
  }
`;
