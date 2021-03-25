import React, { useEffect, useState } from "react";
import { snapshotToArray, spinLoader } from "../../../../../utils";
import { Button, Divider, List, Modal, Tooltip } from "antd";
import { firestore } from "../../../../../firebase";
import orderBy from "lodash/orderBy";
import { useHistory, useParams } from "react-router";
import { Icon } from "../../../../../components/common/Icons";
import { ButtonBombo } from "../../../../../components";

export const AdminFormats = (props) => {
  const [loadingFormats, setLoadingFormats] = useState(true);
  const [formats, setGames] = useState([]);
  const history = useHistory();
  const { gameId } = useParams();

  useEffect(() => {
    const unsubscribeGames = fetchGames();
    return () => unsubscribeGames();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  const formatsOrder = (formats_) =>
    orderBy(formats_, [(format_) => format_.updateAt.toDate()], ["desc"]);

  const fetchGames = () =>
    firestore
      .collection("formats")
      .where("deleted", "==", false)
      .where("gameId", "==", gameId)
      .onSnapshot((snapshot) => {
        setGames(formatsOrder(snapshotToArray(snapshot)));
        setLoadingFormats(false);
      });

  const deleteFormat = (format) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () =>
        firestore
          .collection("formats")
          .doc(format.id)
          .set({ ...format, deleted: true }, { merge: true }),
    });

  const formats_ = () =>
    orderBy(
      formats,
      [(format) => format.updateAt.toDate(), "name"],
      ["desc", "desc"]
    );

  if (loadingFormats) return spinLoader();

  return (
    <div>
      <ButtonBombo
        margin="0"
        icon={<Icon type="plus-circle" />}
        className="button-primary"
        onClick={() => history.push(`/admin/games/${gameId}/formats/new`)}
      >
        AGREGAR FORMATO
      </ButtonBombo>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={formats_()}
        renderItem={(format) => (
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
                <Tooltip title={"Editar formato"}>
                  <Icon
                    onClick={() =>
                      history.push(
                        `/admin/games/${gameId}/formats/${format.id}`
                      )
                    }
                    style={{ color: "gray", fontSize: "24px" }}
                    type="edit"
                  />
                </Tooltip>
                <Tooltip title={"Eliminar formato"}>
                  <Icon
                    onClick={() => deleteFormat(format)}
                    style={{ color: "#fe008f", fontSize: "24px" }}
                    type="delete"
                  />
                </Tooltip>
              </div>,
            ]}
          >
            <div>
              <h3 style={{ margin: "0px" }} key={format.id}>
                {format.name.toUpperCase()}
              </h3>
              <h5>{format.description.toUpperCase()}</h5>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
