import React, { useState } from "reactn";
import styled from "styled-components";
import { ButtonAnt } from "../../components/form";
import { TextArea, Input } from "../../components/form";
import { FileUpload } from "../../components/common/FileUpload";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import get from "lodash/get";
import { firestore } from "../../firebase";
import defaultTo from "lodash/defaultTo";

const EditSpecials = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    description: string().required(),
    name: string().required(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveComment = async (data) => {
    setLoading(true);

    let elements;

    if (
      defaultTo(get(props, `events.${props.currentField}`), []).some(
        (special) => special.id === props.currentElement.id
      )
    ) {
      elements = defaultTo(get(props, `events.${props.currentField}`), []).map(
        (special) =>
          special.id === props.currentElement.id
            ? mapElement(data, special)
            : special
      );
    } else {
      elements = defaultTo(get(props, `events.${props.currentField}`), []);
      elements.push(mapElement(data));
    }

    console.log(props.currentField, elements);

    await firestore.doc(`landings/events`).update({
      [props.currentField]: elements,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapElement = (data, oldElement = null) => {
    if (oldElement) {
      const element = {
        ...props.currentElement,
        description: data.description,
        name: data.name,
      };
      if (imageUrl) element["imageUrl"] = imageUrl;
      return element;
    }
    return {
      ...props.currentElement,
      description: data.description,
      name: data.name,
      imageUrl: imageUrl,
    };
  };

  return (
    <Container>
      <div className="title">
        {props.currentField === "specialGuests" ? "Invitados" : "Regalos"}{" "}
        Especiales
      </div>
      <form onSubmit={handleSubmit(saveComment)}>
        <Input
          variant="primary"
          name="name"
          ref={register}
          error={errors.name}
          required
          label="Nombre:"
          defaultValue={get(props, "currentElement.name", "")}
          placeholder="Nombre"
        />
        <TextArea
          variant="primary"
          name="description"
          ref={register}
          error={errors.description}
          required
          label="Descripción:"
          defaultValue={get(props, "currentElement.description", "")}
          placeholder="Descripción del juego"
        />
        <div className="image-component">
          <FileUpload
            preview={true}
            file={get(props, "currentElement.imageUrl", "")}
            fileName="imageUrl"
            filePath={`/events/specials/${props.currentElement.id}`}
            bucket="landings"
            sizes={get(props, "sizes", "500x500")}
            afterUpload={(imageUrls) => setImageUrl(imageUrls[0].url)}
          />
        </div>
        <div className="buttons-container">
          <ButtonAnt
            variant="contained"
            color="primary"
            margin="0"
            loading={loading}
            disabled={loading}
            htmlType="submit"
          >
            Guardar
          </ButtonAnt>
          <ButtonAnt
            variant="outlined"
            color="danger"
            margin="0"
            loading={loading}
            disabled={loading}
            onClick={() => props.setIsVisibleModal(false)}
          >
            Cancelar
          </ButtonAnt>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  margin: 1rem 0;

  .title {
    font-size: 18px;
    line-height: 22px;
    color: ${(props) => props.theme.basic.white};
  }

  form {
    margin-top: 1rem;

    .buttons-container {
      display: flex;
      justify-content: space-around;
    }

    .image-component {
      margin: 1rem auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

export default EditSpecials;
