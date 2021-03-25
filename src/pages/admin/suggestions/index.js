import React, {useEffect, useState} from "react";
import moment from "moment";
import get from "lodash/get";
import {Divider, List} from "antd";
import {firestore} from "../../../firebase";
import {snapshotToArray, spinLoader} from "../../../utils";
import {ModalSuggestion} from "./_modalSuggestion";
import styled from "styled-components";
import {useAcl} from "../../../acl";

export const AdminSuggestions = () => {
  const { AclLink } = useAcl();
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  const [activeModalSuggestion, setActiveModalSuggestion] = useState(false);

  useEffect(() => {
    const unsubscribe = fetchSuggestions();
    return () => unsubscribe();
  }, []);

  const fetchSuggestions = () =>
    firestore
      .collection("suggestions")
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .limit(100)
      .onSnapshot((snapshot) => {
        setSuggestions(snapshotToArray(snapshot));
        setLoadingSuggestions(false);
      });

  const selectSuggestion = (_suggestion) => {
    setSelectedSuggestion(_suggestion);
    setActiveModalSuggestion(!activeModalSuggestion);
  };

  return loadingSuggestions ? (
    spinLoader()
  ) : (
    <div>
      <h2>Sugerencias</h2>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={suggestions}
        locale={{ emptyText: "Aún no hay sugerencias" }}
        renderItem={(suggestion) => (
          <List.Item style={{ cursor: "pointer", display: "flex" }}>
            <AclLink
              name="/admin/suggestions/:suggestionId"
              onClick={() => selectSuggestion(suggestion)}
            >
              <ItemSuggestion>
                <p className="item-tittle">
                  {get(suggestion, "user.nickname", "").toUpperCase()}
                </p>
                <p className="item-email">
                  {get(suggestion, "user.email", "")}
                </p>
                <p className="item-email">
                  {get(suggestion, "content", "").substring(0, 100) + "..."}
                </p>
                <h4>
                  {moment(get(suggestion, "createAt", "").toDate()).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </h4>
              </ItemSuggestion>
            </AclLink>
          </List.Item>
        )}
      />
      {activeModalSuggestion && (
        <ModalSuggestion
          setActiveModalSuggestion={setActiveModalSuggestion}
          selectedSuggestion={selectedSuggestion}
          activeModalSuggestion={activeModalSuggestion}
        />
      )}
    </div>
  );
};

const ItemSuggestion = styled.div`
  .item-email {
    color: ${(props) => props.theme.basic.black};
  }
`;
