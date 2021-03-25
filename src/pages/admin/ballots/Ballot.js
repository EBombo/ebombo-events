import React, { useState } from "react";
import { useAcl } from "../../../acl";
import { config, firestore } from "../../../firebase";
import get from "lodash/get";
import moment from "moment";
import styled from "styled-components";
import { mediaQuery } from "../../../styles/constants";
import { ButtonBombo } from "../../../components";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../utils/useFetch/useFetch";

export const Ballot = (props) => {
  const { Acl } = useAcl();
  const [loadingForwardingBallot, setLoadingForwardingBallot] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const forwardingBallots = async (transactionId) => {
    setLoadingForwardingBallot(true);
    try {
      await ownFetch(
        `${config.serverUrlAdmin}/transactions/${transactionId}/forwarding-ballots`,
        "POST"
      );

      await updateTransaction(transactionId);

      props.showNotification(
        "Realizado con exito",
        "Boleta reenviada!",
        "success"
      );
    } catch (error) {
      handleError({ ...error, action: "forwardingBallots" });
    }
    setLoadingForwardingBallot(false);
  };

  const updateTransaction = async (transactionId) =>
    await firestore
      .doc(`transactions/${transactionId}`)
      .update({ action: "reject-ballots-resolved" });

  return (
    <BallotContent onClick={() => console.log(props.transaction)}>
      <div className="container-items">
        <div className="content-coins-left">
          <fieldset>
            <legend>
              <span className="title-legend">
                Inf. Boleta : {get(props, "transaction.user.nickname", " - ")}
              </span>
            </legend>
            <div className="item">
              <label>Nombres y apellidos: </label>
              <span>
                {get(props, "transaction.user.name", " - ")}{" "}
                {get(props, "transaction.user.lastName", " - ")}
              </span>
            </div>
            <div className="item">
              <label>Email </label>
              <span>{get(props, "transaction.user.email", " - ")}</span>
            </div>
            <div className="item">
              <label>Pago: </label>
              <span>{get(props, "transaction.amount", " - ")} </span>
            </div>
            <div className="item">
              <label>Creado: </label>
              <span>
                {moment(get(props, "transaction.createAt", "").toDate()).format(
                  "DD/MM/YYYY hh:mm A"
                )}
              </span>
            </div>
            <div className="item">
              <label>Descripcion: </label>
              <span>{get(props, "transaction.description", " - ")} </span>
            </div>
            {get(props, "keyTab") === "reject-ballots" && (
              <div className="item">
                <label>note: </label>
                <span>{get(props, "transaction.note", " - ")} </span>
              </div>
            )}
            <Acl name="/admin/ballots/:ballotId">
              {get(props, "keyTab") === "ballots" ? (
                <div className="item pdf">
                  <div
                    onClick={() =>
                      window.open(
                        `${get(props, "transaction.extra.urlPdf", "")}`,
                        "_blank"
                      )
                    }
                  >
                    [ VER BOLETA ]
                  </div>
                </div>
              ) : (
                <ButtonBombo
                  loading={loadingForwardingBallot}
                  disabled={loadingForwardingBallot}
                  onClick={() => forwardingBallots(props.transaction.id)}
                >
                  VOLVER A ENVIAR
                </ButtonBombo>
              )}
            </Acl>
          </fieldset>
        </div>
      </div>
    </BallotContent>
  );
};

const BallotContent = styled.div`
  width: 100%;

  .container-items {
    display: flex;
    flex-direction: column;

    ${mediaQuery.afterMobile} {
      flex-direction: row;
      width: 100%;
    }

    .content-coins-left {
      width: 100%;
      padding: 5px;

      ${mediaQuery.afterMobile} {
        width: 50%;
      }
    }

    .content-coins-right {
      width: 100%;
      padding: 5px;

      ${mediaQuery.afterMobile} {
        width: 50%;
      }
    }
  }

  .pdf {
    color: ${(props) => props.theme.discord.primary};
    cursor: pointer;
  }

  .item {
    width: 100%;

    h2,
    label {
      padding-right: 10px;
    }

    p {
      padding-right: 10px;
      margin-bottom: 0;
    }

    input {
      margin-bottom: 10px;
    }

    button {
      margin-right: 5px;
    }

    span {
      @include fontWeightFont(600);
    }
  }
`;
