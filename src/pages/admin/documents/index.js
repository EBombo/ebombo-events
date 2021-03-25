import React, {useEffect, useState} from "reactn";
import {Divider, List} from "antd";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import styled from "styled-components";
import {colorRed} from "../../../styles/constants";
import {firestore} from "../../../firebase";
import {snapshotToArray, spinLoader} from "../../../utils";
import {useHistory} from "react-router";
import {useAcl} from "../../../acl";
import {Icon} from "../../../components/common/Icons";

export const AdminDocuments = () => {
  const history = useHistory();
  const { AclLink } = useAcl();

  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUser = () =>
      firestore
        .collection("users")
        .where("verifiedDocument", "==", false)
        .where("documentImageUrl", "!=", null)
        .limit(30)
        .onSnapshot((usersRef) => {
          const users_ = snapshotToArray(usersRef).filter(
            (user) => user.documentImageUrl
          );
          setUsers(users_);
          setIsLoadingUsers(false);
        });

    const unSub = fetchUser();
    return () => unSub();
  }, []);

  const users_ = () => orderBy(users, ["updateAt"], ["desc"]);

  if (isLoadingUsers) return spinLoader();

  return (
    <React.Fragment>
      <h2>Documentos recibidos</h2>
      <br />
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={users_()}
        renderItem={(user) => (
          <List.Item
            style={{ display: "flex" }}
            actions={[
              <div
                style={{ fontSize: "1.1rem" }}
                className="item-icon-view"
                onClick={() => history.push(`/admin/documents/${user.id}`)}
              >
                <Icon type="eye" />
              </div>,
            ]}
          >
            <AclLink
              name={`/admin/documents/:documentId`}
              to={`/admin/documents/${user.id}`}
            >
              <Information verifiedDocument={user.verifiedDocument}>
                <section className="section-left">
                  <div className="item-user-name">
                    nickname: {user.nickname}
                  </div>
                  <div className="item-user-documentNumber">
                    documento: {get(user, "documentNumber", "-")}
                  </div>
                  <div className="item-state-document">
                    <div className="state-document">
                      {user.verifiedDocument ? "Verificado" : "No verificado"}
                    </div>
                  </div>
                </section>
              </Information>
            </AclLink>
          </List.Item>
        )}
      />
      <br />
    </React.Fragment>
  );
};

const Information = styled.div`
  .section-left {
    .item-user-name {
      font-size: 1.1rem;
    }

    .item-user-documentNumber {
      font-size: 1rem;
    }

    .item-state-document {
      display: flex;
      justify-content: flex-start;

      .state-document {
        width: auto;
        background: ${(props) =>
          props.verifiedDocument
            ? "rgba(130, 224, 170, 0.8)"
            : colorRed.lighten_3};
        color: rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(0, 0, 0, 0.3);
        border-radius: 20px;
        padding: 2px 9px;
        font-size: 0.7rem;
        font-weight: bold;
        margin: 5px 0;
      }
    }
  }
`;
