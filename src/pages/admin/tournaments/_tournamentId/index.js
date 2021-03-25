import React, { useGlobal, useState } from "reactn";
import {
  ButtonBombo,
  DatePicker,
  Input,
  Select,
  TextArea,
} from "../../../../components/common";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, message, Select as AntSelect, Switch } from "antd";
import { boolean, date, number, object, string } from "yup";
import { useHistory, useParams } from "react-router";
import { snapshotToArray, spinLoader } from "../../../../utils";
import { config, firestore } from "../../../../firebase";
import { useEffect } from "react";
import moment from "moment";
import {
  awardTypes,
  eventTypes,
  linkTypes,
  tournamentTypes,
} from "../../../../components/common/DataList";
import styled from "styled-components";
import { currentUrlQuery } from "../../../../utils/queryUrl";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../utils/useFetch/useFetch";

const newTournament = {
  deleted: false,
  playersLimit: 1,
  tournamentType: "knock-out",
};

export const AdminTournamentEdit = () => {
  const schema = object().shape({
    name: string().required(),
    eventType: string().required(),
    linkType: string().required(),
    tournamentType: string().required(),
    gameId: string().required(),
    consoleId: string().required(),
    ruleId: string().required(),
    inscriptionDate: date().required(),
    startDate: date().required(),
    endDate: date().required(),
    playersLimit: number().required(),
    entryCost: number().required(),
    requirements: string().required(),
    awardDetails: string().required(),
    awardType: string().required(),
    additionalMatch: boolean().required(),
    realMoney: string().required(),
    updatePoints: boolean().required(),
  });

  const [games] = useGlobal("games");
  const [consoles] = useGlobal("consoles");
  const [settings] = useGlobal("settings");
  const { gameId } = useParams();
  const { tournamentId } = useParams();
  const history = useHistory();

  const [tournament, setTournament] = useState(null);
  const [tournamentRules, setTournamentRules] = useState([]);

  const [loadingTournamentButton, setLoadingTournamentButton] = useState(false);

  const [loadingTournament, setLoadingTournament] = useState(true);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const {
    register,
    errors,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
  } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
    defaultValues: {
      gameId,
    },
  });

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!watch("gameId")) return;

    setValue("ruleId", "");

    const game_ = findGame(watch("gameId"));
    history.push(`/admin/games/${game_.id}/tournaments/${tournamentId}`);

    setValue("consoleId", filterConsoles(game_)[0].id);
  }, [watch("gameId")]);

  const initialize = async () => {
    const p1 = fetchTournament();
    const p2 = fetchTournamentRules();

    await Promise.all([p1, p2]);

    setLoadingTournament(false);
  };

  const fetchTournament = async () => {
    if (tournamentId === "new") {
      const new_id = firestore.collection("tournaments").doc().id;

      const cloneTournamentId = currentUrlQuery("cloneTournamentId");
      const tournamentClone = await getFirebaseTournament(cloneTournamentId);

      setTournament({
        ...defaultTo(tournamentClone, newTournament),
        playerIds: [],
        id: new_id,
        name: "",
        whatsappUrl: "",
        inscriptionDate: "",
        startDate: "",
        endDate: "",
        gameId: get(tournamentClone, "game.id", gameId),
        consoleId: get(
          tournamentClone,
          "console.id",
          filterConsoles(findGame(gameId))[0].id
        ),
        tournamentType: get(
          tournamentClone,
          "tournamentType",
          newTournament.tournamentType
        ),
        updatePoints: get(tournamentClone, "updatePoints", true),
      });

      reset({
        gameId: get(tournamentClone, "game.id", gameId),
        consoleId: get(
          tournamentClone,
          "console.id",
          filterConsoles(findGame(gameId))[0].id
        ),
        tournamentType: get(
          tournamentClone,
          "tournamentType",
          newTournament.tournamentType
        ),
      });
    } else {
      const tournamentRef = await getFirebaseTournament(tournamentId);
      !isEmpty(tournamentRef)
        ? setTournament({
            ...tournamentRef,
            gameId: tournamentRef.game.id,
            consoleId: tournamentRef.console.id,
          })
        : history.push("/notFound");

      reset({
        gameId: tournamentRef.game.id,
        consoleId: tournamentRef.console.id,
        tournamentType: tournamentRef.tournamentType,
      });
    }
  };

  const getFirebaseTournament = async (tournamentId_) => {
    const tournamentRef = await firestore
      .doc("tournaments/" + tournamentId_)
      .get();
    return tournamentRef.data();
  };

  const fetchTournamentRules = async () => {
    let tournamentRulesRef = firestore.collection("tournamentRules");

    if (tournamentId === "new")
      tournamentRulesRef = tournamentRulesRef.where("deleted", "==", false);

    const tournamentRulesSnapShot = await tournamentRulesRef.get();

    if (tournamentRulesSnapShot.empty)
      return history.push(`/admin/games/${gameId}/tournament-rules/new`);

    await setTournamentRules(snapshotToArray(tournamentRulesSnapShot));
  };

  const filterConsoles = (game) =>
    consoles.filter((console_) => game.consoleIds.includes(console_.id));

  const findGame = (gameId) =>
    games.find((game_) => game_.id === gameId) || games[0];

  const mapTournament = (tournament_) => ({
    id: tournament.id,
    eventType: tournament_.eventType,
    name: tournament_.name.toUpperCase(),
    tournamentType: tournament_.tournamentType,
    linkType: tournament_.linkType,
    game: games.find((console_) => console_.id === tournament_.gameId),
    console: consoles.find((console_) => console_.id === tournament_.consoleId),
    rule: tournamentRules.find(
      (tournamentRule_) => tournamentRule_.id === tournament_.ruleId
    ),
    inscriptionDate: tournament_.inscriptionDate,
    startDate: tournament_.startDate,
    startDateFormat: moment(tournament_.startDate).format("YYYY-MM-DD"),
    endDate: tournament_.endDate,
    playersLimit: tournament_.playersLimit,
    playerIds: get(tournament, "playerIds", []),
    updateAt: new Date(),
    createAt: new Date(),
    entryCost: tournament_.entryCost,
    requirements: tournament_.requirements,
    awardDetails: tournament_.awardDetails,
    awardType: get(tournament_, "awardType", false),
    realMoney: get(tournament_, "realMoney", "real") === "real",
    additionalMatch: tournament_.additionalMatch,
    password: tournament_.password,
    deleted: false,
    isClosed: false,
    victoriesPoints: +get(tournament_, "victoriesPoints", 1),
    tiesPoints: +get(tournament_, "tiesPoints", 1),
    pointsFor: +get(tournament_, "pointsFor", 1),
    whatsappUrl: tournament_.whatsappUrl,
    updatePoints: tournament_.updatePoints,
  });

  const saveTournament = async (data) => {
    try {
      setLoadingTournamentButton(true);

      const mappedTournament = mapTournament(data);

      tournamentId !== "new" && delete mappedTournament.createAt;

      await firestore
        .collection("tournaments")
        .doc(tournament.id)
        .set({ ...mappedTournament }, { merge: true });

      tournamentId === "new" &&
        (await updateSetting("default", {
          totalTournaments: get(settings, "totalTournaments", 0) + 1,
        }));

      await updateTeams(mappedTournament);

      if (
        tournamentId !== "new" &&
        (mappedTournament.victoriesPoints !== tournament.victoriesPoints ||
          mappedTournament.pointsFor !== tournament.pointsFor ||
          mappedTournament.tiesPoints !== tournament.tiesPoints)
      )
        await recalculatePoints();

      if (tournamentId !== "new") await updateMatches(mappedTournament);
    } catch (error) {
      console.error(error);
    }
    history.push(`/admin/games/${gameId}/tournaments/`);
  };

  const updateSetting = async (settingId, setting) =>
    await firestore.doc(`settings/${settingId}`).update(setting);

  const updateMatches = async (mappedTournament) => {
    const matchesRef = await firestore
      .collection("matches")
      .where("tournamentId", "==", tournamentId)
      .get();

    const matches_ = snapshotToArray(matchesRef);

    matches_.map(
      async (match) =>
        await firestore
          .collection("matches")
          .doc(match.id)
          .update({ tournament: mappedTournament })
    );
  };

  const updateTeams = async (newTournament) => {
    const teamsRef = await firestore
      .collection("tournamentTeams")
      .where("tournament.id", "==", newTournament.id)
      .get();

    const teams = snapshotToArray(teamsRef);

    const batchRef = firestore.batch();

    teams.forEach((team) =>
      batchRef.update(firestore.doc(`tournamentTeams/${team.id}`), {
        tournament: newTournament,
      })
    );

    await batchRef.commit();
  };

  const recalculatePoints = async () => {
    try {
      await ownFetch(
        `${config.serverUrl}/tournaments/${tournament.id}/calculate-points`,
        "PUT"
      );

      message.success("Se actualizaron los puntajes de grupos");
    } catch (error) {
      handleError({ ...error, action: "recalculatePoints" });
    }
  };

  return loadingTournament || isEmpty(tournamentRules) ? (
    spinLoader()
  ) : (
    <div>
      <TournamentContent>
        <TournamentForm onSubmit={handleSubmit(saveTournament)} noValidate>
          <Input
            variant="secondary"
            error={errors.name}
            required
            label="Nombre del torneo ('ripley' , 'liga 1' y 'ulima' son nombres reservados)"
            type="text"
            autoComplete="on"
            ref={register}
            name="name"
            defaultValue={get(tournament, "name", "")}
            placeholder="Ingrese nombre de torneo"
          />
          <Controller
            name="eventType"
            defaultValue={get(tournament, "eventType", eventTypes[0].value)}
            onChange={([eventType]) => eventType}
            control={control}
            as={
              <Select
                variant="secondary"
                required
                error={errors.eventType}
                label="Tipo de Evento"
                showSearch
                placeholder="Seleccione el tipo de evento"
              >
                {eventTypes.map((eventType) => (
                  <AntSelect.Option
                    key={eventType.value}
                    value={eventType.value}
                  >
                    {eventType.name}
                  </AntSelect.Option>
                ))}
              </Select>
            }
          />
          <Controller
            name="linkType"
            defaultValue={get(tournament, "linkType", linkTypes[0].value)}
            onChange={([gameId]) => gameId}
            control={control}
            as={
              <Select
                variant="secondary"
                error={errors.linkType}
                label="Tipo de Link"
              >
                {linkTypes.map((link) => (
                  <AntSelect.Option key={link.value} value={link.value}>
                    {link.name}
                  </AntSelect.Option>
                ))}
              </Select>
            }
          />
          <Input
            variant="secondary"
            error={errors.whatsappUrl}
            label="Grupo de Whatsapp o Discord (opcional)"
            type="url"
            autoComplete="on"
            ref={register}
            name="whatsappUrl"
            defaultValue={get(tournament, "whatsappUrl", "")}
            placeholder="Ingrese url del grupo de whatsapp"
          />
          <Controller
            name="gameId"
            defaultValue={gameId}
            onChange={([gameId]) => gameId}
            control={control}
            as={
              <Select
                variant="secondary"
                error={errors.gameId}
                label="Juego"
                showSearch
                placeholder="Seleccione el juego"
              >
                {games.map((game) => (
                  <AntSelect.Option key={game.id} value={game.id}>
                    {game.name}
                  </AntSelect.Option>
                ))}
              </Select>
            }
          />
          <Controller
            key={`key-console-${watch("gameId")}`}
            name="consoleId"
            defaultValue={get(tournament, "console.id", watch("consoleId"))}
            onChange={([consoleId]) => consoleId}
            control={control}
            as={
              <Select
                variant="secondary"
                error={errors.consoleId}
                label="Consola"
                showSearch
                placeholder="Seleccione la consola"
              >
                {filterConsoles(findGame(watch("gameId"))).map((console) => (
                  <AntSelect.Option key={console.id} value={console.id}>
                    {console.name}
                  </AntSelect.Option>
                ))}
              </Select>
            }
          />
          {isEmpty(
            tournamentRules.filter(
              (tournamentRule) => tournamentRule.gameId === gameId
            )
          ) ? (
            <>
              <label style={{ fontSize: 16 }}>
                Este juego no tiene Reglas de Torneo
              </label>
              <br />
              <ButtonBombo
                margin="0"
                onClick={() =>
                  history.push(`/admin/games/${gameId}/tournament-rules/new`)
                }
                disabled={loadingTournamentButton}
                style={{ marginBottom: 10 }}
              >
                Crear Regla
              </ButtonBombo>
            </>
          ) : (
            <Controller
              name="ruleId"
              defaultValue={get(
                tournament,
                "rule.id",
                tournamentRules.find(
                  (tournamentRule) => tournamentRule.gameId === gameId
                ).id
              )}
              onChange={([ruleId]) => ruleId}
              control={control}
              as={
                <Select
                  variant="secondary"
                  error={errors.ruleId}
                  label="Regla (DETERMINA SI EL TORNEO ES INDIVIDUAL/GRUPAL)"
                  showSearch
                  placeholder="Seleccione la regla"
                >
                  {tournamentRules
                    .filter(
                      (tournamentRule) =>
                        tournamentRule.gameId === gameId ||
                        tournamentRule.id === get(tournament, "rule.id")
                    )
                    .map((tournamentRule) => (
                      <AntSelect.Option
                        key={tournamentRule.id}
                        value={tournamentRule.id}
                      >
                        {tournamentRule.name}&nbsp; [partido de{" "}
                        {tournamentRule.totalPlayers} vs{" "}
                        {tournamentRule.totalPlayers}] [
                        {tournamentRule.duration}]
                      </AntSelect.Option>
                    ))}
                </Select>
              }
            />
          )}

          <Controller
            name="tournamentType"
            defaultValue={get(tournament, "tournamentType", "knock-out")}
            control={control}
            as={
              <Select
                variant="secondary"
                placeholder="Selecciona el tipo de juego"
                error={errors.tournamentType}
                label="Selecciona el tipo de torneo"
                showSearch
              >
                {tournamentTypes.map((tournamentType) => (
                  <AntSelect.Option
                    key={tournamentType.name}
                    value={tournamentType.value}
                  >
                    {tournamentType.name}
                  </AntSelect.Option>
                ))}
              </Select>
            }
          />
          <Input
            variant="secondary"
            error={errors.playersLimit}
            label={"Limite de Jugadores/Equipos"}
            type="number"
            ref={register}
            name="playersLimit"
            defaultValue={get(tournament, "playersLimit", 1)}
            placeholder="Ingrese limite de jugadores"
          />
          <fieldset>
            <label htmlFor="additionalMatchCheck">
              GENERAR MATCH PARA 3ER Y 4TO LUGAR{" "}
            </label>
            <Controller
              name="additionalMatch"
              error={errors.additionalMatch}
              defaultValue={get(tournament, "additionalMatch", false)}
              onChange={([event]) => event.target.checked}
              control={control}
              as={<Checkbox id="additionalMatchCheck" />}
            />
          </fieldset>
          <fieldset>
            <legend>PASSWORD</legend>
            <Input
              variant="secondary"
              error={errors.password}
              type="text"
              ref={register}
              name="password"
              defaultValue={get(tournament, "password", "")}
              placeholder="Ingrese la contraseña"
            />
          </fieldset>
          <fieldset>
            <legend>FECHAS DEL TORNEO</legend>
            <Controller
              key={`key-${get(
                tournament,
                "inscriptionDate",
                "inscriptionDate"
              )}`}
              name="inscriptionDate"
              control={control}
              defaultValue={
                tournament && tournament.inscriptionDate
                  ? moment(tournament.inscriptionDate.toDate())
                  : null
              }
              as={
                <DatePicker
                  placeholder="Ingrese fecha fin de la inscripción"
                  error={errors.inscriptionDate}
                  showTime={true}
                  style={{ width: "100%" }}
                  label="Ingrese fecha fin de la inscripción"
                  format={"DD/MM/YYYY HH:mm:ss"}
                />
              }
            />
            <Controller
              key={get(tournament, "startDate", "startDate")}
              name="startDate"
              control={control}
              defaultValue={
                tournament && tournament.startDate
                  ? moment(tournament.startDate.toDate())
                  : null
              }
              as={
                <DatePicker
                  placeholder="Ingrese fecha de inicio"
                  error={errors.startDate}
                  showTime={true}
                  style={{ width: "100%" }}
                  label="Fecha de inicio del torneo"
                  format={"DD/MM/YYYY HH:mm:ss"}
                />
              }
            />
            <Controller
              key={get(tournament, "endDate", "endDate")}
              name="endDate"
              control={control}
              defaultValue={
                tournament && tournament.endDate
                  ? moment(tournament.endDate.toDate())
                  : null
              }
              as={
                <DatePicker
                  placeholder="Ingrese fecha de finalización"
                  error={errors.endDate}
                  showTime={true}
                  style={{ width: "100%" }}
                  label="Fecha de finalización del torneo"
                  format={"DD/MM/YYYY HH:mm:ss"}
                />
              }
            />
            <Controller
              key={get(tournament, "awardType", "awardType")}
              defaultValue={get(tournament, "awardType", "fixed")}
              name="awardType"
              control={control}
              onChange={(awardType_) => {
                setValue(awardType_[0], "awardType", true);
                setTournament({
                  ...tournament,
                  awardType: awardType_[0],
                  fixedAwards: null,
                  variableAwards: null,
                  objectAwards: null,
                });
              }}
              as={
                <Select
                  required
                  label="Tipo de premio"
                  variant="secondary"
                  error={errors.awardType}
                  optionFilterProp="children"
                  placeholder="Tipo de premio"
                  filterOption={(input, option) =>
                    option.props.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {awardTypes.map((awardType) => (
                    <AntSelect.Option
                      key={awardType.value}
                      value={awardType.value}
                    >
                      {`${awardType.name}`}
                    </AntSelect.Option>
                  ))}
                </Select>
              }
            />
          </fieldset>
          <fieldset>
            <legend>COSTO DE ENTRADA DEL TORNEO</legend>
            <Input
              variant="secondary"
              error={errors.entryCost}
              label="Costo de inscripción"
              type="number"
              ref={register}
              name="entryCost"
              defaultValue={get(tournament, "entryCost", 0)}
              placeholder="Costo de inscripción"
            />
            <Controller
              key={get(tournament, "realMoney", "realMoney")}
              name="realMoney"
              defaultValue={
                get(tournament, "realMoney", true) ? "real" : "playable"
              }
              control={control}
              as={
                <Select
                  variant="secondary"
                  required
                  error={errors.realMoney}
                  label="Tipo de moneda"
                  showSearch
                  placeholder="Tipo de moneda"
                >
                  <AntSelect.Option key="real-money-true" value="real">
                    Dinero Real
                  </AntSelect.Option>
                  {/*
                    <AntSelect.Option key="real-money-false" value="playable">
                      Dinero Jugable
                    </AntSelect.Option>
                  */}
                </Select>
              }
            />
          </fieldset>
          <fieldset>
            <legend>DETALLES DEL TORNEO</legend>
            <TextArea
              variant="secondary"
              error={errors.requirements}
              label="REGLAS del torneo"
              type="text"
              ref={register}
              name="requirements"
              defaultValue={get(tournament, "requirements", "")}
              placeholder="Requisitos"
            />
            <TextArea
              variant="secondary"
              error={errors.awardDetails}
              label="DETALLES del torneo"
              type="text"
              ref={register}
              name="awardDetails"
              defaultValue={get(tournament, "awardDetails", "")}
              placeholder="Detalles del torneo"
            />
          </fieldset>
          {defaultTo(watch("tournamentType"), "").includes("group") && (
            <fieldset>
              <legend>TABLERO</legend>
              <Input
                error={errors.victoriesPoints}
                variant="secondary"
                label="Multiplicador de victorias"
                type="number"
                ref={register}
                name="victoriesPoints"
                defaultValue={get(tournament, "victoriesPoints", "")}
                placeholder="Multiplicador de victorias"
              />
              <Input
                error={errors.tiesPoints}
                variant="secondary"
                label="Multiplicador de empates"
                type="number"
                ref={register}
                name="tiesPoints"
                defaultValue={get(tournament, "tiesPoints", "")}
                placeholder="Multiplicador de empates"
              />
              <Input
                error={errors.pointsFor}
                variant="secondary"
                label="Multiplicador de puntos a favor"
                type="number"
                ref={register}
                name="pointsFor"
                defaultValue={get(tournament, "pointsFor", "")}
                placeholder="Multiplicador de puntos a favor"
              />
            </fieldset>
          )}
          <fieldset>
            <legend>SUBIR PUNTAJES</legend>
            <Controller
              name="updatePoints"
              control={control}
              onChange={([value]) => value}
              defaultValue={get(tournament, "updatePoints", true)}
              as={<Switch checkedChildren="User" unCheckedChildren="Admin" />}
            />
          </fieldset>
          <br />
          <br />
          <div className="buttons">
            <ButtonBombo
              margin="0"
              type="secondary"
              onClick={() =>
                history.push(`/admin/games/${gameId}/tournaments/`)
              }
              disabled={loadingTournamentButton}
            >
              CANCELAR
            </ButtonBombo>
            <ButtonBombo
              margin="0"
              type="primary"
              htmlType="submit"
              loading={loadingTournamentButton}
              disabled={loadingTournamentButton}
            >
              GUARDAR
            </ButtonBombo>
          </div>
        </TournamentForm>
      </TournamentContent>
    </div>
  );
};

