import React, { useEffect, useState, useGlobal } from "reactn";
import { Divider, List } from "antd";
import get from "lodash/get";
import moment from "moment";
import styled from "styled-components";
import { ModalRejectedCards } from "./_modalRejectedCards";
import { firestore } from "../../../firebase";
import { snapshotToArray, spinLoader } from "../../../utils";
import { ButtonBombo } from "../../../components";

export default () => {
  const [rejectedCards, setRejectedCards] = useState([]);
  const [rejectedCardsLimit, setRejectedCardsLimit] = useState(20);
  const [selectedRejectedCard, setSelectedRejectedCard] = useState(null);
  const [loadingRejectedCards, setLoadingRejectedCards] = useState(true);
  const [loadingRejectedCardsLimit, setLoadingRejectedCardsLimit] = useState(
    true
  );

  const [activeModalRejectedCards, setActiveModalRejectedCards] = useState(
    false
  );

  const [currentCurrency] = useGlobal("currentCurrency");

  useEffect(() => {
    fetchTransactions();
  }, [rejectedCardsLimit]);

  const fetchTransactions = async () =>
    firestore
      .collection("transactions")
      .where("action", "==", "reject-card")
      .orderBy("createAt", "desc")
      .limit(rejectedCardsLimit)
      .onSnapshot((snapshot) => {
        setRejectedCards(snapshotToArray(snapshot));
        setLoadingRejectedCards(false);
        setLoadingRejectedCardsLimit(false);
      });

  const selectTransaction = (_transaction) => {
    setSelectedRejectedCard(_transaction);
    setActiveModalRejectedCards(!activeModalRejectedCards);
  };

  return loadingRejectedCards ? (
    spinLoader()
  ) : (
    <div>
      <h2>Tarjetas rechazadas</h2>
      <Divider />
      <List
        itemLayout="vertical"
        size="large"
        dataSource={rejectedCards}
        locale={{ emptyText: "Aún no hay Tarjetas rechazadas" }}
        renderItem={(transaction_) => (
          <List.Item style={{ cursor: "pointer", display: "flex" }}>
            {
              <ItemTransaction onClick={() => selectTransaction(transaction_)}>
                <p className="item-tittle">
                  {get(transaction_, "user.nickname", "").toUpperCase()}
                </p>
                <p className="item">{get(transaction_, "user.email", "")}</p>
                <p className="item">
                  <span>Monto:</span>{" "}
                  {`${currentCurrency} ${get(transaction_, "amount", "")}`}
                </p>
                <h4>
                  {moment(get(transaction_, "createAt", "").toDate()).format(
                    "DD/MM/YYYY hh:mm A"
                  )}
                </h4>
              </ItemTransaction>
            }
          </List.Item>
        )}
      />
      {rejectedCardsLimit <= rejectedCards.length && (
        <ButtonBombo
          onClick={() => {
            setLoadingRejectedCardsLimit(true);
            setRejectedCardsLimit(rejectedCardsLimit + 20);
          }}
          disabled={loadingRejectedCardsLimit}
          loading={loadingRejectedCardsLimit}
        >
          Ver mas
        </ButtonBombo>
      )}
      {activeModalRejectedCards && (
        <ModalRejectedCards
          setActiveModalRejectedCards={setActiveModalRejectedCards}
          selectedRejectedCard={selectedRejectedCard}
          activeModalRejectedCards={activeModalRejectedCards}
          currentCurrency={currentCurrency}
        />
      )}
    </div>
  );
};

const ItemTransaction = styled.div`
  .item-tittle {
    color: ${(props) => props.theme.colorLevels.level2};
    font-weight: 600;
  }

  .item {
    color: ${(props) => props.theme.basic.black};

    span {
      font-weight: 600;
    }
  }
`;
