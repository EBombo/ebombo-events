import React, { useEffect, useState } from "react";
import { snapshotToArray, spinLoader } from "../../../../../utils";
import { Button, Divider, List, Modal, Tooltip } from "antd";
import { firestore } from "../../../../../firebase";
import orderBy from "lodash/orderBy";
import { useHistory, useParams } from "react-router";
import { useAcl } from "../../../../../acl";
import { Icon } from "../../../../../components/common/Icons";
import { ButtonBombo } from "../../../../../components";

export const AdminRules = (props) => {
  const history = useHistory();
  const { Acl } = useAcl();
  const [loadingRules, setLoadingRules] = useState(true);
  const [rules, setRules] = useState([]);
  const { gameId } = useParams();

  useEffect(() => {
    const unsubscribeRules = fetchRules();
    return () => unsubscribeRules();
  }, []);

  const rulesOrder = (rules_) =>
    orderBy(rules_, [(rule_) => rule_.updateAt.toDate()], ["desc"]);

  const fetchRules = () =>
    firestore
      .collection("rules")
      .where("deleted", "==", false)
      .where("gameId", "==", gameId)
      .onSnapshot((snapshot) => {
        setRules(rulesOrder(snapshotToArray(snapshot)));
        setLoadingRules(false);
      });

  const deleteRule = (rule) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () =>
        firestore
          .collection("rules")
          .doc(rule.id)
          .set({ ...rule, deleted: true }, { merge: true }),
    });

  const rules_ = () =>
    orderBy(
      rules,
      [(rule) => rule.updateAt.toDate(), "name"],
      ["desc", "desc"]
    );

  return loadingRules ? (
    spinLoader()
  ) : (
    <div>
      <Acl name="/admin/games/:gameId/rules/new">
        <ButtonBombo
          margin="0"
          type="primary"
          icon={<Icon type="plus-circle" />}
          className="button-primary"
          onClick={() => history.push(`/admin/games/${gameId}/rules/new`)}
        >
          AGREGAR REGLA
        </ButtonBombo>
      </Acl>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={rules_()}
        renderItem={(rule) => (
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
                <Acl name="/admin/games/:gameId/rules/:ruleId">
                  <Tooltip title={"Editar regla"}>
                    <Icon
                      onClick={() =>
                        history.push(`/admin/games/${gameId}/rules/${rule.id}`)
                      }
                      style={{ color: "gray", fontSize: "24px" }}
                      type="edit"
                    />
                  </Tooltip>
                </Acl>
                <Acl name="/admin/games/:gameId/rules#delete">
                  <Tooltip title={"Eliminar regla"}>
                    <Icon
                      onClick={() => deleteRule(rule)}
                      style={{ color: "#fe008f", fontSize: "24px" }}
                      type="delete"
                    />
                  </Tooltip>
                </Acl>
              </div>,
            ]}
          >
            <div>
              <h3 style={{ margin: "0px" }} key={rule.id}>
                {rule.name.toUpperCase()}
              </h3>
              <h5>{rule.description.toUpperCase()}</h5>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
