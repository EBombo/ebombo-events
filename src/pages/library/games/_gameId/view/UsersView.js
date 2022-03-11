import React, { useState, useEffect } from "react";
import { Tooltip, Table } from "antd";
import { config, firestoreBingo, firestoreHanged, firestoreRoulette, firestoreTrivia } from "../../../../../firebase";
import { darkTheme } from "../../../../../theme";
import { Image } from "../../../../../components/common/Image";
import { Input } from "../../../../../components/form";
import { snapshotToArray } from "../../../../../utils";

export const UsersView = (props) => {
  const [selectionType, setSelectionType] = useState("checkbox");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      let gameRef;
      if (props.game?.adminGame?.name === "bingo") {
        gameRef = firestoreBingo.collection("visitors");
      }

      if (props.game?.adminGame?.name === "trivia") {
        gameRef = firestoreTrivia.collection("visitors");
      }

      if (props.game?.adminGame?.name === "hanged") {
        gameRef = firestoreHanged.collection("visitors");
      }

      if (props.game?.adminGame?.name === "roulette") {
        gameRef = firestoreRoulette.collection("visitors");
      }

      gameRef.where("game.id", "==", props.game.id).onSnapshot((usersSnapshot) => {
        const _users = snapshotToArray(usersSnapshot);

        setUsers(_users.map((user, index) => ({ ...user, key: index + 1 })));
      });
    };

    fetchUsers();
  }, []);

  const columns = [
    {
      title: "Nombre del jugador",
      dataIndex: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Apellido",
      dataIndex: "lastName",
    },
    {
      title: "Correo",
      dataIndex: "email",
    },
    {
      title: "Asistencia",
      dataIndex: "attendance",
      render: (value) => (
          <div className="flex items-center justify-center">

              <Image
                src={`${config.storageUrl}/resources/attendance-${value ? "true" : "false"}.svg`}
                width="10px"
                height="10px"
                margin="0"
                size="contain"
              />
          </div>
      ),
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  return (
    <div className="p-4 max-w-full md:h-[calc(100vh-2rem-50px)] md:p-8">
      <div className="flex w-full justify-end">
        <div className="flex items-center w-full max-w-[380px] gap-4">
          <Input type="search" placeholder="Buscar" />

          <Tooltip
            placement="bottomRight"
            trigger="click"
            title={
              <div className="bg-whiteLight box-border color-grayLight">
                <div
                  className="flex items-center font-['Lato'] text-[16px] leading-[19px] p-2 cursor-pointer text-blackDarken"
                  onClick={() => props.setIsVisibleModalMove(true)}
                >
                  <Image
                    src={`${config.storageUrl}/resources/move.svg`}
                    width={"16px"}
                    height={"16px"}
                    size={"contain"}
                    margin={"0 15px 0 0"}
                  />
                  Exportar Excel
                </div>
              </div>
            }
            color={darkTheme.basic.whiteLight}
          >
            <div className="h-[18px] flex justify-evenly flex-col items-center cursor-pointer px-[5px] py-0">
              <div className="w-[4px] h-[4px] rounded-[50%] bg-black" />
              <div className="w-[4px] h-[4px] rounded-[50%] bg-black" />
              <div className="w-[4px] h-[4px] rounded-[50%] bg-black" />
            </div>
          </Tooltip>
        </div>
      </div>

      <div className="my-4">
        <div className="min-w-[700px]">
          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            columns={columns}
            dataSource={users}
          />
        </div>
      </div>
    </div>
  );
};
