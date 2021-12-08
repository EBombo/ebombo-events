import React, { useState, useEffect } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Table, Space } from "antd";
import { Breadcrumb } from 'antd';
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";
import { mediaQuery, Desktop, Tablet } from "../../../../constants";
import { PanelBox } from "../../../../components/common/PanelBox";
import { Anchor } from "../../../../components/form";
import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils";

const { Column } = Table;

const data = [
  {
    key: '1',
    billingId: "abcde1",
    firstName: 'John',
    lastName: 'Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    billingId: "abcde2",
    firstName: 'Jim',
    lastName: 'Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    billingId: "abcde3",
    firstName: 'Joe',
    lastName: 'Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const downloadPdf = (pdfUrl) => window.open(pdfUrl, "blank");

export const InvoiceTable = (props) => {
  const router = useRouter();
  const {userId, subscriptionId} = router.query;

  const [invoices, setInvoices] = useState([]);

  const fetchInvoices = () => firestore.collection(`customers/${userId}/subscriptions/${subscriptionId}/invoices`).get();

  useEffect(() => {
    if (!subscriptionId) return;

    const getInvoices = async () =>
      setInvoices(snapshotToArray(await fetchInvoices()));

    return getInvoices();
  }, [subscriptionId]);

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
            <Column title="Emitido el" dataIndex="created" key="created" />
            <Column title="Vence el" dataIndex="period_end" key="period_end" />
            <Column
              title="Estado"
              dataIndex="status"
              key="status"
            />
            <Column
              title="Total"
              dataIndex="total"
              key="total"
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
