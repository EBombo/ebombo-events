import React, { useEffect, useGlobal, useState } from "reactn";
import { snapshotToArray, spinLoader } from "../../../../../utils";
import { List as ListAntd, message, Modal, Tabs, Tooltip } from "antd";
import { config, firestore } from "../../../../../firebase";
import defaultTo from "lodash/defaultTo";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import orderBy from "lodash/orderBy";
import { useHistory, useParams } from "react-router";
import moment from "moment";
import {
  ButtonBombo,
  ContentPositionTree,
  ContentTableStatistics,
} from "../../../../../components";
import { AdminTournamentGroupsMatches } from "./_tournamentGroupId/tournamentGroupsMatches";
import styled from "styled-components";
import { AdminTournamentAwards } from "../tournamentAwards";
import { ContainerTableStatisticsBattleRoyale } from "../../../../games/_gameId/consoles/_consoleId/tournaments/_tournamentId/ContainerTableStatisticsBattleRoyale";
import { useAcl } from "../../../../../acl";
import { Icon } from "../../../../../components/common/Icons";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../utils/useFetch/useFetch";
import { darkTheme } from "../../../../../styles/theme";
import { DateToMatchesContainer } from "./DateToMatches";
import { useSendError } from "../../../../../components/error-fallback/useSendError";

