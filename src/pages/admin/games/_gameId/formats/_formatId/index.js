import { Button, message } from "antd";
import { firestore } from "../../../../../../firebase";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ButtonBombo, Input } from "../../../../../../components";
import { spinLoader } from "../../../../../../utils/loader";
import get from "lodash/get";
import { object, string } from "yup";
import { useHistory } from "react-router";

const newFormat = {
  name: "",
  description: "",
  deleted: false,
};

export const AdminFormatEdit = (props) => {
  const schema = object().shape({
    name: string().required(),
    description: string().required(),
  });

  const params = useParams();
  const history = useHistory();
  const [isSavingFormat, setIsSavingFormat] = useState(false);
  const [format, setFormat] = useState({});
  const [isLoadingFormat, setIsLoadingFormat] = useState(true);
  const { register, errors, handleSubmit } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchFormat();
  }, []);

  const fetchFormat = async () => {
    if (params.formatId === "new") {
      const new_id = firestore.collection("formats").doc().id;
      setFormat({ ...newFormat, id: new_id });
    } else {
      const formatRef = await firestore
        .collection("formats")
        .doc(params.formatId)
        .get();
      formatRef.exists
        ? setFormat(formatRef.data())
        : history.push("/notFound");
    }
    setIsLoadingFormat(false);
  };

  const mapFormat = (data) => ({
    id: format.id,
    name: data.name,
    description: data.description,
    gameId: params.gameId,
    createAt: format.createAt ? format.createAt : moment().toDate(),
    updateAt: format.updateAt ? format.updateAt : moment().toDate(),
    deleted: format.deleted,
  });

  const saveFormat = async (data) => {
    try {
      setIsSavingFormat(true);
      let currentFormat = mapFormat(data);
      if (params !== "new")
        currentFormat = { ...currentFormat, updateAt: moment().toDate() };

      await firestore
        .doc("formats/" + format.id)
        .set(currentFormat, { merge: true });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingFormat(false);
  };

  if (isLoadingFormat) return spinLoader();

  return (
    <div>
      <form onSubmit={handleSubmit(saveFormat)} noValidate>
        <h2 className="text-decoration-h2">FORMATO</h2>
        <Input
          variant="secondary"
          error={errors.name}
          required
          label="Nombre de formato"
          ref={register}
          name="name"
          placeholder="Nombre de formato"
          type="text"
          defaultValue={get(format, "name", "")}
        />
        <Input
          variant="secondary"
          error={errors.description}
          required
          label="Descripcion"
          ref={register}
          name="description"
          placeholder="Descripcion"
          type="text"
          defaultValue={get(format, "description", "")}
        />
        <div style={{ display: "flex" }}>
          <ButtonBombo
            type="secondary"
            margin="0"
            disabled={isSavingFormat}
            onClick={() => history.goBack()}
          >
            Cancelar
          </ButtonBombo>
          <ButtonBombo
            margin="0"
            loading={isSavingFormat}
            style={{ marginLeft: "10px" }}
            disabled={isSavingFormat}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
        </div>
      </form>
    </div>
  );
};
