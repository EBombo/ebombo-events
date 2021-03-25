import React, { useEffect, useState, lazy, Suspense } from "react";
import { Checkbox, message } from "antd";
import { firestore } from "../../../../firebase";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { ButtonBombo, Input } from "../../../../components";
import { spinLoader } from "../../../../utils";
import get from "lodash/get";
import reduce from "lodash/reduce";
import { object, string } from "yup";
import { useHistory } from "react-router";
import { snapshotToArray } from "../../../../utils";
import styled from "styled-components";
import "suneditor/dist/css/suneditor.min.css";
import SunEditor, { buttonList } from "suneditor-react";

const newGame = {
  name: "",
  consoleIds: [],
  deleted: false,
};

export default () => {
  const schema = object().shape({
    name: string().required(),
    gameRule: string().required(),
  });

  const params = useParams();
  const history = useHistory();
  const [isSavingGame, setIsSavingGame] = useState(false);
  const [game, setGame] = useState({});
  const [consoles, setConsoles] = useState([]);
  const [isLoadingGame, setIsLoadingGame] = useState(true);
  const { register, errors, handleSubmit, control, watch } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    initialize();
  }, []);

  const initialize = () => {
    fetchGame();
    fetchConsoles();
  };

  const fetchGame = async () => {
    if (params.gameId === "new") {
      const new_id = firestore.collection("games").doc().id;
      setGame({ ...newGame, id: new_id });
    } else {
      const gameRef = await firestore
        .collection("games")
        .doc(params.gameId)
        .get();
      gameRef.exists ? setGame(gameRef.data()) : history.push("/notFound");
    }
    setIsLoadingGame(false);
  };

  const fetchConsoles = () =>
    firestore
      .collection("consoles")
      .where("deleted", "==", false)
      .onSnapshot((snapshot) => setConsoles(snapshotToArray(snapshot)));

  const mapGame = (data) => ({
    id: game.id,
    name: data.name,
    color: data.color,
    gameRule: data.gameRule,
    consoleIds: reduceConsolesId(data.consoleIds),
    createAt: game.createAt ? game.createAt : moment().toDate(),
    updateAt: new Date(),
    deleted: game.deleted,
  });

  const reduceConsolesId = (consoleIds) =>
    reduce(
      consoleIds,
      (result, value, key) => {
        value && (result || (result = [])).push(key);
        return result;
      },
      []
    );

  const saveGame = async (data) => {
    setIsSavingGame(true);
    try {
      let currentGame = mapGame(data);

      await firestore.doc("games/" + game.id).set(currentGame, { merge: true });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingGame(false);
  };

  return isLoadingGame ? (
    spinLoader()
  ) : (
    <Container>
      <form onSubmit={handleSubmit(saveGame)} noValidate>
        <h2 className="text-decoration-h2">JUEGOS</h2>
        <Input
          variant="secondary"
          error={errors.name}
          required
          label="Nombre de juego"
          ref={register}
          name="name"
          placeholder="Nombre de juego"
          type="text"
          defaultValue={get(game, "name", "")}
        />
        <Input
          error={errors.name}
          required
          label="Color del juego"
          ref={register}
          name="color"
          placeholder="Color"
          type="color"
          defaultValue={get(game, "color", "")}
          style={{ width: "150px" }}
        />
        {consoles.map((console_) => (
          <div
            style={{ display: "flex", flexDirection: "row", padding: "10px" }}
            key={console_.id}
          >
            <Controller
              defaultValue={get(game, "consoleIds", []).includes(console_.id)}
              control={control}
              name={`consoleIds.${console_.id}`}
              onChange={([selected]) => selected.target.checked}
              as={<Checkbox id={console_.id} />}
            />
            <label
              style={{ padding: "0px 10px", cursor: "pointer" }}
              htmlFor={console_.id}
            >
              {console_.name}
            </label>
          </div>
        ))}
        <div className="container-editor">
          <Controller
            name="gameRule"
            errors={errors.gameRule}
            defaultValue={get(game, "gameRule", "")}
            control={control}
            as={
              <SunEditor
                setOptions={{
                  buttonList: buttonList.complex,
                }}
                defaultValue={get(game, "gameRule", "")}
                height="400px"
              />
            }
          />
        </div>
        <div style={{ display: "flex" }}>
          <ButtonBombo
            type="secondary"
            margin="0"
            disabled={isSavingGame}
            onClick={() => history.goBack()}
          >
            CANCELAR
          </ButtonBombo>
          <ButtonBombo
            margin="0"
            loading={isSavingGame}
            style={{ marginLeft: "10px" }}
            disabled={isSavingGame}
            htmlType="submit"
          >
            GUARDAR
          </ButtonBombo>
        </div>
      </form>
    </Container>
  );
};

const Container = styled.div`
  .container-editor {
    margin: 1rem 0;
  }
`;
