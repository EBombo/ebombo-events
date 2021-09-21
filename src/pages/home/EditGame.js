import React, { useState } from "reactn";
import styled from "styled-components";
import { FileUpload } from "../../components/common/FileUpload";
import { Input, TextArea } from "../../components/form";
import { ButtonAnt } from "../../components/form";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import get from "lodash/get";
import { firestore } from "../../firebase";
import defaultTo from "lodash/defaultTo";

const EditGame = (props) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const schema = object().shape({
    name: string().required(),
    description: string().required(),
  });

  const { register, handleSubmit, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveIntegrationGame = async (data) => {
    setLoading(true);
    let imageUrl = null;

    let games;

    if (
      defaultTo(
        get(
          props,
          `${
            props.active === "integration"
              ? "events.integrationGames"
              : "events.esportsGames"
          }`
        ),
        []
      ).some((game) => game.id === props.currentGame.id)
    ) {
      games = defaultTo(
        get(
          props,
          `${
            props.active === "integration"
              ? "events.integrationGames"
              : "events.esportsGames"
          }`
        ),
        []
      ).map((game) =>
        game.id === props.currentGame.id ? mapGame(data, game) : game
      );
    } else {
      games = defaultTo(
        get(
          props,
          `${
            props.active === "integration"
              ? "events.integrationGames"
              : "events.esportsGames"
          }`
        ),
        []
      );
      games.push(mapGame(data));
    }
    const field =
      props.active === "integration" ? "integrationGames" : "esportsGames";

    await firestore.doc(`landings/events`).update({
      [field]: games,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapGame = (data, oldGame = null) => {
    if (oldGame) {
      const integrationGame = {
        ...props.currentGame,
        name: data.name,
        description: data.description,
      };

      if (imageUrl) integrationGame["backgroundImageUrl"] = imageUrl;

      return integrationGame;
    }

    return {
      ...props.currentGame,
      name: data.name,
      description: data.description,
      backgroundImageUrl: imageUrl,
    };
  };

  return (
    <Container>
      <div className="title">
        Juego {props.active === "integration" ? "Integración" : "Esport"}
      </div>
      <form onSubmit={handleSubmit(saveIntegrationGame)}>
        <Input
          name="name"
          ref={register}
          error={errors.name}
          required
          defaultValue={get(props, "currentGame.name", "")}
          placeholder="Nombre del juego"
        />
        <TextArea
          variant="primary"
          name="description"
          ref={register}
          error={errors.description}
          required
          label="Descripción:"
          defaultValue={get(props, "currentGame.description", "")}
          placeholder="Descripción del juego"
        />
        <div className="image-component">
          <FileUpload
            preview={true}
            file={get(props, "currentGame.backgroundImageUrl", "")}
            fileName="imageUrl"
            filePath={`/events/integration-games/${props.currentGame.id}`}
            bucket="landings"
            sizes="300x350"
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

export default EditGame;
