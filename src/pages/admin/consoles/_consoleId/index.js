import { message } from "antd";
import { firestore } from "../../../../firebase";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ButtonBombo, Input } from "../../../../components";
import { spinLoader } from "../../../../utils";
import get from "lodash/get";
import { object, string } from "yup";
import { useHistory } from "react-router";

const newConsole = {
  name: "",
  deleted: false,
};

export const AdminConsoleEdit = (props) => {
  const schema = object().shape({
    name: string().required(),
  });

  const params = useParams();
  const history = useHistory();
  const [isSavingConsole, setIsSavingConsole] = useState(false);
  const [console, setConsole] = useState({});
  const [isLoadingConsole, setIsLoadingConsole] = useState(true);
  const { register, errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchConsole();
  }, []);

  const fetchConsole = async () => {
    if (params.consoleId === "new") {
      const new_id = firestore.collection("consoles").doc().id;
      setConsole({ ...newConsole, id: new_id });
    } else {
      const consoleRef = await firestore
        .collection("consoles")
        .doc(params.consoleId)
        .get();
      consoleRef.exists
        ? setConsole(consoleRef.data())
        : history.push("/notFound");
    }
    setIsLoadingConsole(false);
  };

  const mapConsole = (data) => ({
    id: console.id,
    name: data.name,
    createAt: console.createAt ? console.createAt : moment().toDate(),
    updateAt: console.updateAt ? console.updateAt : moment().toDate(),
    deleted: console.deleted,
  });

  const saveConsole = async (data) => {
    try {
      setIsSavingConsole(true);
      let currentConsole = mapConsole(data);
      if (params !== "new")
        currentConsole = { ...currentConsole, updateAt: moment().toDate() };

      await firestore
        .doc("consoles/" + console.id)
        .set(currentConsole, { merge: true });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingConsole(false);
  };

  if (isLoadingConsole) return spinLoader();

  return (
    <div>
      <form onSubmit={handleSubmit(saveConsole)} noValidate>
        <h2 className="text-decoration-h2">CONSOLAS</h2>
        <Input
          variant="secondary"
          error={errors.name}
          required
          label="Nombre de consola"
          ref={register}
          name="name"
          placeholder="Nombre de consola"
          type="text"
          defaultValue={get(console, "name", "")}
        />
        <div style={{ display: "flex" }}>
          <ButtonBombo
            type="secondary"
            margin="0"
            disabled={isSavingConsole}
            onClick={() => history.goBack()}
          >
            Cancelar
          </ButtonBombo>
          <ButtonBombo
            type="primary"
            loading={isSavingConsole}
            style={{ marginLeft: "10px" }}
            disabled={isSavingConsole}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
        </div>
      </form>
    </div>
  );
};
