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

  const {resize} = useResizeImage();
  const {uploadToStorageAndGetURL} = useUploadToStorage();

  const schema = object().shape({
    name: string().required(),
    description: string().required(),
    backgroundColor: string().required(),
    borderColor: string().required(),
  });

  const {register, handleSubmit, errors} = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveIntegrationGame = async (data) => {
    setLoading(true);
    let imageUrl = null;

    if (imgBase64 && fileSuffix) {
      imageUrl = await uploadToStorageAndGetURL(
          imgBase64,
          `/events/integration-games/${props.currentGame.id}`,
          `backgroundImage`,
          fileSuffix
      );
    }

    let integrationGames;

    if (
        defaultTo(get(props, "events.integrationGames"), []).some(
            (game) => game.id === props.currentGame.id
        )
    ) {
      integrationGames = defaultTo(
          get(props, "events.integrationGames"),
          []
      ).map((game) =>
          game.id === props.currentGame.id ? mapGame(data, imageUrl, game) : game
      );
    } else {
      integrationGames = defaultTo(get(props, "events.integrationGames"), []);
      integrationGames.push(mapGame(data, imageUrl));
    }

    await firestore.doc(`landings/events`).update({
      integrationGames,
    });

    props.setIsVisibleModal(false);
    setLoading(false);
  };

  const mapGame = (data, imageUrl, oldGame = null) => {
    if (oldGame) {
      const integrationGame = {
        ...props.currentGame,
        name: data.name,
        description: data.description,
        borderColor: data.borderColor,
        backgroundColor: data.backgroundColor,
      };

      if (imageUrl) integrationGame["backgroundImageUrl"] = imageUrl;

      return integrationGame;
    }

    return {
      ...props.currentGame,
      name: data.name,
      description: data.description,
      borderColor: data.borderColor,
      backgroundColor: data.backgroundColor,
      backgroundImageUrl: imageUrl,
    };
  };

  const manageImage = (event) => {
    if (event.target.files[0]) {
      setFileSuffix(event.target.files[0].name.split(".")[1]);
      resize(event, 300, 300).then((imageBase64_) =>
          setImgBase64(imageBase64_.split(",")[1])
      );
    }
  };

  return (
      <Container>
        <div className="title">Juego de Integración</div>
        <form onSubmit={handleSubmit(saveIntegrationGame)}>
          <Input
              variant="primary"
              name="name"
              ref={register}
              error={errors.name}
              required
              label="Nombre:"
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
          <Input
              variant="primary"
              error={errors.borderColor}
              required
              label="Color de borde"
              ref={register}
              name="borderColor"
              placeholder="Color de borde"
              type="color"
              defaultValue={get(props, "currentGame.borderColor", "#ffffff")}
          />
          <Input
              variant="primary"
              error={errors.backgroundColor}
              required
              label="Color de fondo"
              ref={register}
              name="backgroundColor"
              placeholder="Color de fondo"
              type="color"
              defaultValue={get(props, "currentGame.backgroundColor", "#ffffff")}
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
