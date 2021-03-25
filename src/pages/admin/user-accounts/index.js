import React, {useEffect, useState} from "react";
import {firestore} from "../../../firebase";
import {snapshotToArray, spinLoader} from "../../../utils";
import {Divider, List, Modal, Tooltip} from "antd";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import {useHistory} from "react-router";
import {useAcl} from "../../../acl";
import {Icon} from "../../../components/common/Icons";
import {ButtonBombo, ImageUpload} from "../../../components";

export default () => {
  const history = useHistory();
  const { Acl } = useAcl();
  const [userAccounts, setUserAccounts] = useState([]);
  const [loadingUserAccounts, setLoadingUserAccounts] = useState(true);

  useEffect(() => {
    const unsubscribeUsersAccounts = fetchUserAccounts();
    return () => unsubscribeUsersAccounts();
  }, []);

  const fetchUserAccounts = () =>
    firestore
      .collection("userAccounts")
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => {
        setUserAccounts(userAccountsOrder(snapshotToArray(snapshot)));
        setLoadingUserAccounts(false);
      });

  const userAccountsOrder = (userAccount_) =>
    orderBy(
      userAccount_,
      [(userAccount_) => userAccount_.updateAt.toDate()],
      ["desc"]
    );

  const deleteUserAccount = (userAccount) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () =>
        firestore
          .collection("userAccounts")
          .doc(userAccount.id)
          .set({ ...userAccount, deleted: true }, { merge: true }),
    });

  const saveImages = (imagesArray, userAccountId) =>
    imagesArray.map(
      async (imgUrl) =>
        await firestore
          .collection("userAccounts")
          .doc(userAccountId)
          .update({ iconUrl: imgUrl })
    );

  return loadingUserAccounts ? (
    spinLoader()
  ) : (
    <>
      <h1>Cuentas de Usuario</h1>
      <br />
      <Acl name="/admin/user-accounts/new">
        <ButtonBombo
          type="primary"
          icon={<Icon type="plus-circle" />}
          onClick={() => history.push("/admin/user-accounts/new")}
        >
          AGREGAR CUENTA
        </ButtonBombo>
      </Acl>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={userAccounts}
        renderItem={(userAccount) => (
          <List.Item
            style={{ display: "flex" }}
            actions={[
              <>
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "space-evenly",
                    cursor: "pointer",
                  }}
                >
                  <Acl name="/admin/user-accounts/:userAccountId">
                    <Tooltip title="Editar cuenta de usuario">
                      <Icon
                        onClick={() =>
                          history.push(`/admin/user-accounts/${userAccount.id}`)
                        }
                        style={{ color: "gray", fontSize: "24px" }}
                        type="edit"
                      />
                    </Tooltip>
                  </Acl>
                  <Acl name="/admin/user-accounts#delete">
                    <Tooltip title={"Eliminar cuenta de usuario"}>
                      <Icon
                        onClick={() => deleteUserAccount(userAccount)}
                        style={{ color: "#fe008f", fontSize: "24px" }}
                        type="delete"
                      />
                    </Tooltip>
                  </Acl>
                </div>
              </>,
            ]}
          >
            <p>
              <b>{get(userAccount, "description", "")}</b> [
              {get(userAccount, "name", "")}]
            </p>
            <ImageUpload
              file={get(userAccount, "iconUrl", null)}
              fileName="iconUrl"
              filePath={`/user-accounts/${userAccount.id}`}
              bucket="users"
              sizes="100x100"
              afterUpload={(uploadImages) =>
                saveImages(uploadImages, userAccount.id)
              }
            />
          </List.Item>
        )}
      />
    </>
  );
};
