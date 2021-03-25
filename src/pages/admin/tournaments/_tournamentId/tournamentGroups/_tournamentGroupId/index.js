import {message} from "antd";
import {firestore} from "../../../../../../firebase";
import React, {useEffect, useState} from "react";
import moment from "moment";
import {useParams} from "react-router-dom";
import {Controller, useForm} from "react-hook-form";
import {ButtonBombo, DatePicker, Input} from "../../../../../../components";
import {finishTimeByRule, snapshotToArray, spinLoader,} from "../../../../../../utils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import flatMap from "lodash/flatMap";
import {date, number, object, string} from "yup";
import {useHistory} from "react-router";
import robin from "roundrobin";

const newGroup = {
  name: "",
  totalPlayers: "",
  startDate: "",
  deleted: false,
};

export const AdminGroupEdit = (props) => {
  const schema = object().shape({
    name: string().required(),
    totalPlayers: number().required().min(2),
    amountWinners: number().required().min(1),
    startDate: date().required(),
  });

  const { tournamentGroupId, tournamentId } = useParams();
  const history = useHistory();
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [group, setGroup] = useState({});
  const [groups, setGroups] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [isLoadingGroup, setIsLoadingGroup] = useState(true);
  const { register, errors, handleSubmit, control } = useForm({
    validationSchema: schema,
    reValidateMode: "onSubmit",
  });

  useEffect(() => {
    fetchTournament();
    fetchTournamentGroup();
    fetchTournamentGroups();
    fetchTournamentTeams();
  }, []);

  const fetchTournamentGroup = async () => {
    if (tournamentGroupId === "new") {
      const newId = firestore.collection("tournamentGroups").doc().id;
      setGroup({ id: newId, ...newGroup });
    } else {
      const groupRef = await firestore
        .collection("tournamentGroups")
        .doc(tournamentGroupId)
        .get();
      groupRef.exists ? setGroup(groupRef.data()) : history.push("/notFound");
    }
    setIsLoadingGroup(false);
  };

  const fetchTournament = async () => {
    const tournamentsRef = await firestore
      .doc("tournaments/" + tournamentId)
      .get();

    setTournament(tournamentsRef.data());
  };

  const fetchTournamentGroups = async () => {
    const snapshot = await firestore
      .collection("tournamentGroups")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .get();

    const groups_ = snapshotToArray(snapshot).filter(
      (group_) => group_.id !== tournamentGroupId
    );

    setGroups(groups_);
  };

  const fetchTournamentTeams = async () => {
    const snapshot = await firestore
      .collection("tournamentTeams")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .get();

    setTeams(snapshotToArray(snapshot));
  };

  const mapGroup = (data) => ({
    id: group.id,
    name: data.name,
    totalPlayers: data.totalPlayers,
    amountWinners: data.amountWinners,
    startDate: data.startDate,
    createAt: group.createAt ? group.createAt : moment().toDate(),
    updateAt: new Date(),
    deleted: group.deleted,
    tournamentId: tournamentId,
    score: {},
    phase: get(group, "phase", 0),
  });

  const saveGroup = async (data) => {
    try {
      setIsSavingGroup(true);

      let currentGroup = mapGroup(data);

      currentGroup = await formatGroupByPhase(currentGroup);

      await firestore
        .doc("tournamentGroups/" + group.id)
        .set(currentGroup, { merge: true });

      message.success("Se realizó la operación correctamente", 5);
      history.goBack();
    } catch (error) {
      console.error(error);
      message.error("Algo salio mal, intente nuevamente", 5);
    }
    setIsSavingGroup(false);
  };

  const formatGroupByPhase = async (currentGroup) => {
    if (isEmpty(tournament)) return;

    if (!isEmpty(group.matchIds)) await deleteMatches(group);

    const idsTeamsOccupied = groups.reduce(
      (ids, group_) => defaultTo(ids, []).concat(group_.tournamentTeamIds),
      []
    );

    const teamsFree = teams.filter(
      (team) => !idsTeamsOccupied.includes(team.id)
    );

    const teamsToMyGroup =
      group.phase > 1
        ? group.tournamentTeams
        : teamsFree.slice(0, currentGroup.totalPlayers);

    currentGroup.tournamentTeams = teamsToMyGroup;
    currentGroup.tournamentTeamIds = teamsToMyGroup.reduce(
      (ids, team_) => defaultTo(ids, []).concat(team_.id),
      []
    );
    currentGroup.totalPlayers = currentGroup.tournamentTeamIds.length;
    currentGroup.score = {};

    currentGroup.matchIds = await generateRounds(currentGroup, tournament);

    return currentGroup;
  };

  const generateRounds = async (currentGroup, tournament) => {
    const rounds = robin(
      currentGroup.tournamentTeams.length,
      currentGroup.tournamentTeams
    );

    const promisesMatchesIds = rounds.map(async (round, idx) => {
      const promiseRoundMatchesIds = round.map(async (pairOfTeams) => {
        return await createMatch(
          {
            id: currentGroup.id,
            tournamentTeams: [pairOfTeams[0], pairOfTeams[1]],
            startDate: moment(currentGroup.startDate)
              .add(idx * 0.5, "hours")
              .toDate(),
            scheduleDate: idx + 1,
          },
          tournament
        );
      });

      return await Promise.all(promiseRoundMatchesIds);
    });

    let matchIds = await Promise.all(promisesMatchesIds);
    matchIds = flatMap(matchIds).filter((matchId) => matchId);

    return matchIds;
  };

  const createMatch = async (currentGroup, tournament) => {
    const matchRef = firestore.collection("matches");
    const matchId = matchRef.doc().id;

    await matchRef.doc(matchId).set(
      {
        id: matchId,
        challengerReady: true,
        challenger: currentGroup.tournamentTeams[0].players,
        challengerTeamName: get(
          currentGroup,
          "tournamentTeams[0].name",
          "Team Challenger"
        ),
        challengerTeamImageUrlThumb: get(
          currentGroup,
          "tournamentTeams[0].teamImageUrlThumb",
          null
        ),
        challengerTeamId: currentGroup.tournamentTeams[0].id,
        challengerIds: currentGroup.tournamentTeams[0].playerIds,
        challenged: currentGroup.tournamentTeams[1].players,
        challengedTeamName: get(currentGroup, "tournamentTeams[1].name", null),
        challengedTeamImageUrlThumb: get(
          currentGroup,
          "tournamentTeams[1].teamImageUrlThumb",
          null
        ),
        challengedTeamId: currentGroup.tournamentTeams[1].id,
        challengedIds: currentGroup.tournamentTeams[1].playerIds,
        playersIds: currentGroup.tournamentTeams[0].playerIds.concat(
          currentGroup.tournamentTeams[1].playerIds
        ),
        rule: tournament.rule,
        game: tournament.game,
        console: tournament.console,
        gameEntryCost: 0,
        createAt: currentGroup.startDate,
        updateAt: new Date(),
        isCanceled: false,
        isClosed: false,
        additionalRule: null,
        challengerAcceptInvitation: currentGroup.tournamentTeams[0].playerIds,
        challengedAcceptInvitation: currentGroup.tournamentTeams[1].playerIds,
        finishAt: finishTimeByRule(tournament.rule, currentGroup.startDate),
        scheduleDate: currentGroup.scheduleDate,
        tournamentId,
        tournament,
        tournamentGroupId: currentGroup.id,
        updatePoints: get(tournament, "updatePoints", true),
      },
      { merge: true }
    );

    return matchId;
  };

  const deleteMatches = async (tournamentGroup) => {
    const batchRef = firestore.batch();

    tournamentGroup.matchIds.forEach((matchId) =>
      batchRef.delete(firestore.doc("matches/" + matchId))
    );

    await batchRef.commit();
  };

  return isLoadingGroup ? (
    spinLoader()
  ) : (
    <div>
      <form onSubmit={handleSubmit(saveGroup)} noValidate>
        <h2 className="text-decoration-h2">GRUPOS</h2>
        <Input
          variant="secondary"
          error={errors.name}
          required
          label="Nombre de grupo"
          ref={register}
          name="name"
          placeholder="Ingrese nombre de grupo"
          type="text"
          defaultValue={get(group, "name", "")}
        />
        <Input
          variant="secondary"
          error={errors.totalPlayers}
          label="Cantidad de jugadores"
          required
          name="totalPlayers"
          disabled={!get(tournament, "tournamentType", "").includes("group")}
          ref={register}
          placeholder="Cantidad de jugadores"
          type="number"
          min={2}
          defaultValue={get(group, "totalPlayers", 2)}
        />
        <Input
          variant="secondary"
          error={errors.amountWinners}
          label="Cantidad de equipos ganadores del grupo"
          required
          name="amountWinners"
          disabled={!get(tournament, "tournamentType", "").includes("group")}
          ref={register}
          placeholder="Cantidad de ganadores"
          type="number"
          min={1}
          defaultValue={get(group, "amountWinners", 1)}
        />
        <Controller
          key={get(group, "startDate", "startDate")}
          name="startDate"
          control={control}
          defaultValue={
            group && group.startDate ? moment(group.startDate.toDate()) : null
          }
          as={
            <DatePicker
              placeholder="Fecha de partidos"
              error={errors.startDate}
              showTime={true}
              style={{ width: "100%" }}
              label="Fecha de partidos"
              format={"DD/MM/YYYY HH:mm:ss"}
              required
            />
          }
        />
        <div style={{ display: "flex" }}>
          <ButtonBombo
            type="secondary"
            margin="0"
            disabled={isSavingGroup}
            onClick={() => history.goBack()}
          >
            Cancelar
          </ButtonBombo>
          <ButtonBombo
            margin="0"
            loading={isSavingGroup}
            disabled={isSavingGroup}
            htmlType="submit"
          >
            Guardar
          </ButtonBombo>
        </div>
      </form>
    </div>
  );
};
