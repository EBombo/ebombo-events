import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { Breadcrumb } from 'antd';
import { useRouter } from "next/router";
import { Anchor } from "../../../../components/form";
import { mediaQuery } from "../../../../constants";
import { InvoiceTable } from "./InvoiceTable";

export const AllInvoices = (props) => {
  const router = useRouter();
  const { companyId, subscriptionId } = router.query;

  const [authUser] = useGlobal("user");

  return (
    <AllInvoicesStyled>
      <div className="breadcrumb-container">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Anchor 
              className="item-link"
              onClick={() => router.push(`/companies/${companyId}/billing?subscriptionId=${subscriptionId}`)}
            >Cuenta</Anchor>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Anchor 
              className="item-link"
              onClick={() => router.push(`/companies/${companyId}/invoices`)}
            >Todas las facturas</Anchor>
          </Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="title">Facturas</div>
      <InvoiceTable {...props} userId={authUser?.id} />
    </AllInvoicesStyled>
  );
};

const AllInvoicesStyled = styled.div`
  margin: 12px 1rem 0 1rem;

  ${mediaQuery.afterTablet} {
    max-width: 1200px;
    margin: 12px auto 0 auto;
  }

  .title {
    font-size: 21px;
    margin-bottom: 1rem;
  }

  .breadcrumb-container {
    padding: 1rem 0 1rem 0;
  }

`;
