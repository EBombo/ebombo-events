import React, { useEffect, useState } from "reactn";
import { Divider, List, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { FileUpload } from "../../../components/common/FileUpload";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import styled from "styled-components";
import { mediaQuery, sizes } from "../../../constants";
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
    router.prefetch("/admin/games/[gameId]");
  }, []);

  useEffect(() => {
    const fetchGame = async () => {
      const gamesRef = await firestore
        .collection("games")
        .where("deleted", "==", false)
        .where("isGameToPlay", "==", true)
        .get();

      const games_ = snapshotToArray(gamesRef);
      const sortGames = orderBy(games_, ["updateAt"], ["desc"]);

      setGames(sortGames);
      setLoading(false);
    };

    fetchGame();
  }, []);

  const saveImage = async (gameId, url) => await firestore.doc(`games/${gameId}`).update({ coverUrl: url });

  const deleteGames = async (gameId) => await firestore.doc(`games/${gameId}`).update({ deleted: true });

  if (loading) return spinLoader();

  return (
    <GamesContainerCss>
      <div>
        <div className="title">Juegos</div>
        <ButtonAnt onClick={() => router.push("/admin/games/new")}>CREAR JUEGO</ButtonAnt>

        <Divider />
        <List
          itemLayout="vertical"
          size="large"
          dataSource={games}
          renderItem={(game) => (
            <List.Item
              style={{
                cursor: "pointer",
                display: "flex",
                padding: "0",
                margin: "0",
              }}
              actions={[
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                >
                  <Tooltip title={"Editar juego"}>
                    <EditOutlined
                      onClick={() => router.push(`/admin/games/${game.id}`)}
                      style={{ color: "gray", fontSize: "24px" }}
                    />
                  </Tooltip>
                  <Tooltip title={"Eliminar juego"}>
                    <DeleteOutlined
                      onClick={() => deleteGames(game.id)}
                      style={{ color: "#fe008f", fontSize: "24px" }}
                    />
                  </Tooltip>
                </div>,
              ]}
            >
              {
                <div style={{ width: "100%" }}>
                  <div className="game" key={game.id} onClick={() => router.push(`/admin/games/${game.id}`)}>
                    {game.title.toUpperCase()}
                  </div>

                  <span>{game?.typeGame?.name}</span>

                  <div
                    className="content-uploads"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "auto",
                      maxWidth: "90%",
                      flexWrap: "wrap",
                      padding: "1rem 0",
                    }}
                  >
                    <FileUpload
                      file={get(game, `coverUrl`, null)}
                      fileName="coverUrl"
                      filePath={`admingGames/${game.id}`}
                      preview={true}
                      sizes="250x250"
                      afterUpload={(imageUrls) => saveImage(game.id, imageUrls[0].url)}
                      style={{ bordarRadius: "4px" }}
                    />
                  </div>
                </div>
              }
            </List.Item>
          )}
        />
      </div>
    </GamesContainerCss>
  );
};

const GamesContainerCss = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 1rem auto;
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

  ${mediaQuery.afterTablet} {
    .title {
      font-size: 20px;
      line-height: 24px;
    }
  }
`;
