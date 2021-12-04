import React, { useState } from "reactn";
import styled from "styled-components";
import { Table } from "antd";

const columns = [
  {
    title: "Correo electrónico",
    dataIndex: "email",
    sorter: true,
    width: "30%",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: true,
    width: "20%",
  },
  {
    title: "Usuario",
    dataIndex: "username",
    sorted: true,
    width: "20%",
  },
  {
    title: "Rol",
    dataIndex: "role",
    filters: [
      { text: "Owner", value: "owner" },
      { text: "Admin", value: "admin" },
      { text: "Miembro", value: "member" },
    ],
    width: "20%",
  },
  {
    title: "Estado",
    dataIndex: "status",
    filters: [
      { text: "Activo", value: "active" },
      { text: "Pendiente", value: "pending" },
      { text: "Expirado", value: "expire" },
    ],
    width: "10%",
  },
];

export const DesktopUsers = (props) => {
  const [data] = useState(props.users);
  const [loading, setLoading] = useState(false);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
  };

  return (
    <UsersContainer>
      <div className="search-container">

      </div>

      <div className="table-container">
        <Table
          rowSelection={{
            type: <checkbox />,
            ...rowSelection,
          }}
          columns={columns}
          dataSource={data}
        />
      </div>
    </UsersContainer>
  );
};

const UsersContainer = styled.div`
  width: 100%;
`;
