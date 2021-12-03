import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery, Desktop, Tablet } from "../../../../../constants";
import { PanelBox } from "../../../../../components/common/PanelBox";
import { Anchor } from "../../../../../components/form";
import { useRouter } from "next/router";
import { Table, Space } from "antd";
import { Breadcrumb } from 'antd';
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";

const { Column } = Table;

const data = [
  {
    key: '1',
    billingId: "abcde1",
    date: '16 Dic 2020 - 16 Dic 2020 ',
    description: 'Kahoot! 360 Pro (annual billing)	',
    quantity: 1,
    price: 720,
    currency: 'USD',
    partialPrice: 720,
  },
];

export const BillId = (props) => {
  const router = useRouter();
  const { userId, billId } = router.query;

  return (
    <BillIdContainer>
      <div>
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Anchor 
              className="item-link"
              onClick={() => router.push(`/users/${userId}/billing/detail`)}
            >Cuenta</Anchor>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Anchor 
              className="item-link"
              onClick={() => router.push(`/users/${userId}/billing/${billId}`)}
            >Factura #{billId}</Anchor>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="actions-container">
        <Anchor 
          variant="primary"
          underlined
          onClick={null}
        ><PrinterOutlined/> Imprimir</Anchor>

        <Anchor 
          variant="primary"
          underlined
          onClick={null}
        ><DownloadOutlined/> Descargar</Anchor>
      </div>

      <div className="inner-layout">
        <div className="format-container bill-information">

          <div className="bill-inner-layout">
            <div className="company-section">
              <div className="field bold">Company A</div>
              <div className="field">-</div>
              <div className="field">-</div>
              <div className="field">-</div>
              <div className="field">Email: -</div>
              <div className="field">Número de identificación: -</div>
              <div className="field">Número de Registro: -</div>
            </div>

            <div className="bill-section">
              <div className="field bold">Factura</div>
              <div className="table">
                <div className="">Número de factura</div>
                <div className="">-</div>

                <div className="">Facturación De </div>
                <div className="">-</div>

                <div className="">Condiciones</div>
                <div className="">-</div>

                <div className="">Vence El</div>
                <div className="">-</div>
              </div>
            </div>

            <div className="payer-section">
              <div className="field bold">Cobrar a</div>
              <div>-</div>
              <div>-</div>

              <div>-</div>
              <div>-</div>
            </div>

            <div className="summary-section">
              <div className="status-value">Pagado</div>
              <div className="status-date">-</div>
              <div className="status-amount">- -</div>
            </div>
          </div>

          <Tablet>
            <Table dataSource={data}>
              <Column 
                title="Fecha" 
                dataIndex="date"
                key="date" 
                sorter={(a, b) => a.billing - b.billing}
              />
            </Table>
          </Tablet>
          <Desktop>
            <Table dataSource={data} className="table-billing">
              <Column 
                title="Fecha" 
                dataIndex="date"
                key="date" 
                sorter={(a, b) => a.billing - b.billing}
              />
              <Column 
                title="Desripción" 
                dataIndex="description" 
                key="description"
              />
              <Column title="Cantidad" dataIndex="quantity" key="quantity" />
              <Column title="Precio" dataIndex="price" key="price" />
              <Column title="Precio parcial" dataIndex="partialPrice" key="partialPrice" />
            </Table>
          </Desktop>

          <div className="total-summary">
            <div className="total-summary-inner-layout">
              <div className="table">
                <div>Total parcial</div>
                <div className="right">-</div>

                <div>Total</div>
                <div className="right">-</div>

                <div>Pagado</div>
                <div className="right">-</div>
              </div>
              <hr className="divider"/>
              <div className="table">
                <div>Monto a pagar</div>
                <div className="right"> - </div>
              </div>
            </div>
          </div>

          <div className="bold">Pagos</div>
          <div>-</div>

          <div className="bold">Notas</div>
          <div>Todas las cantidades en Dólares estadounidenses (USD)</div>
        </div>


        <div className="format-container payment-amount">
          <div className="inner-format-total-amount">
            <div className="bold">Monto a pagar</div>
            <div>-</div>
            <div className="table">
              <div className="bold">Estado</div>
              <div className="bold">Fecha de vencimiento</div>

              <div>-</div>
              <div>-</div>
            </div>
          </div>
        </div>
        <div className="format-container historical-payments">
          <div className="bold">Historial de pagos</div>
          <hr className="divider"/>
          <div className="table">
            <div>-</div>
            <div>-</div>
          </div>
        </div>
      </div>

    </BillIdContainer>
  )
};

const BillIdContainer = styled.div`
  background: ${(props) => props.theme.basic.white};
  padding-bottom: 1rem;
  font-size: 18px;

  .bold {
    font-weight: bold;
  }
  .right {
    text-align: right;
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

  .item-link {
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
  }

  .actions-container {
    text-align: right;
  }

  .format-container {
    margin: 1rem 1rem;
    padding: 2rem 1rem;
    border: 1px solid ${(props) => props.theme.basic.grayLighten};
    border-radius: 6px;

    ${mediaQuery.afterTablet} {
      padding: 1rem 2rem 2rem 2rem;
    }
  }

  .inner-format-total-amount {
    padding: 1rem;

    background: ${(props) => props.theme.basic.whiteDark};
    border-radius: 5px;

    ${mediaQuery.afterTablet} {
      margin: 1rem;
    }
  }

  .company-section,
  .bill-section,
  .payer-section {
    margin: 0 0 32px 0;
    ${mediaQuery.afterTablet} {
      margin: 0;
    }
  }

  .summary-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-self: flex-start;
    margin: 8px 0;
    text-align: center;

    .status-date,
    .status-amount,
    .status-value {
      padding: 0.5rem 0;
    }
    .status-value {
      background: ${(props) => props.theme.basic.successSecondary};
      color: ${(props) => props.theme.basic.white};
    }

    .status-date {
      background: ${(props) => props.theme.basic.grayLighten};
    }

    .status-amount {
      grid-column: 1 / 3;
      grid-row: 2 / 3;
      border: 1px solid ${(props) => props.theme.basic.grayLighten};
    }
  }

  .date-section {
    background: ${(props) => props.theme.basic.whiteDark};
    border: 1px solid ${(props) => props.theme.basic.grayLighten};
    border-radius: 5px;

    font-family: Lato;
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 18px;
    color: ${(props) => props.theme.basic.black};
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
  .total-summary {
    margin-bottom: 1.5rem;
  }

  ${mediaQuery.afterTablet} {
    .inner-layout {
      display: grid;
      grid-template-columns: 2fr 1fr;

      .historical-payments {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
        align-self: flex-start;
      }

      .payment-amount {
        grid-column: 2 / 3;
        grid-row: 1 / 2;
      }

      .bill-information {
        grid-column: 1 / 2;
        grid-row: 1 / 3;
      }

      .bill-inner-layout{
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        gap: 1rem;
        padding-bottom: 1rem;
      }
    }

    .total-summary {
      display: flex;
      justify-content: flex-end;
    }
  }


`;
