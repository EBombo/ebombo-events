import { Button, message } from "antd";
import { firestore } from "../../../../../../firebase";
import React, { useEffect, useState } from "react";
import { useGlobal } from "reactn";
import moment from "moment";
import { useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  ButtonBombo,
  Input,
  TextArea,
  TimePicker,
} from "../../../../../../components";
import { spinLoader } from "../../../../../../utils";
import get from "lodash/get";
import { date, number, object, string } from "yup";
import { useHistory } from "react-router";
import styled from "styled-components";
import sizes from "../../../../../../styles/constants/sizes";

const newRule = {
  name: "",
  description: "",
  deleted: false,
  typeOfScore: "PUNTOS",
  typeOfGame: "individual",
};

export const AdminRuleEdit = (props) => {
  const schema = object().shape({
    name: string().required(),
    description: string().required(),
    totalPlayers: number().required(),
    duration: date().required(),
  });

  const params = useParams();
  const { gameId } = params;
  const history = useHistory();
  const [games] = useGlobal("games");
  const [isSavingRule, setIsSavingRule] = useState(false);
  const [rule, setRule] = useState({});
  const [game, setGame] = useState({});
  const [isLoadingRule, setIsLoadingRule] = useState(true);
  const { register, errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchRules();
  }, []);

  useEffect(() => {
    findGames(gameId);
  }, [gameId, games]);

  const fetchRules = async () => {
    if (params.ruleId === "new") {
      const new_id = firestore.collection("rules").doc().id;
      setRule({ ...newRule, id: new_id });
    } else {
      const ruleRef = await firestore
        .collection("rules")
        .doc(params.ruleId)
        .get();
      ruleRef.exists ? setRule(ruleRef.data()) : history.push("/notFound");
    }
    setIsLoadingRule(false);
  };

  const findGames = async (gameId) => {
    const game_ = games.find((_game) => _game.id === gameId);

    setGame(game_);
  };

  const mapRule = (data) => ({
    id: rule.id,
    name: data.name,
    description: data.description,
    totalPlayers: +data.totalPlayers,
    typeOfScore: data.typeOfScore,
    typeOfGame: data.typeOfGame,
    gameId: params.gameId,
    duration: `${moment(data.duration).hours()}:${moment(
      data.duration
    ).minutes()}:${moment(data.duration).seconds()}`,
    createAt: rule.createAt ? rule.createAt : moment().toDate(),
    updateAt: rule.updateAt ? rule.updateAt : moment().toDate(),
    deleted: rule.deleted,
  });

  const saveGame = async (data) => {
    try {
      setIsSavingRule(true);

      let currentRule = mapRule(data);

      if (params.ruleId !== "new")
        currentRule = { ...currentRule, updateAt: moment().toDate() };

      if (get(game, "name", "").toLowerCase().includes("fortnite"))
        currentRule = { ...currentRule, roomNumber: data.roomNumber };

      await firestore.doc("rules/" + rule.id).set(currentRule, { merge: true });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingRule(false);
  };

  return isLoadingRule ? (
    spinLoader()
  ) : (
    <div>
      <form onSubmit={handleSubmit(saveGame)} noValidate>
        <h2 className="text-decoration-h2">REGLAS</h2>
        <Input
          variant="secondary"
          error={errors.name}
          required
          label="Nombre de regla"
          ref={register}
          name="name"
          placeholder="Nombre de regla"
          type="text"
          defaultValue={get(rule, "name", "")}
        />
        <TextArea
          variant="secondary"
          error={errors.description}
          required
          label="Descripcion"
          ref={register}
          name="description"
          placeholder="Descripcion"
          type="text"
          defaultValue={get(rule, "description", "")}
        />
        <Input
          variant="secondary"
          error={errors.totalPlayers}
          label="Cantidad de jugadores"
          required
          name="totalPlayers"
          ref={register}
          placeholder="Cantidad de jugadores"
          type="number"
          min={1}
          defaultValue={get(rule, "totalPlayers", 1)}
        />
        <Input
          variant="secondary"
          error={errors.typeOfScore}
          label="Tipo de Puntaje (TITULO PARA LOS PUNTOS DEL RESULTADO)"
          required
          name="typeOfScore"
          ref={register}
          placeholder="Tipo de Puntaje"
          type="text"
          defaultValue={get(rule, "typeOfScore", "")}
        />
        {get(game, "name", "").toLowerCase().includes("fortnite") && (
          <Input
            variant="primary"
            error={errors.roomNumber}
            label="Numero de la sala (SOLO SE MOSTRARA PARA JUEGOS DE FORTNITE)"
            name="roomNumber"
            ref={register}
            placeholder="Numero de la sala"
            type="text"
            defaultValue={get(rule, "roomNumber", "")}
          />
        )}
        <Input
          variant="primary"
          error={errors.typeOfGame}
          required
          type="radio"
          label="Puntaje por:"
          name="typeOfGame"
          ref={register}
          values={["team", "individual"]}
          defaultValue={get(rule, "typeOfGame", "")}
        />
        <Controller
          name="duration"
          control={control}
          defaultValue={moment(get(rule, "duration", "00:30:00"), "HH:mm:ss")}
          as={
            <TimePicker
              error={errors.duration}
              required
              style={{ width: "auto" }}
              label={"Duracion del Encuentro"}
            />
          }
        />
        <div style={{ display: "flex" }}>
          <ButtonBombo
            type="secondary"
            margin="0"
            disabled={isSavingRule}
            onClick={() => history.goBack()}
          >
            Cancelar
          </ButtonBombo>
          <ButtonBombo
            margin="0"
            loading={isSavingRule}
            style={{ marginLeft: "10px" }}
            disabled={isSavingRule}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
        </div>
      </form>
    </div>
  );
};

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: ${sizes.font.normal};

  ${(props) =>
    props.required &&
    `
    ::before {
        display: inline-block;
        margin-right: 4px;
        color: #f5222d;
        font-size: 14px;
        line-height: 1;
        content: "*";
    }
  `}
`;

const TimeContainer = styled.div`
  margin-bottom: ${(props) => props.marginBottom || "1rem"} !important;
`;
