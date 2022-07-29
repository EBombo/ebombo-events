import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { object, string } from "yup";
import { ButtonAnt, Checkbox, Input, Select } from "../../../../components/form";
import { firestore } from "../../../../firebase";
import { useSendError } from "../../../../hooks";
import isEmpty from "lodash/isEmpty";
import Title from "antd/lib/typography/Title";
import { spinLoaderMin } from "../../../../components/common/loader";
import { snapshotToArray } from "../../../../utils";

export const GameContainer = (props) => {
  const router = useRouter();
  const { adminGameId } = router.query;

  const { sendError } = useSendError();

  const isNew = adminGameId === "new";

  const [game, setGame] = useState({});
  const [typeGames, setTypeGames] = useState([]);
  const [loading, setLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      if (isNew) return;
      const gameRef = await firestore.collection("games").doc(adminGameId).get();

      if (!gameRef.exists) return router.back();

      setGame(gameRef.data());
    };

    const fetchTypeGames = async () => {
      const typeGamesRef = await firestore.collection("typeGames").where("deleted", "==", false).get();

      setTypeGames(snapshotToArray(typeGamesRef));
    };

    const initialize = async () => {
      const promiseGame = fetchGame();
      const promiseTypeGames = fetchTypeGames();

      await Promise.all([promiseGame, promiseTypeGames]);

      setLoading(false);
    };

    initialize();
  }, []);

  const schema = object().shape({
    title: string().required(),
    name: string().required(),
    domain: string().required(),
    typeGameId: string(),
  });

  const { handleSubmit, register, errors, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const findTypeGame = (typeGameId) => {
    let currentTypeGame = typeGames.find((typeGame) => typeGame.id === typeGameId);

    if (!currentTypeGame) return null;

    delete currentTypeGame.deleted;
    delete currentTypeGame.createAt;

    return currentTypeGame;
  };

  const saveGame = async (data) => {
    try {
      setIsSaving(true);

      const currentTypeGame = data.typeGameId ? findTypeGame(data.typeGameId) : null;

      const gamesRef = firestore.collection("games");
      const gameId_ = isNew ? gamesRef.doc().id : adminGameId;

      await gamesRef.doc(gameId_).set(
        {
          ...data,
          id: gameId_,
          deleted: false,
          isGameToPlay: true,
          updateAt: new Date(),
          typeGame: currentTypeGame,
          createAt: isNew ? new Date() : game.createAt.toDate(),
        },
        { merge: true }
      );

      props.showNotification("Ok", "Realizado", "success");
    } catch (error) {
      console.error(error);
      sendError(error, "saveGame");
      props.showNotification("Error", "Algo salio mal");
    }

    await router.push("/admin/games");
    setIsSaving(false);
  };

  return loading ? (
    spinLoaderMin()
  ) : (
    <GameContainerCss>
      <Title>{!isEmpty(game) ? "Editar Juego" : "Nuevo Juego"}</Title>
      <form onSubmit={handleSubmit(saveGame)} autoComplete="off" noValidate>
        <Input
          type="text"
          name="title"
          ref={register}
          variant="primary"
          className="input"
          defaultValue={game.title}
          placeholder="Titulo"
          error={errors.title}
        />
        <Input
          type="text"
          name="name"
          ref={register}
          variant="primary"
          className="input"
          defaultValue={game.name}
          placeholder="Name"
          error={errors.name}
        />
        <Input
          type="text"
          name="domain"
          ref={register}
          variant="primary"
          className="input"
          defaultValue={game.domain}
          placeholder="Domain"
          error={errors.domain}
        />
        <Input
          type="text"
          name="api"
          ref={register}
          variant="primary"
          className="input"
          defaultValue={game.api}
          placeholder="API"
          error={errors.api}
        />
        {typeGames?.length ? (
          <Controller
            name="typeGameId"
            control={control}
            defaultValue={game?.typeGame?.id}
            onChange={([typeGameId]) => typeGameId}
            as={
              <Select
                showSearch
                virtual={false}
                placeholder="tipo de juego"
                optionFilterProp="children"
                optionsdom={typeGames.map((type) => ({
                  key: type.id,
                  code: type.id,
                  name: type.name,
                }))}
              />
            }
          />
        ) : null}
        <Controller
          name="isDisabled"
          control={control}
          defaultValue={game.isDisabled}
          onChange={([value]) => value.target.checked}
          as={<Checkbox variant="primary">Desabilitar</Checkbox>}
        />
        <ButtonAnt htmlType="submit" loading={isSaving} disabled={isSaving}>
          GUARDAR
        </ButtonAnt>
      </form>
    </GameContainerCss>
  );
};

const GameContainerCss = styled.div`
  width: 100%;
  max-width: 450px;
  margin: auto;
  color: ${(props) => props.theme.basic.black};

  form {
    .input {
      margin: 0.5rem auto;
    }
  }
`;
