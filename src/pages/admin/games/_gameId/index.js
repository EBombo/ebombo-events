import React, { useEffect, useState } from "reactn";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { object, string } from "yup";
import { ButtonAnt, Input } from "../../../../components/form";
import { firestore } from "../../../../firebase";
import { useSendError } from "../../../../hooks";
import isEmpty from "lodash/isEmpty";
import Title from "antd/lib/typography/Title";

export const GameContainer = (props) => {
  const router = useRouter();
  const { sendError } = useSendError();
  const { gameId } = router.query;

  const isNew = gameId === "new";

  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;

    const fetchGame = async () => {
      const gameRef = await firestore.collection("games").doc(gameId).get();

      if (!gameRef.exists) return router.back();

      setGame(gameRef.data());
      setLoading(false);
    };

    fetchGame();
  }, []);

  const schema = object().shape({
    title: string().required(),
    name: string().required(),
    domain: string().required(),
  });

  const { handleSubmit, register, errors } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  const saveGame = async (data) => {
    try {
      setIsSaving(true);
      const gamesRef = firestore.collection("games");

      const gameId_ = isNew ? gamesRef.doc().id : gameId;

      await gamesRef.doc(gameId_).set(
        {
          ...data,
          id: gameId_,
          createAt: isNew ? new Date() : game.createAt.toDate(),
          updateAt: new Date(),
          deleted: false,
          isGameToPlay: true,
        },
        { merge: true }
      );

      props.showNotification("Ok", "Realizado", "success");
    } catch (error) {
      console.error(error);
      sendError(error, "saveGame");
      props.showNotification("Error", "Algo salio mal");
    }
    router.push("/admin/games");
    setIsSaving(false);
  };

  return (
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
        <ButtonAnt htmlType="submit" loading={isSaving || loading} disabled={isSaving || loading}>
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