const TournamentForm = styled.form`
  .item-switch-tournament-award-type {
    width: 100%;
    text-align: left;
    padding: 10px 0;
    color: white;
    @media (min-width: $mobile-width) {
      text-align: left;
    }

    .ant-switch {
      width: 140px;
    }

    .ant-switch.ant-switch-checked {
      border: 1px solid #424242;
      font-size: 11px;
      margin: 5px;
      height: 30px;
      padding: 0px 0px 0px 4px;
      background: #bfbfbf;

      .ant-switch-inner {
        margin-right: 60px;
        margin-left: 4px;
        color: #4e4e4e;
      }
    }

    .ant-switch.ant-switch-checked::after {
      content: "FIJO";
      font-weight: bold;
      font-size: 11px;
      background: #1890ff;
      color: #ffffff;
      width: 58px;
      height: 30px;
      margin-top: -2px;
      margin-left: 2px;
      padding-top: 6px;
    }

    .ant-switch[class$="switch"] {
      border: 1px solid #424242;
      font-size: 11px;
      margin: 5px;
      height: 30px;
      padding: 0px 10px 0px 12px;
      background: #bfbfbf;

      .ant-switch-inner {
        margin-left: 51px;
        margin-right: 2px;
        color: #4e4e4e;
      }
    }

    .ant-switch::after {
      content: "VARIABLE";
      font-weight: bold;
      font-size: 11px;
      background: #1890ff;
      color: #ffffff;
      width: 80px;
      height: 30px;
      margin-top: -2px;
      margin-left: -2px;
      padding-top: 6px;
    }
  }
`;

const TournamentContent = styled.div`
  .buttons {
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    button {
      margin-right: 5px;
    }
  }

  .ant-form-explain {
    display: none;
  }

  .ant-form-item {
    margin-bottom: 0;
  }
`;
