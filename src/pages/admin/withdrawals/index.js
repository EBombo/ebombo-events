import React, { useEffect, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { Divider, Input, List as ListAntd } from "antd";
import { firestore } from "../../../firebase";
import { snapshotToArray } from "../../../utils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";
import orderBy from "lodash/orderBy";
import { withdrawState } from "../../../components/common/getDataOfList";
import { useAcl } from "../../../acl";
import { ButtonBombo } from "../../../components";

const PAGINATION_LIMIT = 50;

export default (props) => {
  const { AclLink } = useAcl();

  const [searchWithdrawal, setSearchWithdrawal] = useState("");
  const [withdrawals, setWithdrawals] = useState([]);
  const [isLoadingWithdrawals, setIsLoadingWithdrawals] = useState(true);
  const [currentStartAfter, setCurrentStartAfter] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isVisibleMore, setIsVisibleMore] = useState(false);

  useEffect(() => {
    initialize();
  }, [searchWithdrawal]);

  const initialize = async () => {
    await fetchWithdrawals();

    setIsLoadingWithdrawals(false);
  };

  const fetchWithdrawals = async (isPagination) => {
    let withdrawalRef = await firestore
      .collection("transactions")
      .where("action", "==", "withdraw");

    if (searchWithdrawal)
      withdrawalRef = withdrawalRef.where(
        "user.searchName",
        "array-contains",
        searchWithdrawal.toUpperCase()
      );

    withdrawalRef = withdrawalRef.orderBy("createAt", "desc");

    if (isPagination)
      withdrawalRef = withdrawalRef.startAfter(currentStartAfter);

    const withdrawalQuerySnapShot = await withdrawalRef
      .limit(PAGINATION_LIMIT)
      .get();

    const _withdrawals = snapshotToArray(withdrawalQuerySnapShot);
    console.log("--->", searchWithdrawal, PAGINATION_LIMIT, _withdrawals);

    if (isEmpty(_withdrawals)) {
      if (!isPagination) {
        setWithdrawals(_withdrawals);
      }

      return setIsVisibleMore(false);
    }

    const resultsLength = _withdrawals.length;
    const startAfter = _withdrawals[resultsLength - 1].createAt.toDate();

    setCurrentStartAfter(startAfter);
    setWithdrawals((prevState) => concat(prevState, _withdrawals));
    setIsVisibleMore(_withdrawals.length === PAGINATION_LIMIT);
  };

  const onClickMore = async () => {
    try {
      setIsLoadingMore(true);

      await fetchWithdrawals(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const withdrawals_ = () => orderBy(withdrawals, ["createAt"], ["desc"]);

  return (
    <Container>
      <h2>Retiros</h2>
      <br />
      <div>
        <Input.Search
          placeholder="Buscar retiro por usuario"
          onSearch={(value) => setSearchWithdrawal(value)}
        />
      </div>
      <Divider />
      <List
        itemLayout="vertical"
        locale={{ emptyText: "Sin retiros" }}
        loading={isLoadingWithdrawals}
        size="large"
        dataSource={withdrawals_()}
        renderItem={(withdrawal) => (
          <List.Item>
            <AclLink
              name={"/admin/withdrawals/:withdrawalId"}
              to={`/admin/withdrawals/${withdrawal.id}`}
            >
              <Withdrawal>
                <p className="title">
                  {moment(withdrawal.createAt.toDate()).format(
                    "DD MMM YYYY hh:mm A"
                  )}
                </p>
                <div>
                  Usuario:{" "}
                  <span>
                    {get(withdrawal, "user.name", "-")}{" "}
                    {get(withdrawal, "user.lastName", "-")}
                  </span>
                </div>
                <div>
                  nickname: <span>{get(withdrawal, "user.nickname", "-")}</span>
                </div>
                <div>
                  email: <span>{get(withdrawal, "user.email", "-")}</span>
                </div>
                <div>
                  Nota: <span>{get(withdrawal, "note", "-")}</span>
                </div>
                <div>
                  Dinero: <span>{get(withdrawal, "amount", "-")}</span>
                </div>
                <div>
                  Estado:{" "}
                  <Text color={withdrawState(withdrawal).color}>
                    {withdrawState(withdrawal).label}
                  </Text>
                </div>
                <div>
                  Descripción:{" "}
                  <span>{get(withdrawal, "description", "-")}</span>
                </div>
              </Withdrawal>
            </AclLink>
          </List.Item>
        )}
      />
      <br />
      {isVisibleMore && (
        <WrapperButton>
          <ButtonBombo
            type="primary"
            loading={isLoadingMore}
            onClick={onClickMore}
          >
            Ver más
          </ButtonBombo>
        </WrapperButton>
      )}
    </Container>
  );
};

const Container = styled.section``;

const WrapperButton = styled.div`
  width: 100%;
  text-align: center;

  button {
    font-size: 1rem;
  }
`;

const Withdrawal = styled.div`
  display: grid;
  grid-gap: 0.3rem;
  grid-template-columns: 1fr;

  .title {
    font-weight: 500;
  }

  span {
    font-weight: bold;
  }
`;

const List = styled(ListAntd)`
  .ant-spin-dot {
    width: 2em;
    height: 2em;

    .ant-spin-dot-item {
      width: 20px;
      height: 20px;
    }
  }

  .ant-list-item {
    cursor: pointer;
  }
`;

const Text = styled.span`
  color: ${(props) => props.color};
`;
