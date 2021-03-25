import React, {useEffect, useState} from "reactn";
import {firestore} from "../../../../../firebase";
import {useHistory, useParams} from "react-router";
import {spinLoader} from "../../../../../utils";
import {Checkbox, message} from "antd";
import get from "lodash/get";
import map from "lodash/map";
import mapValues from "lodash/mapValues";
import acls from "../../../../../acl/acls.json";
import {Controller, useForm} from "react-hook-form";
import flatMap from "lodash/flatMap";
import isEmpty from "lodash/isEmpty";
import {ButtonBombo} from "../../../../../components";

export const AdminUserAcls = (props) => {
  const history = useHistory();
  const { userId } = useParams();
  const [user, setUser] = useState({});
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [allChecked, setAllChecked] = useState(false);

  const { handleSubmit, control, setValue, watch } = useForm({
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchUser();
    setAllChecked(validateAll());
  }, [watch]);

  const validateAll = () => {
    const allCheckboxes = watch();
    if (isEmpty(allCheckboxes)) return;
    const cbxValues = Object.values(allCheckboxes);
    return cbxValues.every((item) => item);
  };

  const fetchUser = async () => {
    const userQuery = await firestore.doc(`users/${userId}`).get();

    if (!userQuery.exists) return history.push("/");

    setUser(userQuery.data());
    setLoadingUser(false);
  };

  const updateUser = async (data) => {
    console.log("data->", data);
    setLoadingUpdateUser(true);
    const newAcls = mapValues(data, (moduleUrls) =>
      map(moduleUrls, (moduleUrl, key) => (moduleUrl ? key : null)).filter(
        (moduleUrl) => moduleUrl
      )
    );

    await firestore.doc(`users/${userId}`).update({
      acls: newAcls,
      isAdmin: flatMap(Object.values(newAcls)).some((acl) =>
        acl.includes("admin")
      ),
    });

    message.success("Guardado!");
    setLoadingUpdateUser(false);
  };

  const toggle = () =>
    map(acls, (moduleAcl, module) => {
      map(moduleAcl.items, (description, urlAcl) => {
        setValue(`${module}.${urlAcl}`, !allChecked);
        setAllChecked(!allChecked);
      });
    });

  return loadingUser ? (
    spinLoader()
  ) : (
    <form onSubmit={handleSubmit(updateUser)} noValidate>
      <div>
        Nombre: <b>{user.name}</b>
      </div>
      <div>
        Email: <b>{user.email}</b>
      </div>
      <div>
        Nick: <b>{user.nickname}</b>
      </div>
      <br />
      <hr />
      <h3>PERMISOS PARA ADMINISTRADORES</h3>
      <hr />
      <br />
      <label>
        <input type="checkbox" onClick={toggle} checked={allChecked} /> Marcar
        todos
      </label>
      {map(acls, (moduleAcl, module) => (
        <ul key={module}>
          <li>{moduleAcl.label}</li>
          {map(moduleAcl.items, (description, urlAcl) => (
            <React.Fragment key={urlAcl}>
              <Controller
                name={`${module}.${urlAcl}`}
                control={control}
                onChange={([value]) => value.target.checked}
                defaultValue={get(user, `acls[${module}]`, []).includes(urlAcl)}
                as={<Checkbox>{description}</Checkbox>}
              />
              <br />
            </React.Fragment>
          ))}
        </ul>
      ))}

      <ButtonBombo
        type="primary"
        htmlType="submit"
        loading={loadingUpdateUser}
        disabled={loadingUpdateUser}
      >
        GUARDAR
      </ButtonBombo>
    </form>
  );
};
