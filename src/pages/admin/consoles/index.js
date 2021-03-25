import React, { useEffect, useState } from "react";
import { snapshotToArray, spinLoader } from "../../../utils";
import { Button, Divider, List, Modal, Tooltip } from "antd";
import { firestore } from "../../../firebase";
import orderBy from "lodash/orderBy";
import { useHistory } from "react-router";
import IconUpload from "./IconUpload";
import { useAcl } from "../../../acl";
import { Icon } from "../../../components/common/Icons";
import { ButtonBombo } from "../../../components";

export const AdminConsoles = (props) => {
  const history = useHistory();
  const { Acl } = useAcl();
  const [loadingConsoles, setLoadingConsole] = useState(true);
  const [consoles, setConsoles] = useState([]);

  useEffect(() => {
    const unsubscribeConsoles = fetchConsoles();
    return () => unsubscribeConsoles();
  }, []);

  const consolesOrder = (consoles_) =>
    orderBy(consoles_, [(console_) => console_.updateAt.toDate()], ["desc"]);

  const fetchConsoles = () =>
    firestore
      .collection("consoles")
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setConsoles(consolesOrder(snapshotToArray(snapshot)));
        setLoadingConsole(false);
      });

  const deleteConsoles = (console) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () => deleteConsole(console),
    });

  const deleteConsole = async (console) => {
    firestore
      .collection("consoles")
      .doc(console.id)
      .set({ ...console, deleted: true }, { merge: true });

    const gamesRef = await firestore
      .collection("games")
      .where("consoleIds", "array-contains", console.id)
      .get();

    const games_ = snapshotToArray(gamesRef);

    games_.map(
      async (game) =>
        await firestore
          .collection("games")
          .doc(game.id)
          .update({
            consoleIds: game.consoleIds.filter(
              (consoleId) => consoleId !== console.id
            ),
          })
    );
  };

  const consoles_ = () =>
    orderBy(
      consoles,
      [(console) => console.updateAt.toDate(), "name"],
      ["desc", "desc"]
    );

  if (loadingConsoles) return spinLoader();

  return (
    <div>
      <Acl name="/admin/consoles/new">
        <ButtonBombo
          margin="0"
          icon={<Icon type="plus-circle" />}
          onClick={() => history.push("/admin/consoles/new")}
        >
          AGREGAR CONSOLA
        </ButtonBombo>
      </Acl>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={consoles_()}
        renderItem={(console) => (
          <List.Item
            style={{ cursor: "pointer", display: "flex" }}
            actions={[
              <div
                style={{
                  width: "300px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Acl name="/admin/consoles/:consoleId">
                  <Tooltip title={"Editar consola"}>
                    <Icon
                      onClick={() =>
                        history.push(`/admin/consoles/${console.id}`)
                      }
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
                <Acl name="/admin/consoles#delete">
                  <Tooltip title={"Eliminar juego"}>
                    <Icon
                      onClick={() => deleteConsoles(console)}
                      style={{ color: "#fe008f", fontSize: "24px" }}
                      type="delete"
                    />
                  </Tooltip>
                </Acl>
                <IconUpload console={console} />
              </div>,
            ]}
          >
            <div>
              <h3 style={{ margin: "0px" }} key={console.id}>
                {console.name.toUpperCase()}
              </h3>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
