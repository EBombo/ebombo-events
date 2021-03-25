import React from "reactn";
import {useAcl} from "../../../acl";
import {useEffect, useState} from "react";
import {firestore} from "../../../firebase";
import {snapshotToArray, spinLoader} from "../../../utils";
import {Button, List} from "antd";

export const AdminRoles = () => {
  const { AclLink } = useAcl();
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  useEffect(() => {
    const unsubscribe = fetchRoles();
    return () => unsubscribe();
  }, []);

  const fetchRoles = () =>
    firestore
      .collection("roles")
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .onSnapshot((snapshot) => {
        setRoles(snapshotToArray(snapshot));
        setLoadingRoles(false);
      });

  return loadingRoles ? (
    spinLoader()
  ) : (
    <div>
      <h2>Sugerencias</h2>
      <Button>CREAR UN ROL</Button>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={roles}
        locale={{ emptyText: "Aún no hay roles" }}
        renderItem={
          <List.Item style={{ cursor: "pointer", display: "flex" }}>
            ...
          </List.Item>
        }
      />
    </div>
  );
};
