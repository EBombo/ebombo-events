import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { sizes } from "../../../constants";
import { useRouter } from "next/router";
import { ButtonAnt } from "../../../components/form";
import { firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import { spinLoader } from "../../../components/common/loader";

export const GamesContainer = () => {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      const gamesRef = await firestore
        .collection("games")
        .where("deleted", "==", false)
        .get();

      setGames(snapshotToArray(gamesRef));
      setLoading(false);
    };

    fetchGame();
  }, []);

  return (
    <GamesContainerCss>
      <div className="title">GAMES</div>
      {loading
        ? spinLoader()
        : games.map((game) => (
            <div
              className="game"
              key={game.id}
              onClick={() => router.push(`/admin/games/${game.id}`)}
            >
              {game.name}
            </div>
          ))}

      <ButtonAnt onClick={() => router.push("/admin/games/new")}>
        CREAR JUEGO
      </ButtonAnt>
    </GamesContainerCss>
  );
};

const GamesContainerCss = styled.div`
  width: 100%;
  max-width: 300px;
  margin: auto;
  color: ${(props) => props.theme.basic.black};

  .title {
    text-align: center;
    font-size: ${sizes.font.normal};
  }

  .game {
    cursor: pointer;
    font-size: ${sizes.font.normal};
    color: ${(props) => props.theme.basic.primary};
  }
`;
