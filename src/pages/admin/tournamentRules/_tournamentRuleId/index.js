import {message} from "antd";
import {firestore} from "../../../../firebase";
import React, {useEffect, useState} from "reactn";
import moment from "moment";
import {useParams} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {ButtonBombo, Input, TimePicker} from "../../../../components";
import {spinLoader} from "../../../../utils";
import get from "lodash/get";
import {date, number, object, string} from "yup";
import {useHistory} from "react-router";

const newRule = {
  name: "",
  description: "",
  deleted: false,
  typeOfScore: "",
  typeOfGame: "individual",
};

export const AdminTournamentRuleEdit = (props) => {
  const schema = object().shape({
    name: string().required(),
    description: string().required(),
    totalPlayers: number().min(1).required(),
    typeOfScore: string().required(),
    typeOfGame: string().required(),
  });

  const { tournamentRuleId } = useParams();
  const { gameId } = useParams();

  const history = useHistory();
  const [isSavingRule, setIsSavingRule] = useState(false);
  const [rule, setRule] = useState({});
  const [isLoadingRule, setIsLoadingRule] = useState(true);

  const { register, errors, handleSubmit, control, watch, setValue } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
    duration: date().required(),
  });

  useEffect(() => {
    fetchRule();
  }, []);

  useEffect(() => {
    if (watch("totalPlayers") === 1) setValue("typeOfGame", ["individual"]);
  }, [watch("totalPlayers")]);

  const fetchRule = async () => {
    if (tournamentRuleId === "new") {
      const newId = firestore.collection("tournamentRules").doc().id;
      setRule({ id: newId, ...newRule });
    } else {
      const ruleRef = await firestore
        .collection("tournamentRules")
        .doc(tournamentRuleId)
        .get();
      ruleRef.exists ? setRule(ruleRef.data()) : history.push("/notFound");
    }
    setIsLoadingRule(false);
  };

  const mapGroup = (data) => ({
    id: rule.id,
    name: data.name,
    gameId: gameId,
    description: data.description,
    totalPlayers: +data.totalPlayers,
    typeOfScore: data.typeOfScore,
    typeOfGame: data.typeOfGame,
    createAt: rule.createAt ? rule.createAt : moment().toDate(),
    updateAt: rule.updateAt ? rule.updateAt : moment().toDate(),
    deleted: rule.deleted,
    duration: `${moment(data.duration).hours()}:${moment(
      data.duration
    ).minutes()}:${moment(data.duration).seconds()}`,
    roomNumber: data.roomNumber,
  });

  const saveRule = async (data) => {
    try {
      setIsSavingRule(true);

      let currentRule = mapGroup(data);

      if (tournamentRuleId !== "new")
        currentRule = { ...currentRule, updateAt: moment().toDate() };

      await firestore
        .doc("tournamentRules/" + rule.id)
        .set(currentRule, { merge: true });

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
      <form onSubmit={handleSubmit(saveRule)} noValidate>
        <h2 className="text-decoration-h2">REGLAS PARA TORNEOS</h2>
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
        <Input
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
          label="Cantidad de jugadores por equipo"
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
        <Input
          variant="secondary"
          error={errors.roomNumber}
          label="Numero de la sala (SOLO SE MOSTRARA PARA JUEGOS DE FORTNITE)"
          name="roomNumber"
          ref={register}
          placeholder="Numero de la sala"
          type="text"
          defaultValue={get(rule, "roomNumber", "")}
        />
        <Input
          variant="secondary"
          error={errors.typeOfGame}
          required
          type="radio"
          disabled={+watch("totalPlayers") === 1}
          label="Puntaje por:"
          name="typeOfGame"
          ref={register}
          values={["team", "individual"]}
          defaultValue={get(rule, "typeOfGame", "individual")}
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
            margin="0"
            type="default"
            disabled={isSavingRule}
            onClick={() =>
              history.push(`/admin/games/${gameId}/tournament-rules`)
            }
          >
            Cancelar
          </ButtonBombo>
          <ButtonBombo
            margin="0"
            type="primary"
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
