import React, { useState } from "reactn";
import styled from "styled-components";
import {FileUpload, Input, TextArea} from "../../components";
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

  const saveEvent = async (data) => {
    setLoading(true);

    let heldEvents;

    if (
      defaultTo(get(props, "events.heldEvents"), []).some(
        (game) => game.id === props.currentEvent.id
      )
    ) {
      heldEvents = defaultTo(get(props, "events.heldEvents"), []).map((game) =>
        game.id === props.currentEvent.id ? mapGame(data, game) : game
      );
    } else {
      heldEvents = defaultTo(get(props, "events.heldEvents"), []);
      heldEvents.push(mapGame(data));
    }

    await firestore.doc(`landings/events`).update({
      heldEvents,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapGame = (data, oldGame = null) => {
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
        <div className="image-component">
          <FileUpload
              file={get(props, "currentEvent.backgroundImageUrl", "")}
              fileName="imageUrl"
              filePath={`/events/held-events/${props.currentEvent.id}`}
              bucket="landings"
              sizes="250x450"
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

    .image-component{
      margin: 1rem auto;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
