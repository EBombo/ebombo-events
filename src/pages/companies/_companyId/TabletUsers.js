import React, { useState } from "reactn";
import { ButtonAnt, Checkbox, Select } from "../../../components/form";
import { usersOrder } from "../../../components/common/DataList";
import { darkTheme } from "../../../theme";
import { Image } from "../../../components/common/Image";
import { config } from "../../../firebase";
import { InfoCircleOutlined } from "@ant-design/icons";
import orderBy from "lodash/orderBy";

export const TabletUsers = (props) => {
  const [key, setKey] = useState("email");
  const [users, setUsers] = useState(props.users.map((user) => ({ ...user, isChecked: false })));

  const orderUsers = () => orderBy(users, [`${key}`], ["asc"]);

  const handleCheckChieldElement = (event, userId) => {
    const newUsers = users.map((user) => {
      if (user.id === userId) {
        user.isChecked = event.target.checked;
        props.setSelectedUsers([...props.selectedUsers, user]);
      }
      return user;
    });

    if (!event.target.checked) {
      const selectedUsers = props.selectedUsers.filter((user) => user.id !== userId);
      console.log(selectedUsers);
      props.setSelectedUsers(selectedUsers);
    }

    setUsers(newUsers);
  };

  const handleAllChecked = (event) => {
    const newUsers = users.map((user) => ({ ...user, isChecked: event.target.checked }));
    if (event.target.checked) {
      props.setSelectedUsers(props.users);
    } else {
      props.setSelectedUsers([]);
    }

    setUsers(newUsers);
  };

  return (
    <>
      <div className="order">
        <label htmlFor="order">Ordenar por:</label>
        <Select
          showSearch
          defaultValue={usersOrder[0].name}
          virtual={false}
          borderRight={`0.1px solid ${darkTheme.basic.grayLighten}`}
          borderTop={`0.1px solid ${darkTheme.basic.grayLighten}`}
          borderLeft={`0.1px solid ${darkTheme.basic.grayLighten}`}
          borderBottom={`0.1px solid ${darkTheme.basic.grayLighten}`}
          optionFilterProp="children"
          optionsdom={usersOrder.map((order) => ({
            key: order.id,
            code: order.code,
            name: order.name,
          }))}
          onChange={(value) => setKey(value)}
        />
      </div>

      <div className="users">
        <div className="top-table-container">
          <div className="table-header">
            <div className="checkbox-container">
              <input type="checkbox" onClick={(e) => handleAllChecked(e)} value="checkedall" />
            </div>
            <div className="filter">{usersOrder.find((order) => order.code === key).name}</div>
          </div>
          <div className={`${props.selectedUsers.length > 0 ? "btns-container" : "hidden"}`}>
            <ButtonAnt color="default" onClick={() => props.setIsVisibleModalEditUser(true)} margin="0 10px 0 10px">
              Editar
            </ButtonAnt>
            <ButtonAnt color="danger" onClick={props.showConfirm} margin="0 10px 0 0">
              Eliminar
            </ButtonAnt>
          </div>
        </div>
        {orderUsers().map((user, index) => (
          <div className="user-content" key={`${user.email}-${index}`}>
            <div className="checkbox-container">
              <Checkbox checked={user.isChecked} onChange={(e) => handleCheckChieldElement(e, user.id)} />
            </div>
            <Image
              src={user.profileImgUrl ?? `${config.storageUrl}/resources/user-profile.svg`}
              height="31px"
              width="31px"
              borderRadius="50%"
              size="cover"
            />
            <div className="attribute">{user[`${key}`]}</div>
          </div>
        ))}
      </div>

      <div className="more">
        <InfoCircleOutlined style={{ fontSize: "16px", color: darkTheme.basic.secondary }} />

        <div className="text">Accede a más funciones</div>

        <ButtonAnt color="secondary">Actualizar ahora</ButtonAnt>
      </div>
    </>
  );
};
