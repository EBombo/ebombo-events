import React, {useState} from "reactn";
import styled from "styled-components";
import {ButtonBombo, Input, TextArea} from "../../components";
import {useForm} from "react-hook-form";
import {object, string} from "yup";
import get from "lodash/get";
import {firestore} from "../../firebase";
import {useResizeImage} from "../../utils/useHooks/useResizeImage";
import defaultTo from "lodash/defaultTo";
import {useUploadToStorage} from "../../utils/useHooks/useUploadToStorage";

export default (props) => {
  const [imgBase64, setImgBase64] = useState(null);
  const [fileSuffix, setFileSuffix] = useState(null);
  const [loading, setLoading] = useState(false);

  const { resize } = useResizeImage();
  const { uploadToStorageAndGetURL } = useUploadToStorage();

  const schema = object().shape({
    description: string().required(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveComment = async (data) => {
    setLoading(true);
    let imageUrl = null;

    if (imgBase64 && fileSuffix) {
      imageUrl = await uploadToStorageAndGetURL(
        imgBase64,
        `/events/comments/${props.currentElement.id}`,
        `imageUrl`,
        fileSuffix
      );
    }

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
          ? mapElement(data, imageUrl, game)
          : game
      );
    } else {
      elements = defaultTo(get(props, `events.${props.currentField}`), []);
      elements.push(mapElement(data, imageUrl));
    }

    await firestore.doc(`landings/events`).update({
      [props.currentField]: elements,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapElement = (data, imageUrl, oldElement = null) => {
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

  const manageImage = (event) => {
    if (event.target.files[0]) {
      setFileSuffix(event.target.files[0].name.split(".")[1]);
      resize(event, 250, 250).then((imageBase64_) =>
        setImgBase64(imageBase64_.split(",")[1])
      );
    }
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
        <Input
          type="file"
          variant="primary"
          error={errors.backgroundImageUrl}
          name="backgroundImageUrl"
          onChange={manageImage}
        />
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
  }
`;
