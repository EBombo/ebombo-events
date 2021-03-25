import React, {useEffect, useState} from "reactn";
import {useParams} from "react-router-dom";
import UrlAssembler from "url-assembler";
import {useHistory} from "react-router";
import {Input, Modal, Select, Tooltip} from "antd";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import defaultTo from "lodash/defaultTo";
import orderBy from "lodash/orderBy";
import flatMap from "lodash/flatMap";
import moment from "moment";
import styled from "styled-components";
import {config, firestore} from "../../../../../firebase";
import {gaError, snapshotToArray, spinLoader} from "../../../../../utils";
import {ModalContainer} from "../../../../../components/common/ModalContainer";
import {Icon} from "../../../../../components/common/Icons";
import {useErrorHandler} from "react-error-boundary";
import {useOwnFetch} from "../../../../../utils/useFetch/useFetch";
import {ButtonBombo} from "../../../../../components";
import {Anchor} from "../../../../../components/common/Anchor";

export const AdminTournamentAwards = (props) => {
  const { tournamentId } = useParams();
  const history = useHistory();
  const [isSavingTournament, setIsSavingTournament] = useState(false);
  const [tournament, setTournament] = useState({});
  const [teams, setTeams] = useState([]);
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeModalSelectedWinner, setActiveModalSelectedWinner] = useState(
    false
  );

  const [awards, setAwards] = useState([""]);
  const [awardTypeFixed, setAwardTypeFixed] = useState([""]);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  const goBack = () =>
    history.push(`/admin/games/${tournament.game.id}/tournaments`);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const tournament_ = await fetchTournament();

    if (isEmpty(tournament_)) return;

    if (
      moment().isAfter(tournament_.endDate.toDate()) ||
      tournament_.tournamentType.includes("battle") ||
      tournament_.tournamentType.includes("manual")
    )
      await getWinners(tournament_);

    setIsLoading(false);
  };

  const fetchTournament = async () => {
    const tournamentRef = await firestore
      .doc(`tournaments/${tournamentId}`)
      .get();
    const tournament_ = tournamentRef.data();

    setTournament(tournament_);

    if (tournament_.awardType === "fixed" && tournament_.fixedAwards) {
      setAwards(tournament_.fixedAwards.map((award) => award.amount));
    } else if (tournament_[`${tournament_.awardType}Awards`]) {
      setAwards(tournament_[`${tournament_.awardType}Awards`]);
    }

    tournament_.fixedAwards
      ? setAwardTypeFixed(
          tournament_.fixedAwards.map((award) => award.awardType)
        )
      : setAwardTypeFixed(["money"]);
    return tournament_;
  };

  const saveTournamentAward = async (isBack = true) => {
    if (!tournament.awardType)
      return props.showNotification(
        "ERROR",
        "No ha seleccionado un tipo de premio"
      );

    try {
      setIsSavingTournament(true);

      let awards_ = {
        fixedAwards: null,
        variableAwards: null,
      };

      awards_[`${tournament.awardType}Awards`] = mapTournament();

      console.log("awards_->", awards_);

      await firestore.doc(`tournaments/${tournamentId}`).update(awards_);

      props.showNotification(
        "REALIZADO",
        "Se realizó correctamente",
        "success"
      );

      isBack && goBack();
    } catch (error) {
      console.error(error);
      props.showNotification("ERROR", "Algo salio mal, intente nuevamente");
    }
    setIsSavingTournament(false);
  };

  const mapTournament = () =>
    awards.map((award, index) => {
      if (tournament.awardType === "variable") return +award;
      if (tournament.awardType === "fixed")
        return {
          amount: +award,
          awardType: awardTypeFixed[index],
        };
      return award;
    });

  const reduceAwards = () => {
    try {
      return awards.reduce((a, b) => +a + +b, 0);
    } catch (error) {
      console.error(error);
      return "";
    }
  };

  const removeAward = (index) => {
    let award_ = [...awards];
    award_.splice(index, 1);
    setAwards(award_);
  };

  const setAward = (award, index) => {
    let newAwards = [...awards];
    if (tournament.awardType === "object" || award === "") {
      newAwards[index] = award;
    } else newAwards[index] = parseInt(award);
    setAwards(newAwards);
  };

  const awardTypeFixedSelect = (index) => (
    <Select
      defaultValue={awardTypeFixed[index]}
      style={{ width: "100px" }}
      onChange={(event) => {
        let awardTypeFixed_ = awardTypeFixed;
        awardTypeFixed_[index] = event;
        setAwardTypeFixed(awardTypeFixed_);
      }}
    >
      <Select.Option value="money">Dinero real</Select.Option>
      <Select.Option value="credit">Credito</Select.Option>
    </Select>
  );

  const getWinners = async (tournament_) => {
    let groups_ = await fetchGroups();
    const teams_ = await fetchTeams();

    let winnerIds = null;

    if (!tournament_.awardType) {
      props.showNotification(
        "INFO",
        "Por favor agregue tipo de premio",
        "warning"
      );
      return history.push(
        `/admin/games/${tournament_.game.id}/tournaments/${tournament_.id}`
      );
    }

    if (
      tournament_.tournamentType.includes("ko") ||
      tournament_.tournamentType.includes("knock-out")
    ) {
      groups_ = groups_.filter((group_) => group_.phase > 0);

      const additionalMatch = groups_.some((group) => group.additionalMatch);

      console.log("----->", groups_, teams_);

      winnerIds = additionalMatch
        ? groups_.slice(0, 2).map((group) => [group.winnerId, group.loserId])
        : groups_.slice(0, 1).map((group) => [group.winnerId, group.loserId]);

      console.log("winnerIds before->", additionalMatch, winnerIds);

      winnerIds = flatMap(winnerIds);
    }

    if (tournament_.tournamentType === "group") {
      let teamsByGroup_ = groups_.map((group_) => teamsByGroup(group_, teams_));

      teamsByGroup_ = flatMap(teamsByGroup_);

      teamsByGroup_ = orderTeamsByScores(teamsByGroup_);

      console.log("teamsByGroup_----->", teamsByGroup_);

      winnerIds = teamsByGroup_.map((winnerTeam_) => winnerTeam_.id);
    }

    if (
      tournament_.tournamentType.includes("battle") ||
      tournament_.tournamentType.includes("manual")
    ) {
      winnerIds = defaultTo(tournament_.winnerIds, []);
    }

    console.log("winnerIds->", winnerIds);

    let winnerTeams = defaultTo(winnerIds, []).map((winnerId) =>
      teams_.find((team_) => team_.id === winnerId)
    );

    winnerTeams = winnerTeams.slice(
      0,
      get(tournament_, `${tournament_.awardType}Awards`, []).length
    );

    console.log("winnerTeams->", winnerTeams);

    setTeams(winnerTeams);
  };

  const teamsByGroup = (group_, teams_) => {
    const teams = group_.tournamentTeams.map((teamGroup) =>
      teams_.find((team_) => team_.id === teamGroup.id)
    );

    return orderTeamsByScores(teams).slice(
      0,
      defaultTo(group_.amountWinners, 1)
    );
  };

  const orderTeamsByScores = (teams_) =>
    orderBy(
      teams_,
      [
        (team_) => get(team_, "score.points", 0),
        (team_) => get(team_, "score.average", 0),
        (team_) => get(team_, "score.goalsFor", 0),
        (team_) => get(team_, "score.goalsAgainst", 0),
        (team_) => get(team_, "createAt", moment()).toDate(),
      ],
      ["desc", "desc", "desc", "asc", "asc"]
    );

  const fetchGroups = async () => {
    const groupsRef = await firestore
      .collection("tournamentGroups")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .get();

    return orderBy(
      snapshotToArray(groupsRef),
      ["phase", "index"],
      ["desc", "asc"]
    );
  };

  const fetchTeams = async () => {
    const teamsQuerySnapShot = await firestore
      .collection("tournamentTeams")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .get();

    setTournamentTeams(snapshotToArray(teamsQuerySnapShot));
    return snapshotToArray(teamsQuerySnapShot);
  };

  const payAwardsConfirm = () =>
    Modal.confirm({
      title: "Estás seguro?",
      content: "Pagar premio",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () => payAwards(),
    });

  const payAwards = async () => {
    await saveTournamentAward(false);
    const teamsWinnerIds = teams.map((team) => team.id);

    try {
      await firestore
        .doc(`tournaments/${tournamentId}`)
        .update({ winnerIds: teamsWinnerIds });

      await ownFetch(urlApiAdminTournamentPayAward(), "POST", {
        teamsWinnerIds,
      });

      props.showNotification(
        "REALIZADO",
        `Se realizo el pago a todos los ganadores correctamente.`,
        "success"
      );

      goBack();
    } catch (error) {
      gaError("Error", "POST /admin/tournaments/:tournamentId/pay-awards");
      handleError({ ...error, action: "payAwards" });
    }
  };

  const urlApiAdminTournamentPayAward = () =>
    new UrlAssembler(config.serverUrl)
      .template("/admin/tournaments/:tournamentId/pay-awards")
      .param({ tournamentId })
      .toString();

  return isLoading ? (
    spinLoader()
  ) : (
    <div>
      <ModalContainer
        footer={null}
        visible={activeModalSelectedWinner}
        onCancel={() =>
          setActiveModalSelectedWinner(!activeModalSelectedWinner)
        }
      >
        <ContentModal className="ms-normal">
          <b>SELECCIONE AL GANADOR</b>
          {tournamentTeams.map((team, index) => (
            <div
              className="list-team"
              onClick={() => {
                setActiveModalSelectedWinner(false);
                let teams_ = teams;
                teams.push(team);
                setTeams(teams_);
              }}
            >
              {team.playerIds.length > 1
                ? get(team, "name", " - ")
                : get(team, "players[0].nickname", " - ").toUpperCase()}
            </div>
          ))}
        </ContentModal>
      </ModalContainer>
      <h2 className="text-decoration-h2">Premios</h2>
      <br />
      {awards.map((award, index) => (
        <div
          key={`award-${index}`}
          style={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
          }}
        >
          <Input
            addonBefore={
              get(teams, `[${index}]`) && (
                <Anchor
                  type="primary"
                  onClick={() =>
                    window.open(
                      `http://${window.location.host}/admin/users/${get(
                        teams,
                        `[${index}]players[0].id`
                      )}`,
                      "_blank"
                    )
                  }
                >
                  Ver capitan
                </Anchor>
              )
            }
            name="team"
            value={
              get(tournament, "rule.totalPlayers", 1) > 1 && !isEmpty(teams)
                ? index + 1 + "ºPUESTO: " + get(teams, `[${index}].name`, "-")
                : index +
                  1 +
                  "ºPUESTO: " +
                  get(teams, `[${index}]players[0].nickname`, "-")
            }
            disabled={true}
            addonAfter={
              (get(tournament, "tournamentType", "-").includes("battle") ||
                tournament.tournamentType.includes("manual")) && (
                <Anchor
                  type="primary"
                  disabled={index !== teams.length}
                  onClick={() => setActiveModalSelectedWinner(true)}
                >
                  Asignar Ganador
                </Anchor>
              )
            }
          />
          <Input
            name={`award[${index}]`}
            value={awards[index]}
            placeholder={`Premio ${index + 1}`}
            onChange={(event) => setAward(event.target.value, index)}
            addonAfter={
              tournament.awardType === "fixed" && awardTypeFixedSelect(index)
            }
            type={
              tournament.awardType === "fixed" ||
              tournament.awardType === "variable"
                ? "number"
                : "text"
            }
            addonBefore={tournament.awardType === "variable" && "%"}
          />
          {defaultTo(awards, []).length > 1 && (
            <ButtonBombo
              type="secondary"
              disabled={isLoading}
              onClick={() => removeAward(index)}
            >
              QUITAR
            </ButtonBombo>
          )}
        </div>
      ))}
      <br />
      {awards.length < 4 && (
        <ButtonBombo
          type="primary"
          disabled={isLoading || tournament.isClosed}
          onClick={() => {
            setAwards(awards.concat(""));
            setAwardTypeFixed(awardTypeFixed.concat("money"));
          }}
        >
          <Icon type="plus" /> AÑADIR PUESTO
        </ButtonBombo>
      )}
      {(tournament.awardType === "fixed" ||
        tournament.awardType === "variable") && (
        <div style={{ textAlign: "center" }}>
          Total : <b>{reduceAwards()}</b>
          {tournament.awardType === "variable" && " %"}
        </div>
      )}
      <hr style={{ margin: "10px auto", width: "90%" }} />
      <div style={{ display: "flex" }}>
        <ButtonBombo
          type="secondary"
          onClick={() => goBack()}
          disabled={isLoading}
        >
          CANCELAR
        </ButtonBombo>
        <ButtonBombo
          type="primary"
          loading={isLoading}
          style={{ marginLeft: "10px" }}
          onClick={saveTournamentAward}
          disabled={
            awards.some((a) => isEmpty("" + a)) ||
            props.closed ||
            tournament.isClosed
          }
        >
          GUARDAR
        </ButtonBombo>
      </div>
      <Tooltip title="Estara habiitado cuando tu fecha actual este por delante de la FECHA FIN DEL TONEO ">
        <ButtonBombo
          type="primary"
          onClick={() => payAwardsConfirm()}
          loading={isLoading}
          disabled={
            isSavingTournament ||
            tournament.isClosed ||
            awards.some((a) => isEmpty("" + a)) ||
            isEmpty(teams)
          }
        >
          PAGAR PREMIOS
        </ButtonBombo>
      </Tooltip>
    </div>
  );
};

const ContentModal = styled.div`
  display: flex;
  flex-direction: column;
  .list-team {
    color: ${(props) => props.theme.basic.white};
    cursor: pointer;
    :hover {
      color: ${(props) => props.theme.basic.primary};
    }
  }
`;
