import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import moment from "moment";
import { useRouter } from "next/router";
import { Table, Space } from "antd";
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { mediaQuery, Desktop, Tablet } from "../../../../constants";
import { getCurrencySymbol, stripeDateFormat } from "../../../../components/common/DataList";
import { Anchor } from "../../../../components/form";
import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils";
import { formatAmount } from "../../../../stripe";

const { Column } = Table;

const downloadPdf = (pdfUrl) => window.open(pdfUrl, "blank");

export const InvoiceTable = (props) => {
  const router = useRouter();
  const {userId, subscriptionId} = router.query;

  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = () => firestore.collection(`customers/${userId}/subscriptions/${subscriptionId}/invoices`).get();

  useEffect(() => {
    if (invoices.length) return;

    const getInvoices = async () =>
      setInvoices(snapshotToArray(await fetchInvoices()));

    return getInvoices();
  }, [invoices]);

  return (
    <InvoiceTableContainer {...props}>
        <Tablet>
          <Table dataSource={invoices}>
            <Column 
              title="Factura" 
              dataIndex="number"
              key="number" 
              sorter={(a, b) => a.created - b.created}
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
                  onClick={() => router.push(`/users/${userId}/invoices/${invoice.id}?subscriptionId=${subscriptionId}`)}
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
`;
