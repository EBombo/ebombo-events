import React, { useEffect, useState } from "react";
import { snapshotToArray, spinLoader, wrappedLink } from "../../../utils";
import { firestore } from "../../../firebase";
import moment from "moment";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import { Divider, Input, List, Tooltip } from "antd";
import { useHistory } from "react-router";
import styled from "styled-components";
import { userAccountState } from "../../../components/common/getDataOfList";
import { useAcl } from "../../../acl";
import { Icon } from "../../../components/common/Icons";

export default (props) => {
  const history = useHistory();
  const { AclLink, Acl } = useAcl();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    !search.trim() ? fetchUsers() : fetchUsersByName();
  }, [search]);

  const fetchUsers = async () => {
    const users = await firestore
      .collection("users")
      .orderBy("createAt", "desc")
      .limit(100)
      .get();

    setUsers(snapshotToArray(users));

    setLoadingUsers(false);
  };

  const fetchUsersByName = async () => {
    const users = await firestore
      .collection("users")
      .where("searchName", "array-contains", search.toUpperCase())
      .limit(100)
      .get();

    setUsers(snapshotToArray(users));

    setLoadingUsers(false);
  };

  return loadingUsers ? (
    spinLoader()
  ) : (
    <React.Fragment>
      <h2>Usuarios</h2>
      <br />
      <div className="content-filters">
        <Input.Search
          className="search-team"
          placeholder="Buscar usuario"
          onSearch={(value) => setSearch(value)}
        />
      </div>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={orderBy(users, ["createAt"], ["desc"])}
        renderItem={(user) => (
          <List.Item
            style={{ cursor: "pointer", display: "flex" }}
            actions={[
              <div
                style={{
                  width: "100px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  cursor: "pointer",
                }}
              >
                <Acl name="/admin/users/:userId">
                  <Tooltip title="Editar usuario">
                    <Icon
                      onClick={() => history.push(`/admin/users/${user.id}`)}
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
              </div>,
            ]}
          >
            <AclLink name="/admin/users/:userId" to={`/admin/users/${user.id}`}>
              <ContentAdminUser>
                <p>{`${get(user, "name", "")} ${get(user, "lastName", "")}`}</p>
                <span>Nickname: {user.nickname}</span>
                <span>{`Monto: ${get(user, "money", 0)}`}</span>
                <span>{get(user, "email", "without email")}</span>
                <span>
                  Estado de cuenta:{" "}
                  <Text color={userAccountState(user).color}>
                    {userAccountState(user).label}
                  </Text>
                </span>
                <h4>{`Creado: ${
                  user.createAt &&
                  moment(user.createAt.toDate()).format("DD MMM YYYY")
                }`}</h4>
              </ContentAdminUser>
            </AclLink>
          </List.Item>
        )}
      />
    </React.Fragment>
  );
};

const Text = styled.span`
  color: ${(props) => props.color} !important;
  font-weight: 500;
`;

const ContentAdminUser = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: ${(props) => props.theme.basic.default};
    font-size: 0.8rem;
  }
`;
