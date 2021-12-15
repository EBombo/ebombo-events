import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import moment from "moment";
import { mediaQuery, Desktop, Tablet } from "../../../../../constants";
import { spinLoader } from "../../../../../components/common/loader";
import { getCurrencySymbol, stripeDateFormat } from "../../../../../components/common/DataList";
import { Anchor } from "../../../../../components/form";
import { firestore } from "../../../../../firebase";
import { formatAmount } from "../../../../../stripe";
import { useRouter } from "next/router";
import { Table } from "antd";
import { Breadcrumb } from 'antd';
import { DownloadOutlined } from "@ant-design/icons";

const { Column } = Table;

const downloadPdf = (pdfUrl) => window.open(pdfUrl, "blank");

export const InvoiceDetail = (props) => {
  const router = useRouter();
  const { userId, invoiceId, subscriptionId } = router.query;

  const [invoice, setInvoice] = useState();
  const [paymentInformation, setPaymentInformation] = useState();

  const fetchInvoice = () => firestore.collection(`customers/${userId}/subscriptions/${subscriptionId}/invoices`).doc(invoiceId).get();
  const fetchPaymentInformation = (paymentIntent) => firestore.collection(`customers/${userId}/payments`).doc(paymentIntent).get();

  useEffect(() => {
    if (invoice) return;

    const getInvoice = async () => {
      const _invoice = (await fetchInvoice()).data();

      const _paymentInformation = (await fetchPaymentInformation(_invoice['payment_intent'])).data();
      setPaymentInformation(_paymentInformation);

      setInvoice(_invoice);
    };

    return getInvoice();
  }, [invoice]);

  if (!invoice) return spinLoader();

  return (
    <InvoiceDetailContainer>
      <div className="breadcrumb-container">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Anchor 
              className="item-link"
              onClick={() => router.push(`/users/${userId}/billing?subscriptionId=${subscriptionId}`)}
            >Cuenta</Anchor>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Anchor 
              className="item-link"
              onClick={() => router.push(`/users/${userId}/invoices/${invoiceId}?subscriptionId=${subscriptionId}`)}
            >Factura #{invoice?.number}</Anchor>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="actions-container">
        {/* TODO: print invoice format from design
          <Anchor 
            variant="primary"
            underlined
            onClick={() => window.print()}
          ><PrinterOutlined/> Imprimir</Anchor>
        */}

        <Anchor 
          variant="primary"
          underlined
          onClick={() => downloadPdf(invoice?.invoice_pdf)}
        ><DownloadOutlined/> Descargar</Anchor>
      </div>

      <div className="inner-layout">
        <div className="format-container bill-information">

          <div className="bill-inner-layout">
            <div className="company-section">
              <div className="field bold">{invoice?.account_name}</div>
              {/* TODO: Refactor when more data is available
                <div className="field">{invoice?.account_name}</div>
                <div className="field">-</div>
                <div className="field">-</div>
                <div className="field">Email: -</div>
                <div className="field">Número de identificación: -</div>
                <div className="field">Número de Registro: -</div>
              */}
            </div>

            <div className="bill-section">
              <div className="field bold">Factura</div>
              <div className="table">
                <div className="">Número de factura</div>
                <div className="">{invoice?.number}</div>

                <div className="">Facturación De </div>
                <div className="">{moment.unix(invoice?.created).format(stripeDateFormat)}</div>

                {/* TODO: Refactor if field is needed
                  <div className="">Vence El</div>
                  <div className="">{moment.unix(invoice?.created).format(stripeDateFormat)}</div>
                */}
              </div>
            </div>

            <div className="payer-section">
              <div className="field bold">Cobrar a</div>
              <div>{invoice?.customer_name}</div>
              <div>{invoice?.customer_email}</div>

              <div>{paymentInformation?.charges.data?.[0].billing_details?.address?.postal_code}</div>
              <div>{paymentInformation?.charges.data?.[0].billing_details?.address?.country}</div>
            </div>

            <div className="summary-section">
              <div className="status-value">Pagado</div>
              <div className="status-date">{moment.unix(invoice?.status_transitions.paid_at).format(stripeDateFormat)}</div>
              <div className="status-amount">
                {formatAmount(invoice?.total)} {getCurrencySymbol[invoice?.currency]} {invoice?.currency.toUpperCase()}
              </div>
            </div>
          </div>

          <Tablet>
            <Table dataSource={[invoice]} className="table-billing"  pagination={false}>
              <Column 
                title="Fecha" 
                dataIndex="created"
                key="created" 
                sorter={(a, b) => a.created - b.created}
                render={(created) => moment.unix(created).format(stripeDateFormat)}
              />
            </Table>
          </Tablet>
          <Desktop>
            <Table dataSource={[invoice]} className="table-billing" pagination={false}>
              <Column 
                title="Fecha" 
                dataIndex="created"
                key="created" 
                sorter={(a, b) => a.created - b.created}
                render={(created) => moment.unix(created).format(stripeDateFormat)}
              />
              <Column 
                title="Descripción" 
                dataIndex={["lines", "data", "0", "description"]}
                key={["lines", "data", "0", "description"]}
              />
              <Column
                title="Cantidad" 
                dataIndex={["lines", "data", "0", "quantity"]}
                key={["lines", "data", "0", "quantity"]}
              />
              <Column
                title="Precio" 
                dataIndex={["lines", "data", "0", "price", "unit_amount"]}
                key={["lines", "data", "0", "price", "unit_amount"]}
                render={(unitAmount, item) => (
                  `${formatAmount(unitAmount)} ${getCurrencySymbol[item?.lines.data[0].price.currency]}`
                )}
              />
              <Column
                title="Precio parcial"
                dataIndex={["lines", "data", "0", "amount"]}
                key={["lines", "data", "0", "amount"]}
                render={(amount, item) => (
                  `${formatAmount(amount)} ${getCurrencySymbol[item?.lines.data[0].currency]}`
                )}
              />
            </Table>
          </Desktop>

          <div className="total-summary">
            <div className="total-summary-inner-layout">
              <div className="table">
                <div>Total parcial</div>
                <div className="right">{ formatAmount(invoice?.subtotal) } { getCurrencySymbol[invoice?.currency] }</div>

                <div>Total</div>
                <div className="right">{ formatAmount(invoice?.total) } { getCurrencySymbol[invoice?.currency] }</div>

                <div>Pagado</div>
                <div className="right">-{ formatAmount(invoice?.amount_paid) } { getCurrencySymbol[invoice?.currency] }</div>
              </div>
              <hr className="divider"/>
              <div className="table">
                <div>Monto a pagar</div>
                <div className="right"> { formatAmount(invoice?.amount_remaining) } { getCurrencySymbol[invoice?.currency] } </div>
              </div>
            </div>
          </div>

          <div className="bold">Pagos</div>
          <div>
            { moment.unix(invoice?.created).format(stripeDateFormat) }
            { formatAmount(invoice?.total) } { getCurrencySymbol[invoice?.currency] }
            Pago de { paymentInformation?.charges.data?.[0].payment_method_details.card?.brand }
            *{ paymentInformation?.charges.data?.[0].payment_method_details.card?.last4 }
          </div>

          <div className="bold">Notas</div>
          <div>Todas las cantidades en Dólares estadounidenses (USD)</div>
        </div>

        <div className="format-container payment-amount">
          <div className="inner-format-total-amount">
            <div className="bold">Monto a pagar</div>
            <div> { formatAmount(invoice?.amount_remaining) } { getCurrencySymbol[invoice?.currency] } </div>
            <div className="table">
              <div className="bold">Estado</div>
              <div className="bold">Fecha de vencimiento</div>

              <div>{ invoice?.status }</div>
              <div>{ moment.unix(invoice?.created).format(stripeDateFormat) }</div>
            </div>
          </div>
        </div>
      </div>
    </InvoiceDetailContainer>
  )
};

const InvoiceDetailContainer = styled.div`
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

  .breadcrumb-container {
    margin: 0 1rem;
    padding: 2rem 0 0 0;
  }

  .actions-container {
    margin: 0 1rem;
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

