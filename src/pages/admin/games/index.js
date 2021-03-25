import React, {useEffect, useState} from "reactn";
import {snapshotToArray, spinLoader} from "../../../utils";
import {Divider, List, Modal, Tooltip} from "antd";
import {firestore} from "../../../firebase";
import orderBy from "lodash/orderBy";
import {useHistory} from "react-router";
import {ButtonBombo, Upload} from "../../../components";
import {useAcl} from "../../../acl";
import {Icon} from "../../../components/common/Icons";

export const AdminGames = (props) => {
  const history = useHistory();
  const { Acl, AclLink } = useAcl();
  const [loadingGames, setLoadingGames] = useState(true);
  const [games, setGames] = useState([]);

  useEffect(() => {
    const unsubscribeGames = fetchGames();
    return () => unsubscribeGames();
  }, []);

  const gamesOrder = (games_) =>
    orderBy(games_, [(game_) => game_.updateAt.toDate()], ["desc"]);

  const fetchGames = () =>
    firestore
      .collection("games")
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setGames(gamesOrder(snapshotToArray(snapshot)));
        setLoadingGames(false);
      });

  const deleteGames = (game) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () =>
        firestore
          .collection("games")
          .doc(game.id)
          .set({ ...game, deleted: true }, { merge: true }),
    });

  const updateGameLandingImage = async (game_, gameId_) =>
    await firestore.doc(`games/${gameId_}`).set({ ...game_ }, { merge: true });

  return loadingGames ? (
    spinLoader()
  ) : (
    <div>
      <Acl name="/admin/games/new">
        <ButtonBombo
          margin="0"
          icon={<Icon type="plus-circle" />}
          className="button-primary"
          onClick={() => history.push("/admin/games/new")}
        >
          AGREGAR JUEGO
        </ButtonBombo>
      </Acl>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={gamesOrder(games)}
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
                <Acl name="/admin/games/:gameId">
                  <Tooltip title={"Editar liga"}>
                    <Icon
                      onClick={() => history.push(`/admin/games/${game.id}`)}
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
                <Acl name="/admin/games#delete">
                  <Tooltip title={"Eliminar juego"}>
                    <Icon
                      onClick={() => deleteGames(game)}
                      style={{ color: "#fe008f", fontSize: "24px" }}
                      type="delete"
                    />
                  </Tooltip>
                </Acl>
              </div>,
            ]}
          >
            {
              <div style={{ width: "100%" }}>
                <AclLink
                  name="/admin/games/:gameId/rules"
                  to={`/admin/games/${game.id}/rules`}
                >
                  <h3 style={{ margin: "0px" }} key={game.id}>
                    {game.name.toUpperCase()}
                  </h3>
                </AclLink>
                <div
                  className="content-uploads"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "auto",
                    maxWidth: "70%",
                    flexWrap: "wrap",
                  }}
                >
                  <Upload
                    isImage={true}
                    accept="image/*"
                    bucket="games"
                    filePath={`games/${game.id}`}
                    fileName="icon"
                    name="iconUrl"
                    buttonText="Subir Icono"
                    document={game}
                    afterUpload={(game_) =>
                      updateGameLandingImage(game_, game.id)
                    }
                    sizeResized="50x50"
                  />
                  <Upload
                    isImage={true}
                    accept="image/*"
                    bucket="games"
                    filePath={`games/${game.id}`}
                    fileName="landing"
                    name="landingImageUrl"
                    buttonText="Landing foto"
                    document={game}
                    afterUpload={(game_) =>
                      updateGameLandingImage(game_, game.id)
                    }
                    sizeResized="200x300"
                  />

                  <Upload
                    isImage={true}
                    accept="image/*"
                    bucket="games"
                    filePath={`games/${game.id}`}
                    fileName="home-mb"
                    name="homeImageMbUrl"
                    buttonText="Inicio Mobile"
                    document={game}
                    afterUpload={(game_) =>
                      updateGameLandingImage(game_, game.id)
                    }
                    sizeResized="580x260"
                  />
                  <Upload
                    isImage={true}
                    accept="image/*"
                    bucket="games"
                    filePath={`games/${game.id}`}
                    fileName="home-dsk"
                    name="homeImageDskUrl"
                    buttonText="Inicio Desktop"
                    document={game}
                    afterUpload={(game_) =>
                      updateGameLandingImage(game_, game.id)
                    }
                    sizeResized="1300x500"
                  />

                  <Upload
                    isImage={true}
                    accept="image/*"
                    bucket="games"
                    filePath={`games/${game.id}`}
                    fileName="history"
                    name="historyImageDskUrl"
                    buttonText="Historial"
                    document={game}
                    afterUpload={(game_) =>
                      updateGameLandingImage(game_, game.id)
                    }
                    sizeResized="566x102"
                  />
                </div>
              </div>
            }
          </List.Item>
        )}
      />
    </div>
  );
};
