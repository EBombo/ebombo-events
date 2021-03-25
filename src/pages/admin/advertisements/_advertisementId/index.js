import React, {useEffect, useState} from "react";
import {Checkbox, message} from "antd";
import {firestore} from "../../../../firebase";
import moment from "moment";
import {useParams} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {ButtonBombo, Input} from "../../../../components";
import {spinLoader} from "../../../../utils";
import get from "lodash/get";
import {boolean, object, string} from "yup";
import {useHistory} from "react-router";

const newAdvertisement = {
  name: "",
  description: "",
  link: "https://",
  requireRegistration: false,
  deleted: false,
};

export const AdminAdvertisementEdit = () => {
  const schema = object().shape({
    name: string().required(),
    description: string().required(),
    link: string().url().required(),
    requireRegistration: boolean().required(),
  });

  const { advertisementId } = useParams();
  const history = useHistory();
  const [isSavingAdvertisement, setIsSavingAdvertisement] = useState(false);
  const [advertisement, setAdvertisement] = useState({});
  const [isLoadingAdvertisement, setIsLoadingAdvertisement] = useState(true);

  const { register, errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchAdvertisement();
  }, []);

  const fetchAdvertisement = async () => {
    if (advertisementId === "new") {
      const new_id = firestore.collection("advertisements").doc().id;
      setAdvertisement({ ...newAdvertisement, id: new_id });
    } else {
      const advertisementRef = await firestore
        .doc(`advertisements/${advertisementId}`)
        .get();
      advertisementRef.exists
        ? setAdvertisement(advertisementRef.data())
        : history.push("/notFound");
    }
    setIsLoadingAdvertisement(false);
  };

  const mapAdvertisement = (data) => ({
    id: advertisement.id,
    name: data.name,
    description: data.description,
    link: data.link,
    requireRegistration: data.requireRegistration,
    createAt: advertisement.createAt
      ? advertisement.createAt
      : moment().toDate(),
    updateAt: moment().toDate(),
    deleted: advertisement.deleted,
  });

  const saveAdvertisement = async (data) => {
    setIsSavingAdvertisement(true);
    try {
      let currentAdvertisement = mapAdvertisement(data);

      await firestore
        .doc("advertisements/" + advertisement.id)
        .set(currentAdvertisement, { merge: true });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingAdvertisement(false);
  };

  return isLoadingAdvertisement ? (
    spinLoader()
  ) : (
    <div>
      <form onSubmit={handleSubmit(saveAdvertisement)} noValidate>
        <h2 className="text-decoration-h2">ANUNCIOS</h2>
        <Input
          variant="secondary"
          error={errors.name}
          required
          label="Nombre del Anuncio"
          ref={register}
          name="name"
          placeholder="Nombre del Anuncio"
          type="text"
          defaultValue={get(advertisement, "name", "")}
        />
        <Input
          variant="secondary"
          error={errors.description}
          required
          label="Descripción del Anuncio"
          ref={register}
          name="description"
          placeholder="Descripción del Anuncio"
          type="text"
          defaultValue={get(advertisement, "description", "")}
        />
        <Input
          variant="secondary"
          error={errors.link}
          required
          label="Link del Anuncio"
          ref={register}
          name="link"
          placeholder="Link del Anuncio"
          type="text"
          defaultValue={get(advertisement, "link", "")}
        />
        <Controller
          name="requireRegistration"
          control={control}
          onChange={([value]) => value.target.checked}
          defaultValue={get(advertisement, "requireRegistration", false)}
          as={<Checkbox>PARA USUARIO QUE HAN INICIADO SESIÓN</Checkbox>}
        />
        <br />
        <br />
        <div style={{ display: "flex" }}>
          <ButtonBombo
            margin="0"
            type="primary"
            loading={isSavingAdvertisement}
            disabled={isSavingAdvertisement}
            htmlType="submit"
          >
            GUARDAR
          </ButtonBombo>
          <ButtonBombo
            margin="0"
            type="default"
            disabled={isSavingAdvertisement}
            onClick={() => history.goBack()}
          >
            CANCELAR
          </ButtonBombo>
        </div>
      </form>
    </div>
  );
};
