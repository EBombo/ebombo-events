import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { DownloadOutlined } from "@ant-design/icons";
import { Table, Space } from "antd";
import { mediaQuery, Desktop, Tablet } from "../../../../constants";
import { PanelBox } from "../../../../components/common/PanelBox";
import { Anchor } from "../../../../components/form";
import { InvoiceTable } from "../invoices/InvoiceTable";

export const BillingOverview = (props) => {
  return (
    <BillingDetailContainer>
      <div className="section">
        <h2 className="title">Suscripciones</h2>
        <div className="subscriptions-layout">
          <PanelBox className="balance" elevated>
            <div className="table">
              <div className="label">Saldo actual de la cuenta</div>
              <div className="value">-</div>
            </div>
          </PanelBox>

          <PanelBox className="plan" heading="Plan Anual Billing" elevated>
            <div className="table">
              <div className="label">Periodo actual</div>
              <div className="value">-</div>

              <div className="label">Comportamiento de término</div>
              <div className="value">-</div>

              <div className="label">Colección</div>
              <div className="value">-</div>

              <div className="label">Se renueva en</div>
              <div className="value">-</div>

              <div className="label">Comenzó en</div>
              <div className="value">-</div>

              <div className="label">Últimas Factura</div>
              <div className="value">-</div>
            </div>

            <div className="alert accent">
              <p className="description">Siguiente factura en </p>
              <div className="table">
                <div className="label">Plan -</div>
                <div className="value">-</div>
              </div>
              <hr className="divider"/>
              <div className="table">
                <div className="label">Total Actual</div>
                <div className="value">-</div>
              </div>

            </div>
            <div><Anchor>Cancelar suscripción</Anchor> </div>
          </PanelBox>

          <PanelBox
           className="billing-detail"
            elevated
            heading="Datos de facturación"
            actionLink={<Anchor onClick={() => {}}>Revisar</Anchor>}
          >
            <div className="table">
              <div className="label">Nombre</div>
              <div className="value">-</div>

              <div className="label">Tarjeta de Crédito</div>
              <div className="value">-</div>

              <div className="label">Caducidad</div>
              <div className="value">-</div>

              <div className="label">Dirección</div>
              <div className="value"> - </div>
            </div>
          </PanelBox>
        </div>

        <div className="table">
          <h2 className="title">Facturas</h2>
          <Anchor className="action-link" onClick={() => {}}>Ver todas las facturas</Anchor>
        </div>

        <InvoiceTable {...props} />
      </div>

    </BillingDetailContainer>
  );
};

const BillingDetailContainer = styled.div`
  .section {
    margin: 0 8px;
    ${mediaQuery.afterTablet} {
      max-width: 1200px;
      margin: 0 auto;
    }
  }

  .table {
    display: grid;
    grid-template-columns: 1fr 1fr;

    .label {
      font-weight: bold;
    }

    .action-link {
      justify-self: end;
      align-self: center;
    }
  }

  .alert {
    margin-top: 18px;
    padding: 1rem;
    border-radius: 8px;

    &.accent {
      background: ${(props) => props.theme.basic.gray};
    }
  }

  .divider {
    border-color: ${(props) => props.theme.basic.grayLighten};
  }

  .table-billing {
    border-collapse: collapse;

    thead {
      border: 2px solid ${(props) => props.theme.basic.grayLighten};
    }

    th {
      background: ${(props) => props.theme.basic.whiteDark};
      border-bottom: 1px solid ${(props) => props.theme.basic.grayLighten};
      border-top: 1px solid ${(props) => props.theme.basic.grayLighten};

      &:first-child {
        border-left: 1px solid ${(props) => props.theme.basic.grayLighten};
        border-top-left-radius: 5px !important;
        border-bottom-left-radius: 5px !important;
      }
      &:last-child {
        border-right: 1px solid ${(props) => props.theme.basic.grayLighten};
        border-top-right-radius: 5px !important;
        border-bottom-right-radius: 5px !important;
      }
    }
  }

  ${mediaQuery.afterTablet} {
    .subscriptions-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1rem;

      .plan {
        grid-row: 1 / 3;
        grid-column: 1 / 2;
      }

      .balance {
        grid-row: 1 / 2;
        grid-column: 2 / 3;
        margin-bottom: 0;
      }

      .billing-detail {
        grid-row: 2 / 3;
        grid-column: 2 / 3;
        margin-top: 0;
      }
    }
  }
`;
