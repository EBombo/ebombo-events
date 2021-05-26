import React, { useState } from "reactn";
import styled from "styled-components";
import {FileUpload, Input, TextArea, ModalContainer} from "../../components";
import { useForm } from "react-hook-form";
import { string, object } from "yup";
import get from "lodash/get";
import { ButtonBombo } from "../../components";
import { firestore } from "../../firebase";
import defaultTo from "lodash/defaultTo";

export default (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    description: string().required(),
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
        (game) => game.id === props.currentElement.id
      )
    ) {
      elements = defaultTo(
        get(props, `events.${props.currentField}`),
        []
      ).map((game) =>
        game.id === props.currentElement.id
          ? mapElement(data, game)
          : game
      );
    } else {
      elements = defaultTo(get(props, `events.${props.currentField}`), []);
      elements.push(mapElement(data));
    }

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
      };
      if (imageUrl) element["imageUrl"] = imageUrl;
      return element;
    }
    return {
      ...props.currentElement,
      description: data.description,
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
              file={get(props, "currentElement.imageUrl", "")}
              fileName="imageUrl"
              filePath={`/events/comments/${props.currentElement.id}`}
              bucket="landings"
              sizes="250x250"
              afterUpload={(imageUrls) =>
                  setImageUrl(imageUrls[0])
              }
          />
        </div>
        <div className="buttons-container">
          <ButtonBombo
            type="primary"
            margin="0"
            loading={loading}
            disabled={loading}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
          <ButtonBombo
            type="secondary"
            margin="0"
            loading={loading}
            disabled={loading}
            onClick={() => props.setIsVisibleModal(false)}
          >
            Cancelar
          </ButtonBombo>
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
