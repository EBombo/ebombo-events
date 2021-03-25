import React, {useState} from "reactn";
import styled from "styled-components";
import {ButtonBombo, Input, TextArea} from "../../components";
import {useForm} from "react-hook-form";
import {object, string} from "yup";
import get from "lodash/get";
import {firestore} from "../../firebase";
import {useResizeImage, useUploadToStorage} from "../../utils/useHooks";
import defaultTo from "lodash/defaultTo";

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

  const saveEvent = async (data) => {
    setLoading(true);
    let imageUrl = null;

    if (imgBase64 && fileSuffix) {
      imageUrl = await uploadToStorageAndGetURL(
        imgBase64,
        `/events/held-events/${props.currentEvent.id}`,
        `backgroundImage`,
        fileSuffix
      );
    }

    let heldEvents;

    if (
      defaultTo(get(props, "events.heldEvents"), []).some(
        (game) => game.id === props.currentEvent.id
      )
    ) {
      heldEvents = defaultTo(get(props, "events.heldEvents"), []).map((game) =>
        game.id === props.currentEvent.id ? mapGame(data, imageUrl, game) : game
      );
    } else {
      heldEvents = defaultTo(get(props, "events.heldEvents"), []);
      heldEvents.push(mapGame(data, imageUrl));
    }

    await firestore.doc(`landings/events`).update({
      heldEvents,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapGame = (data, imageUrl, oldGame = null) => {
    if (oldGame) {
      const heldEvent = {
        ...props.currentEvent,
        description: data.description,
      };
      if (imageUrl) heldEvent["backgroundImageUrl"] = imageUrl;
      return heldEvent;
    }
    return {
      ...props.currentEvent,
      description: data.description,
      backgroundImageUrl: imageUrl,
    };
  };

  const manageImage = (event) => {
    if (event.target.files[0]) {
      setFileSuffix(event.target.files[0].name.split(".")[1]);
      resize(event, 250, 450).then((imageBase64_) =>
        setImgBase64(imageBase64_.split(",")[1])
      );
    }
  };

  return (
    <Container>
      <div className="title">Evento Realizado</div>
      <form onSubmit={handleSubmit(saveEvent)}>
        <TextArea
          variant="primary"
          name="description"
          ref={register}
          error={errors.description}
          required
          label="Descripción:"
          defaultValue={get(props, "currentEvent.description", "")}
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
