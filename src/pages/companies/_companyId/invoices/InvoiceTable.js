import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import moment from "moment";
import { useRouter } from "next/router";
import { Table } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { Desktop, Tablet } from "../../../../constants";
import { getCurrencySymbol, stripeDateFormat } from "../../../../components/common/DataList";
import { Anchor } from "../../../../components/form";
import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils";
import { formatAmount } from "../../../../stripe";

const { Column } = Table;

const downloadPdf = (pdfUrl) => window?.open(pdfUrl, "blank");

export const InvoiceTable = (props) => {
  const router = useRouter();
  const { companyId, subscriptionId } = props;

  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = (_subscriptionId) => firestore.collection(`customers/${companyId}/subscriptions/${_subscriptionId}/invoices`).get();

  useEffect(() => {
    if (invoices.length) return;

    const getInvoices = async () =>
      setInvoices(snapshotToArray(await fetchInvoices(subscriptionId)));

    const getInvoicesFromAllSubscriptions = async () => {
      const subcriptionsQuery = await firestore.collection(`customers/${companyId}/subscriptions`).get();

      const subcriptionsIds = subcriptionsQuery.docs.map((doc) => doc.id);
      const fetchAllInvoicesPromise = subcriptionsIds.map((subId) => fetchInvoices(subId));
      let _invoices =  await Promise.all(fetchAllInvoicesPromise);
      _invoices =  _invoices.reduce((acc, invoiceList) => {
        acc = [...acc, ...snapshotToArray(invoiceList)];
        return acc;
      }, [])
      setInvoices(_invoices);
    }

    if (subscriptionId) return getInvoices();

    return getInvoicesFromAllSubscriptions();
  }, [invoices]);

  return (
    <InvoiceTableContainer {...props}>
        <Tablet>
          <Table dataSource={invoices}>
            <Column 
              title="Factura" 
              dataIndex="number"
              key="number" 
            />
            <Column
              key="action"
              render={(invoice) => (
                <DownloadOutlined onClick={() => downloadPdf(invoice.invoice_pdf)}/>
              )}
            />
          </Table>
        </Tablet>
        <Desktop>
          <Table dataSource={invoices} className="table-billing">
            <Column 
              title="Factura" 
              dataIndex="number" 
              key="number"
              sorter={(a, b) => a.number - b.number}
              render={(invoiceNumber, invoice) => (
                <Anchor
                  variant="primary"
                  underlined
                  onClick={() => router.push(`/companies/${companyId}/invoices/${invoice.id}?subscriptionId=${subscriptionId}`)}
                >{ invoiceNumber }</Anchor>
              )}
            />
            <Column 
              title="Emitido el" 
              dataIndex="created" 
              key="created"
              render={(created) => moment.unix(created).format(stripeDateFormat)}
            />
            <Column title="Vence el" 
              dataIndex="period_end" 
              key="period_end"
              render={(created) => moment.unix(created).format(stripeDateFormat)}
            />
            <Column
              title="Estado"
              dataIndex="status"
              key="status"
            />
            <Column
              title="Total"
              dataIndex="total"
              key="total"
              render={(total, item) => `${formatAmount(total)} ${getCurrencySymbol[item.currency]}`}
            />
            <Column
              key="action"
              render={(invoice) => (
                <DownloadOutlined onClick={() => downloadPdf(invoice.invoice_pdf)}/>
              )}
            />
          </Table>
        </Desktop>
    </InvoiceTableContainer>
  );
};

const InvoiceTableContainer = styled.div`
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
`;
