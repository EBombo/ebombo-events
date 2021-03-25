import React, {useEffect, useState} from "reactn";
import {snapshotToArray, spinLoader} from "../../../utils";
import {Divider, List, Modal, Tooltip} from "antd";
import {firestore} from "../../../firebase";
import orderBy from "lodash/orderBy";
import {useHistory} from "react-router";
import {ButtonBombo, Upload} from "../../../components";
import {useAcl} from "../../../acl";
import {Icon} from "../../../components/common/Icons";

export const AdminAdvertisements = () => {
  const [loadingAdvertisements, setLoadingAdvertisements] = useState(true);
  const [advertisements, setAdvertisements] = useState([]);
  const history = useHistory();
  const { Acl } = useAcl();

  useEffect(() => {
    const unsubscribeAdvertisements = fetchAdvertisements();
    return () => unsubscribeAdvertisements();
  }, []);

  const advertisementsOrder = (advertisement_) =>
    orderBy(
      advertisement_,
      [(advertisement_) => advertisement_.updateAt.toDate()],
      ["desc"]
    );

  const fetchAdvertisements = () =>
    firestore
      .collection("advertisements")
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setAdvertisements(advertisementsOrder(snapshotToArray(snapshot)));
        setLoadingAdvertisements(false);
      });

  const deleteAdvertisement = (advertisement) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () =>
        firestore
          .collection("advertisements")
          .doc(advertisement.id)
          .update({ deleted: true }),
    });

  const updateAdvertisement = async (advertisement_, advertisementId_) =>
    await firestore
      .doc(`advertisements/${advertisementId_}`)
      .set({ ...advertisement_ }, { merge: true });

  return loadingAdvertisements ? (
    spinLoader()
  ) : (
    <div>
      <Acl name="/admin/advertisements/new">
        <ButtonBombo
          type="primary"
          icon={<Icon type="plus-circle" />}
          onClick={() => history.push("/admin/advertisements/new")}
        >
          AGREGAR ANUNCIO
        </ButtonBombo>
      </Acl>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={advertisementsOrder(advertisements)}
        renderItem={(advertisement) => (
          <List.Item
            style={{ display: "flex" }}
            actions={[
              <div
                style={{
                  cursor: "pointer",
                  width: "300px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Acl name="/admin/advertisements/:advertisementId">
                  <Tooltip title={"Editar Anuncio"}>
                    <Icon
                      onClick={() =>
                        history.push(
                          `/admin/advertisements/${advertisement.id}`
                        )
                      }
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
                <Acl name="/admin/advertisements#delete">
                  <Tooltip title={"Eliminar Anuncio"}>
                    <Icon
                      onClick={() => deleteAdvertisement(advertisement)}
                      style={{ color: "#fe008f", fontSize: "24px" }}
                      type="delete"
                    />
                  </Tooltip>
                </Acl>
                <Upload
                  isImage={true}
                  accept="image/*"
                  bucket="advertisements"
                  filePath={`advertisements/${advertisement.id}`}
                  fileName="advertisement"
                  name="imageUrl"
                  buttonText="Subir foto"
                  document={advertisement}
                  afterUpload={(advertisement_) =>
                    updateAdvertisement(advertisement_, advertisement.id)
                  }
                  sizeResized="600x250"
                />
              </div>,
            ]}
          >
            <h3 style={{ margin: "0px" }} key={advertisement.id}>
              {advertisement.name.toUpperCase()}
            </h3>
            <br />
            <h5>
              {advertisement.requireRegistration &&
                "PARA USUARIO QUE INCIARON SESION"}
            </h5>
          </List.Item>
        )}
      />
    </div>
  );
};