export const AdminTournamentGroups = (props) => {
  const history = useHistory();
  const { Acl } = useAcl();
  const { tournamentId } = useParams();

  const [loadingTournamentGroups, setLoadingTournamentGroups] = useState(true);
  const [loadingGenerateGroups, setLoadingGenerateGroups] = useState(false);
  const [tournamentGroups, setTournamentGroups] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [tournamentTeams, setTournamentTeams] = useState(null);
  const [phases, setPhases] = useState([]);
  const [isModalDateMatch, setIsModalDateMatch] = useState(false);
  const [loadingTournamentTeams, setLoadingTournamentTeams] = useState(true);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();
  const { sendError } = useSendError();

  const goBack = () =>
    history.push(`/admin/games/${tournament.game.id}/tournaments`);

  useEffect(() => {
    const unsubscribeTournaments = fetchTournamentGroups();
    const unsubscribeTournamentTeams = fetchTournamentTeams();
    fetchTournament();
    return () => {
      unsubscribeTournaments();
      unsubscribeTournamentTeams();
    };
  }, []);

  const fetchTournamentGroups = () =>
    firestore
      .collection("tournamentGroups")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .orderBy("createAt", "asc")
      .onSnapshot((snapshot) => {
        setTournamentGroups(snapshotToArray(snapshot));
        setLoadingTournamentGroups(false);
      });

  const fetchTournamentTeams = () =>
    firestore
      .collection("tournamentTeams")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .onSnapshot((snapShot) => {
        setTournamentTeams(snapshotToArray(snapShot));
        setLoadingTournamentTeams(false);
      });

  const fetchTournament = async () => {
    const tournamentsRef = await firestore
      .doc("tournaments/" + tournamentId)
      .get();

    setTournament(tournamentsRef.data());
  };

  const tournamentGroupsOrderByPhase = (tournamentGroups_) =>
    orderBy(
      tournamentGroups_,
      [(tournamentGroup_) => tournamentGroup_.phase],
      ["desc"]
    );

  const tournamentGroupsOrderByCreateAndName = (tournamentGroups_) =>
    orderBy(tournamentGroups_, ["phase", "name"], ["asc", "asc"]);

  const deleteTournamentGroup = (tournamentGroup) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: async () => {
        if (!tournamentGroup) return await deleteAllGroupsKo();

        await deleteMatches(tournamentGroup);
        await firestore
          .collection("tournamentGroups")
          .doc(tournamentGroup.id)
          .update({ deleted: true });
      },
    });

  const deleteAllGroupsKo = async () => {
    setLoadingGenerateGroups(true);
    const groupsToDeleted = tournamentGroups.filter(
      (group) => group.phase >= 1
    );

    const matchesIds = groupsToDeleted
      .filter((group) => group.matchIds)
      .reduce((ids, group) => group.matchIds && ids.concat(group.matchIds), []);

    await deleteMatches({ matchIds: matchesIds });
    await deleteGroups(groupsToDeleted);
    setLoadingGenerateGroups(false);
  };

  const deleteMatches = async (tournamentGroup) => {
    if (isEmpty(tournamentGroup.matchIds)) return;

    const batchRef = firestore.batch();

    tournamentGroup.matchIds.forEach((matchId) =>
      batchRef.delete(firestore.doc("matches/" + matchId))
    );

    await batchRef.commit();
  };

  const deleteGroups = async (groups) => {
    if (isEmpty(groups)) return;

    const batchRef = firestore.batch();

    groups.forEach((group) =>
      batchRef.delete(firestore.doc("tournamentGroups/" + group.id))
    );

    await batchRef.commit();
  };

  const modalDateMatches = () => (
    <Modal
      footer={null}
      visible={isModalDateMatch}
      onCancel={() => {
        setIsModalDateMatch(false);
      }}
    >
      <DateToMatchesContainer
        generateGroup={generateGroup}
        loadingGenerateGroups={loadingGenerateGroups}
      />
    </Modal>
  );

  const generateGroup = async (newGroup) => {
    setLoadingGenerateGroups(true);
    try {
      await ownFetch(
        `${config.serverUrlAdmin}/tournaments/${tournamentId}/tournament-groups/knockout`,
        "POST",
        { ...newGroup }
      );

      setIsModalDateMatch(false);
      props.showNotification("SUCECSS", "GENERADO CORRECTAMENTE", "success");
    } catch (error) {
      console.error(error);
      await sendError(error);
      props.showNotification("ERROR", "ALGO SALIO MAL INTENTALO NUEVAMENTE");
    }
    setLoadingGenerateGroups(false);
  };

  const recalculateConfirm = () => {
    Modal.confirm({
      title: "Esta seguro que desea recalcular el puntaje de los grupos?",
      okText: "Si",
      okType: "danger",
      cancelText: "No",
      onOk: () => recalculatePoints(),
    });
  };

  const recalculatePoints = async () => {
    try {
      await ownFetch(
        `${config.serverUrl}/tournaments/${tournament.id}/calculate-points`,
        "PUT"
      );

      message.success("Se han actualizado los puntajes correctamente.");
    } catch (error) {
      handleError({ ...error, action: "recalculatePoints" });
    }
  };

  return loadingTournamentGroups ||
    isEmpty(tournament) ||
    loadingTournamentTeams ? (
    spinLoader()
  ) : (
    <div>
      {isModalDateMatch && modalDateMatches()}
      <div>
        {
          <ButtonBombo
            margin="0"
            style={{
              background: "none",
              color: `${darkTheme.basic.black}`,
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
            }}
            onClick={() => goBack()}
          >
            <i
              className="fas fa-chevron-circle-left"
              style={{ marginRight: "10px" }}
            />
            Go back
          </ButtonBombo>
        }
        {tournament.tournamentType.includes("group") && (
          <ButtonBombo
            margin="0"
            icon={<Icon type="plus-circle" />}
            style={{ margin: "5px" }}
            className="button-primary"
            disabled={
              isEmpty(tournamentGroups) ||
              tournamentGroups.some((group) => group.phase !== 0) ||
              loadingGenerateGroups
            }
            loading={loadingGenerateGroups}
            onClick={() => recalculateConfirm()}
          >
            RECALCULAR PUNTOS
          </ButtonBombo>
        )}
        {tournament.tournamentType.includes("group") && (
          <ButtonBombo
            margin="0"
            style={{ margin: "5px" }}
            className="button-primary"
            icon={<Icon type="plus-circle" />}
            disabled={
              get(tournament, "countTournamentTeams", 0) ===
                tournamentGroups
                  .filter((group) => group.phase === 0)
                  .reduce((sum, group) => sum + group.totalPlayers, 0) ||
              loadingGenerateGroups
            }
            loading={loadingGenerateGroups}
            onClick={() =>
              history.push(
                `/admin/tournaments/${tournamentId}/tournament-groups/new`
              )
            }
          >
            CREAR GRUPO
          </ButtonBombo>
        )}
        {(tournament.tournamentType.includes("knock") ||
          tournament.tournamentType.includes("ko")) && (
          <ButtonBombo
            margin="0"
            style={{ margin: "5px" }}
            className="button-primary"
            disabled={
              (tournament.tournamentType.includes("ko") &&
                isEmpty(tournamentGroups)) ||
              tournamentGroups.some((group) => isEmpty(group.score)) ||
              tournamentGroups.some((group) => group.phase >= 1) ||
              loadingGenerateGroups
            }
            loading={loadingGenerateGroups}
            onClick={() => setIsModalDateMatch(true)}
          >
            GENERAR ARBOL
          </ButtonBombo>
        )}
        {(tournament.tournamentType.includes("knock") ||
          (tournament.tournamentType.includes("ko") &&
            tournamentGroups.some((group) => group.phase >= 1))) && (
          <ButtonBombo
            margin="0"
            disabled={isEmpty(tournamentGroups)}
            style={{ margin: "5px" }}
            className="button-primary"
            onClick={() => deleteTournamentGroup()}
          >
            ELIMINAR ARBOL
          </ButtonBombo>
        )}
      </div>
      <Tabs
        defaultActiveKey="list"
        onChange={(tab) => console.log("tab->", tab)}
      >
        <Tabs.TabPane tab="LISTA DE GRUPOS" key="listGroups">
          {tournament.tournamentType.includes("battle") ? (
            <ContainerTableStatisticsBattleRoyale
              tournament={tournament}
              tournamentTeams={tournamentTeams}
            />
          ) : (
            <List
              itemLayout="vertical"
              size="large"
              dataSource={tournamentGroupsOrderByCreateAndName(
                tournamentGroups
              )}
              renderItem={(tournamentGroup) => (
                <List.Item
                  style={{ display: "flex" }}
                  key={tournamentGroup.id}
                  actions={[
                    tournamentGroup.tournamentTeams.every((team) => team.id) ? (
                      tournamentGroup.endDate ? (
                        <div>El partido ha concluido</div>
                      ) : (
                        <>
                          {moment().isAfter(
                            moment(tournamentGroup.startDate.toDate())
                          ) &&
                            tournamentGroup.phase === 0 && (
                              <div style={{ color: "red" }}>
                                SI CAMBIAS LA FECHA BORRARÁ EL RESULTADO ACTUAL
                              </div>
                            )}
                          {tournamentGroup.phase === 0 && (
                            <Acl name="/admin/tournaments/:tournamentId/awards">
                              <Tooltip title={"Editar torneo"}>
                                <Icon
                                  onClick={() =>
                                    history.push(
                                      `/admin/tournaments/${tournamentId}/tournament-groups/${tournamentGroup.id}`
                                    )
                                  }
                                  style={{
                                    color: "gray",
                                    fontSize: "24px",
                                    alignSelf: "right",
                                  }}
                                  type="edit"
                                />
                              </Tooltip>
                            </Acl>
                          )}
                          {tournamentGroup.phase === 0 && (
                            <Tooltip title={"Eliminar grupo"}>
                              <Icon
                                onClick={() =>
                                  deleteTournamentGroup(tournamentGroup)
                                }
                                style={{ color: "#fe008f", fontSize: "24px" }}
                                type="delete"
                              />
                            </Tooltip>
                          )}
                        </>
                      )
                    ) : (
                      <div>Pase automatico a la siguiente fase</div>
                    ),
                  ]}
                >
                  <div key={tournamentGroup.id}>
                    {tournamentGroup.phase >= 1 && (
                      <>
                        <h3
                          style={{ margin: "0px" }}
                          onClick={() => console.log(tournamentGroup)}
                        >
                          {get(tournamentGroup, "name", "-")}
                        </h3>
                        {tournamentGroup.additionalMatch && (
                          <h5>PARTIDO DE 3er y 4to</h5>
                        )}
                        <h5>
                          TOTAL EQUIPOS:{" "}
                          {get(tournamentGroup, "totalPlayers", "-")}
                        </h5>
                        <h5>
                          FECHA DE ROUND:{" "}
                          {moment(tournamentGroup.startDate.toDate()).format(
                            "DD/MM/YYYY hh:mm A"
                          )}
                        </h5>
                        <h4>EQUIPOS:</h4>
                      </>
                    )}
                    <div style={{ color: "green" }}>
                      {tournamentGroup.phase >= 1 ? (
                        get(tournamentGroup, "tournamentTeams", []).map(
                          (team, index) =>
                            tournament.rule.totalPlayers > 1 ? (
                              <>
                                <h5 key={`key-name-team-${index}`}>
                                  {get(team, `name`, "-")}[
                                  {get(
                                    tournamentGroup,
                                    `score[${get(team, "id")}]`,
                                    "-"
                                  )}
                                  ]
                                </h5>
                              </>
                            ) : (
                              <>
                                <h5 key={`key-name-team-${index}`}>
                                  {get(team, `players[0].nickname`, "-")}[
                                  {get(
                                    tournamentGroup,
                                    `score[${get(team, "id")}]`,
                                    "-"
                                  )}
                                  ]
                                </h5>
                              </>
                            )
                        )
                      ) : (
                        <>
                          Pasan {tournamentGroup.amountWinners}
                          <ContentTableStatistics
                            tournament={tournament}
                            tournamentTeams={tournamentTeams}
                            tournamentGroups={[tournamentGroup]}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
        </Tabs.TabPane>
        {tournament.tournamentType.includes("group") && (
          <Tabs.TabPane tab="FECHAS DE FASE DE GRUPOS" key="groupsMatches">
            <AdminTournamentGroupsMatches
              key={"key-group-phase-matches"}
              tournament={tournament}
              tournamentGroups={defaultTo(tournamentGroups, []).filter(
                (groups) => get(groups, "phase") === 0
              )}
            />
          </Tabs.TabPane>
        )}
        {(tournament.tournamentType.includes("knock-out") ||
          tournament.tournamentType.includes("ko")) && (
          <Tabs.TabPane tab="ARBOL KO" key="tree">
            <ContentPositionTree
              key={`key-tree-tabs-${get(tournament, "playersLimit", 0)}-${
                defaultTo(tournamentGroups, []).length
              }`}
              tournament={tournament}
              tournamentGroups={defaultTo(tournamentGroups, []).filter(
                (groups) => get(groups, "phase") !== 0
              )}
              editMatch={true}
              currentPhase={
                !isEmpty(tournamentGroups)
                  ? tournamentGroupsOrderByPhase(tournamentGroups)[0].phase
                  : 0
              }
            />
          </Tabs.TabPane>
        )}
        <Tabs.TabPane tab="PREMIOS" key="awards">
          <AdminTournamentAwards {...props} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

const List = styled(ListAntd)`
  .ant-list-item {
    overflow: auto;
  }
`;
