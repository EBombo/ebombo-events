import React, { useGlobal } from "reactn";
import styled from "styled-components";
import { mediaQuery, Desktop, Tablet } from "../../../../../constants";
import { PanelBox } from "../../../../../components/common/PanelBox";
import { Anchor } from "../../../../../components/form";
import { useRouter } from "next/router";
import { Table, Space } from "antd";
import { Breadcrumb } from 'antd';
import { DownloadOutlined, PrinterOutlined } from "@ant-design/icons";

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
      <div>
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
    </BillIdContainer>
  )
};

const BillIdContainer = styled.div`
  .item-link {
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 22px;
  }
`;
