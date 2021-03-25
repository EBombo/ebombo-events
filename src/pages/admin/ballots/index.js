import React, { useEffect, useState, useRef } from "react";
import { notification, Tabs } from "antd";
import { firestore } from "../../../firebase";
import { snapshotToArray, spinLoader } from "../../../utils";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import styled from "styled-components";
import { ButtonBombo } from "../../../components";
import { Ballot } from "./Ballot";

export const Ballots = (props) => {
  const [keyTab, setKetTab] = useState("ballots");
  const [limit, setLimit] = useState(20);

  const [ballots, setBallots] = useState([]);
  const [loadingBallots, setLoadingBallots] = useState(true);
  const [loadingLimit, setLoadingLimit] = useState(false);

  const unSub = useRef(null);

  useEffect(() => {
    !isEmpty(unSub.current) && unSub.current();
    setLoadingLimit(true);
    unSub.current = fetchTransactions();
    return () => !isEmpty(unSub.current) && unSub.current();
  }, [limit]);

  useEffect(() => {
    setLimit(20);
    !isEmpty(unSub.current) && unSub.current();
    setLoadingBallots(true);
    unSub.current = fetchTransactions();
    return () => !isEmpty(unSub.current) && unSub.current();
  }, [keyTab]);

  const fetchTransactions = () => {
    try {
      return firestore
        .collection("transactions")
        .where("action", "==", keyTab)
        .orderBy("createAt", "desc")
        .limit(limit)
        .onSnapshot((snapshot) => {
          setBallots(snapshotToArray(snapshot));
          setLoadingBallots(false);
          setLoadingLimit(false);
        });
    } catch (error) {
      setLoadingBallots(false);
      setLoadingLimit(false);
      notification.error({
        message: "ALGO SALIO MAL, VUELVE A INTENTARLO!",
        description: "Error al traer Boletas",
      });
    }
  };

  return (
    <Tabs defaultActiveKey={keyTab} onChange={(key) => setKetTab(key)}>
      <Tabs.TabPane tab={<div>BOLETAS ACEPTADAS</div>} key="ballots">
        {loadingBallots ? (
          spinLoader()
        ) : (
          <>
            {defaultTo(ballots, []).map((transaction) => (
              <Ballot
                {...props}
                key={transaction.id}
                transaction={transaction}
                keyTab={keyTab}
              />
            ))}
            {isEmpty(ballots) ? (
              <NotFoundBallots>No se encontraron boletas</NotFoundBallots>
            ) : (
              <ButtonBombo
                onClick={() => setLimit(limit + 20)}
                loading={loadingLimit}
                disabled={loadingLimit}
              >
                VER MAS
              </ButtonBombo>
            )}
          </>
        )}
      </Tabs.TabPane>
      <Tabs.TabPane tab={<div>BOLETAS RECHAZADAS</div>} key="reject-ballots">
        {loadingBallots ? (
          spinLoader()
        ) : (
          <>
            {defaultTo(ballots, []).map((transaction) => (
              <Ballot
                {...props}
                key={transaction.id}
                transaction={transaction}
                keyTab={keyTab}
              />
            ))}
            {isEmpty(ballots) ? (
              <NotFoundBallots>No se encontraron boletas</NotFoundBallots>
            ) : (
              <ButtonBombo
                onClick={() => setLimit(limit + 20)}
                loading={loadingLimit}
                disabled={loadingLimit}
              >
                VER MAS
              </ButtonBombo>
            )}
          </>
        )}
      </Tabs.TabPane>
    </Tabs>
  );
};

const NotFoundBallots = styled.div`
  text-align: center;
  margin-top: 47px;
`;
