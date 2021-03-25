import React, { useEffect, useGlobal, useState } from "reactn";
import styled from "styled-components";
import { mediaQuery } from "../../../../styles/constants";
import { firestore } from "../../../../firebase";
import { Desktop, snapshotToArray, spinLoader } from "../../../../utils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import moment from "moment";
import { Tooltip } from "antd";
import { BackButton } from "../../../../components";
import { darkTheme } from "../../../../styles/theme";

export default (props) => {
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [authUser] = useGlobal("user");

  useEffect(() => {
    const initialize = async () => {
      setLoadingTransactions(true);
      const transactionsCharge = await fetchChargedTransactions();
      const transactionsWithDraw = await fetchWithDrawTransactions();

      setTransactions([...transactionsWithDraw, ...transactionsCharge]);
      setLoadingTransactions(false);
    };
    initialize();
  }, []);

  const fetchChargedTransactions = async () => {
    const transactionQuerySnapShot = await firestore
      .collection("transactions")
      .where("user.id", "==", authUser.id)
      .where("action", "==", "charge")
      .orderBy("createAt", "desc")
      .limit(20)
      .get();

    return snapshotToArray(transactionQuerySnapShot);
  };

  const fetchWithDrawTransactions = async () => {
    const transactionQuerySnapshot = await firestore
      .collection("transactions")
      .where("user.id", "==", authUser.id)
      .where("action", "==", "withdraw")
      .orderBy("createAt", "desc")
      .limit(20)
      .get();

    return snapshotToArray(transactionQuerySnapshot);
  };

  if (isEmpty(transactions) && loadingTransactions) return spinLoader();

  return (
    <TransactionsWithStyle>
      <div className="left-content">
        <BackButton color={darkTheme.basic.blackLighten} />
        <div className="head-t">
          <div className="item-1">Historial de transacciones</div>
          <div className="item-2">
            Estas son todas las transacciones que has realizado
          </div>
        </div>
        <div className="body-t">
          <div className="title">Transacciones</div>
          <div className="head-table">
            <div>Transacción</div>
            <div>Fecha</div>
            <div>Monto</div>
            <div>Método</div>
            <div>Cuenta Bancaria</div>
          </div>
          <div className="body-table">
            {transactions.map((transaction, index) => (
              <div className="row-table" key={index}>
                <div
                  className={`${
                    transaction.action === "charge" ? "charge" : "withdraw"
                  }`}
                >
                  {transaction.action === "charge" ? "Recarga" : "Retiro"}
                </div>
                <div>
                  {moment(transaction.createAt.toDate()).format("DD/MM/YYYY")}
                </div>
                <div>{transaction.amount}</div>
                <div>
                  <Tooltip title={get(transaction, "description", "")}>
                    {transaction.action !== "withdraw"
                      ? transaction.description.includes("admin")
                        ? "Transferencia"
                        : "Web"
                      : "-"}
                  </Tooltip>
                </div>
                <div>
                  {transaction.action === "charge"
                    ? "-"
                    : transaction.accountNumber}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Desktop>
        <div className="right-content" />
      </Desktop>
    </TransactionsWithStyle>
  );
};

const TransactionsWithStyle = styled.div`
  height: 100vh;
  background: ${(props) => props.theme.basic.gray};
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }

  ${mediaQuery.afterTablet} {
    display: grid;
    grid-template-columns: 70% 30%;
  }

  .right-content {
    background: ${(props) => props.theme.basic.blackDarken};
  }

  .left-content {
    padding: 1rem;

    .head-t {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 1rem 0;
      color: ${(props) => props.theme.basic.blackLighten};
      ${mediaQuery.afterTablet} {
        padding: 1rem;
      }

      .item-1 {
        font-size: 13px;
        line-height: 16px;
        font-weight: bold;
      }

      .item-2 {
        margin: 1rem 0;
        font-size: 11px;
        line-height: 13px;
        font-weight: normal;
      }
    }

    .body-t {
      margin-left: 0;
      font-size: 10px;
      max-width: 550px;
      ${mediaQuery.afterTablet} {
        padding: 0 1rem;
      }

      .title {
        font-size: 13px;
        line-height: 16px;
        font-weight: bold;
        margin: 1rem 0;
        color: ${(props) => props.theme.basic.blackLighten};
      }

      .head-table {
        display: grid;
        grid-template-columns: 20% 17% 15% 20% 28%;
        background: ${(props) => props.theme.basic.grayLighten};
        color: ${(props) => props.theme.basic.blackLighten};
        font-weight: bold;

        div {
          text-align: center;
          padding: 10px 0;
        }
      }

      .body-table {
        .row-table {
          margin-top: 1px;
          display: grid;
          grid-template-columns: 20% 17% 15% 20% 28%;
          background: ${(props) => props.theme.basic.grayLighten};
          color: ${(props) => props.theme.basic.blackLighten};

          div {
            text-align: center;
            padding: 10px 0;
          }

          .withdraw {
            color: ${(props) => props.theme.basic.danger};
            font-weight: 600;
          }

          .charge {
            color: ${(props) => props.theme.basic.primary};
            font-weight: 600;
          }
        }
      }
    }
  }
`;
