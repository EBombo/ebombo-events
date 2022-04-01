import React, { useEffect, useGlobal, useState } from "reactn";
import { Anchor, ButtonAnt, Input, Select, TextArea } from "../../../../components/form";
import { Table } from "antd";
import isEmpty from "lodash/isEmpty";
import { firestore } from "../../../../firebase";
import { snapshotToArray } from "../../../../utils/snapshotToArray";

const filterOptions = [
  {
    key: "email",
    name: "Correo",
  },
  {
    key: "role",
    name: "Rol",
  },
  {
    key: "status",
    name: "Estado",
  },
];

export const columns = [
  {
    title: "Correo",
    dataIndex: "email",
    render: (text) => (
      <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">{text}</div>
    ),
  },
  {
    title: "Rol",
    dataIndex: "role",
    render: (text) => (
      <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">
        {text === "member" ? "Miembro" : text === "visitor" ? "Visitante" : "Administrador"}
      </div>
    ),
  },
  {
    title: "Estado",
    dataIndex: "status",
    render: (text) => (
      <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">
        {text === "Active" ? "Activo" : "Inactivo"}
      </div>
    ),
  },
];

export const EventStepTwo = (props) => {
  const [authUser] = useGlobal("user");

  const [members, setMembers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [visitors, setVisitors] = useState("");

  useEffect(() => {
    if (!authUser?.company) return;

    const fetchMembers = () =>
      firestore
        .collection("companies")
        .doc(authUser?.company.id)
        .collection("members")
        .where("delete", "==", false)
        .onSnapshot((membersSnapshot) => {
          const _members = snapshotToArray(membersSnapshot);
          setMembers(_members);
        });

    const unsubscribeMembers = fetchMembers();

    return () => unsubscribeMembers && unsubscribeMembers();
  }, []);

  const deleteSelectedUsers = () => {};

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedUsers(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const validateStepTwo = () => {
    const visitorsArray = visitors.split("\n");

    const _visitors = visitorsArray.map((visitor) => ({
      email: visitor,
      role: "visitor",
      createAt: new Date(),
      id: firestore.collection("companies").doc(authUser?.company.id).collection("members").doc().id,
      searchName: [visitor.toUpperCase()],
      status: "Active",
    }));

    props.setEvent({
      ...props.event,
      members: [...members, ..._visitors],
    });

    props.setCurrentStep(3);
  };

  return (
    <div>
      <div className="text-primary text-['Lato'] font-[700] text-[20px] leading-[24px] md:text-[44px] md:leading-[53px] tracking-[.03em]">
        Invitados
      </div>

      <div className="flex mt-8 gap-8 w-full flex-col md:flex-row">
        <div>
          <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] text-secondary">
            Selecciona a los invitados de tu evento.
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[5px]">
              <div>Filtrar por:</div>
              <Select
                showSearch
                defaultValue={"email"}
                virtual={false}
                optionFilterProp="children"
                optionsdom={filterOptions.map((filter) => ({
                  key: filter.key,
                  code: filter.key,
                  name: filter.name,
                }))}
              />
            </div>
            <div>
              <Input type="search" placeholder="Buscar" />
            </div>
          </div>
          <div className="my-4 w-full overflow-auto">
            {!isEmpty(selectedUsers) && (
              <div
                className="my-4 cursor-pointer text-['Lato'] text-[12px] text-blackDarken leading-[14px] underline md:text-[16px] md:leading-[19px]"
                onClick={() => deleteSelectedUsers()}
              >
                Eliminar
              </div>
            )}
            <div className="min-w-[500px]">
              <Table
                selectedRowKeys={selectedRowKeys}
                rowSelection={{
                  type: "checkbox",
                  ...rowSelection,
                }}
                columns={columns}
                dataSource={members}
              />
            </div>
          </div>
        </div>
        <div className="w-full md:max-w-[400px]">
          <div className="text-['Lato'] font-[400] text-[18px] leading-[22px] text-secondary">Invitados extras</div>
          <div className="mt-4">
            <TextArea
              onChange={(e) => {
                e.preventDefault();
                setVisitors(e.target.value);
              }}
              color="black"
              background={"#FAFAFA"}
              border={"1px solid #C4C4C4"}
              value={visitors}
              placeholder={"Escribe\n" + "Cada\n" + "Correo\n" + "en una linea\n" + "unica"}
              name="visitors"
              rows="10"
            />
          </div>
          <ButtonAnt color="default" margin="1rem 0">
            Import Excel
          </ButtonAnt>

          {/* <Anchor underlined variant="secondary">
            Descargar plantilla de Excel
          </Anchor> */}
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <Anchor underlined variant="secondary" onClick={() => props.setCurrentStep(1)}>
          Volver
        </Anchor>
        <ButtonAnt onClick={() => validateStepTwo()}>Siguiente</ButtonAnt>
      </div>
    </div>
  );
};
