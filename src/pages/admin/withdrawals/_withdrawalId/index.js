import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {useHistory, useParams} from "react-router";
import {config, firestore} from "../../../../firebase";
import {message} from "antd";
import {spinLoader} from "../../../../utils";
import {mediaQuery} from "../../../../styles/constants";
import get from "lodash/get";
import {withdrawState} from "../../../../components/common/getDataOfList";
import UrlAssembler from "url-assembler";
import {useAcl} from "../../../../acl";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../../../utils/useFetch/useFetch";
import {ButtonBombo} from "../../../../components";

export const AdminWithdrawal = (props) => {
  const history = useHistory();
  const { Acl } = useAcl();
  const { withdrawalId } = useParams();

  const [withdrawal, setWithdrawal] = useState({});
  const [isLoadingWithdrawal, setIsLoadingWithdrawal] = useState(true);
  const [isLoadingConfirmWithdrawal, setIsLoadConfirmWithdrawal] = useState(
    false
  );
  const [
    isLoadingCancelConfirmWithdrawal,
    setIsLoadCancelConfirmWithdrawal,
  ] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    fetchWithdrawal();
  }, []);

  const fetchWithdrawal = async () => {
    try {
      const withdrawalDoc = await firestore
        .collection("transactions")
        .doc(withdrawalId)
        .get();

      if (!withdrawalDoc.exists) throw new Error("El retiro no existe");

      const _withdrawal = withdrawalDoc.data();

      setWithdrawal(_withdrawal);
    } catch (error) {
      console.error("withdrawlas", error);

      message.error("El retiro no existe");
      history.push("/admin/withdrawals");
    } finally {
      setIsLoadingWithdrawal(false);
    }
  };

  const confirmWithdrawal = async () => {
    try {
      setIsLoadConfirmWithdrawal(true);

      await ownFetch(urlApiRequestNewDocument(), "PUT");

      message.success("Se realizó la operación correctamente", 5);

      history.push("/admin/withdrawals");
    } catch (error) {
      handleError({ ...error, action: "confirmWithdrawal" });
    } finally {
      setIsLoadConfirmWithdrawal(false);
    }
  };

  const confirmCancelWithdrawal = async () => {
    try {
      setIsLoadCancelConfirmWithdrawal(true);

      await ownFetch(urlApiRequestCancelWithdrawal(), "PUT");

      message.success("Se realizó la operación correctamente", 5);

      history.push("/admin/withdrawals");
    } catch (error) {
      handleError({ ...error, action: "confirmCancelWithdrawal" });
    } finally {
      setIsLoadCancelConfirmWithdrawal(false);
    }
  };

  const urlApiRequestNewDocument = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/admin/withdrawals/:withdrawalId")
      .param({ withdrawalId })
      .toString();

  const urlApiRequestCancelWithdrawal = () =>
    new UrlAssembler(`${config.serverUrl}`)
      .template("/admin/withdrawals/:withdrawalId/cancel")
      .param({ withdrawalId })
      .toString();

  return isLoadingWithdrawal ? (
    spinLoader()
  ) : (
    <Container>
      <h2>Información del retiro del usuario</h2>
      <br />
      <Content>
        <FieldSet title="Información">
          <div className="information">
            <div style={{ cursor: "pointer" }}>
              Usuario:{" "}
              <span
                onClick={() =>
                  window.open(
                    `http://${window.location.host}/admin/users/${get(
                      withdrawal,
                      "user.id",
                      "-"
                    )}`,
                    "_blank"
                  )
                }
              >
                {get(withdrawal, "user.name", "-")}{" "}
                {get(withdrawal, "user.lastName", "-")}
              </span>
            </div>
            <div>
              Email: <span>{get(withdrawal, "user.email", "-")}</span>
            </div>
            <div>
              Celular:{" "}
              <a
                onClick={() =>
                  window.open(
                    `https://wa.me/${get(withdrawal, "user.dialCode", "")}${get(
                      withdrawal,
                      "user.phoneNumber",
                      ""
                    )}`,
                    "_blank"
                  )
                }
              >
                {`${get(withdrawal, "user.dialCode", "-")} ${get(
                  withdrawal,
                  "user.phoneNumber",
                  "-"
                )}`}
              </a>
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
              Descripción: <span>{get(withdrawal, "description", "-")}</span>
            </div>
          </div>
        </FieldSet>
        <Acl name="/admin/withdrawals/:withdrawalId#resolve">
          <FieldSet title="Opciones">
            <div className="wrapper-buttons">
              <ButtonBombo
                loading={isLoadingConfirmWithdrawal}
                onClick={confirmWithdrawal}
                disabled={
                  !!withdrawal.isDeposited ||
                  !!withdrawal.isRejected ||
                  isLoadingCancelConfirmWithdrawal ||
                  (!withdrawal.isDeposited && withdrawal.operationId)
                }
                type="primary"
              >
                {withdrawal.note === "Rapyd"
                  ? "Procesar con Rapyd"
                  : "Dinero depositado"}
              </ButtonBombo>
              <ButtonBombo
                loading={isLoadingCancelConfirmWithdrawal}
                onClick={confirmCancelWithdrawal}
                disabled={
                  !!withdrawal.isDeposited ||
                  !!withdrawal.isRejected ||
                  (!withdrawal.isDeposited && withdrawal.operationId)
                }
                type="danger"
              >
                Cancelar deposito
              </ButtonBombo>
            </div>
          </FieldSet>
        </Acl>
      </Content>
    </Container>
  );
};

const Container = styled.section``;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 3rem;

  ${mediaQuery.afterTablet} {
    grid-template-columns: 1fr 300px;
  }

  .information {
    display: grid;
    grid-gap: 0.3rem;
    grid-template-columns: 1fr;
    margin: 0.5rem 0.2rem;
  }

  .wrapper-buttons {
    display: grid;
    grid-gap: 0.3rem;
    grid-template-columns: 1fr;
    margin: 0.5rem 0.2rem;
  }
`;

const FieldSet = (props) => (
  <FieldsetContainer>
    <legend>
      <span>{props.title}</span>
    </legend>
    <div className="content">{props.children}</div>
  </FieldsetContainer>
);

const FormContent = styled.form`
  margin: 0 auto;
  display: flex;
  justify-content: space-between;

  .hidden {
    display: none;
  }

  .form-container {
    display: flex;
  }
`;

const FieldsetContainer = styled.fieldset`
  border: 1px solid #292929;
  width: auto;
  border-radius: 7px;

  legend {
    width: auto;
    margin: 0;
    color: #000000;

    span {
      font-family: "Encode Sans", sans-serif;
      font-size: 0.8rem;
      padding: 0 10px 0 10px;
      font-weight: 600;
    }
  }

  .content {
    label {
      padding-right: 10px;
    }

    span {
      font-family: "Encode Sans", sans-serif;
      font-weight: 600;
    }
  }
`;

const Text = styled.span`
  color: ${(props) => props.color};
`;
