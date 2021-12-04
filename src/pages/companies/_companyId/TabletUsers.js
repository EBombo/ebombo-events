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

  const orderUsers = () => orderBy(props.users, [`${key}`], ["asc"]);

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
          optionsdom={usersOrder.map((reason) => ({
            key: reason.id,
            code: reason.code,
            name: reason.name,
          }))}
          onChange={(value) => setKey(value)}
        />
      </div>

      <div className="users">
        {orderUsers().map((user, index) => (
          <div className="user-content" key={`${user.nickname}-${index}`}>
            <div className="checkbox-container">
              <Checkbox />
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
