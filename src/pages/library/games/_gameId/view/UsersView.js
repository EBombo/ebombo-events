import React, { useEffect, useState } from "react";
import { Table, Tooltip } from "antd";
import { config, firestoreBingo, firestoreHanged, firestoreRoulette, firestoreTrivia } from "../../../../../firebase";
import { darkTheme } from "../../../../../theme";
import { Image } from "../../../../../components/common/Image";
import { Input } from "../../../../../components/form";
import { snapshotToArray } from "../../../../../utils";
import isEmpty from "lodash/isEmpty";

export const UsersView = (props) => {
  const [selectionType] = useState("checkbox");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentFirestore, setCurrentFirestore] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    if (!props.game) return;

    const fetchUsers = async () => {
      let gameRef;
      if (props.game?.adminGame?.name === "bingo") {
        gameRef = firestoreBingo.collection("visitors");
        setCurrentFirestore(firestoreBingo);
      }

      if (props.game?.adminGame?.name === "trivia") {
        gameRef = firestoreTrivia.collection("visitors");
        setCurrentFirestore(firestoreTrivia);
      }

      if (props.game?.adminGame?.name === "hanged") {
        gameRef = firestoreHanged.collection("visitors");
        setCurrentFirestore(firestoreHanged);
      }

      if (
        props.game?.adminGame?.name === "roulette" ||
        props.game?.adminGame?.name.toLowerCase().includes("questions")
      ) {
        gameRef = firestoreRoulette.collection("visitors");
        setCurrentFirestore(firestoreRoulette);
      }

      gameRef
        .where("game.id", "==", props.game.id)
        .where("deleted", "==", false)
        .onSnapshot((usersSnapshot) => {
          const _users = snapshotToArray(usersSnapshot);

          setUsers(_users.map((user, index) => ({ ...user, key: index + 1 })));
        });
    };

    fetchUsers();
  }, [props.game]);

  const columns = [
    {
      title: "Nombre del jugador",
      dataIndex: "name",
      render: (text) => (
        <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">{text}</div>
      ),
    },
    {
      title: "Apellido",
      dataIndex: "lastName",
      render: (text) => (
        <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">{text}</div>
      ),
    },
    {
      title: "Correo",
      dataIndex: "email",
      render: (text) => (
        <div className="text-['Lato'] text-blackDarken text-[12px] md:text-[16px] md:leading-[19px]">{text}</div>
      ),
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
      setSelectedUsers(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const deleteSelectedUsers = async () => {
    const usersPromise = selectedUsers.map(
      async (user) =>
        await currentFirestore
          .collection("visitors")
          .doc(user.id)
          .update({ ...user, deleted: true })
    );

    await Promise.all(usersPromise);

    setSelectedRowKeys([]);
  };

  return (
    <div className="p-4 max-w-[100vw] md:h-[calc(100vh-2rem-50px)] md:p-8">
      <div className="flex w-full justify-end">
        <div className="flex items-center w-full max-w-[350px] gap-4">
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

      <div className="my-4 w-full overflow-auto">
        {!isEmpty(selectedUsers) && (
          <div
            className="my-4 cursor-pointer text-['Lato'] text-[12px] text-blackDarken leading-[14px] underline md:text-[16px] md:leading-[19px]"
            onClick={() => deleteSelectedUsers()}
          >
            Eliminar
          </div>
        )}
        <div className="min-w-[700px]">
          <Table
            selectedRowKeys={selectedRowKeys}
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
