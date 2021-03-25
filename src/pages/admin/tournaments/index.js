import React, { useEffect, useGlobal, useState } from "reactn";
import { snapshotToArray, spinLoader } from "../../../utils";
import {
  Button,
  Divider,
  List,
  Modal,
  Select as AntSelect,
  Tooltip,
} from "antd";
import { firestore } from "../../../firebase";
import get from "lodash/get";
import { useHistory, useParams } from "react-router";
import moment from "moment";
import { ButtonBombo, Upload } from "../../../components";
import { tournamentTypes } from "../../../components/common/DataList";
import styled from "styled-components";
import { useAcl } from "../../../acl";
import { Icon } from "../../../components/common/Icons";
import { Anchor } from "../../../components/common/Anchor";

export const AdminTournaments = () => {
  const [authUser] = useGlobal("user");
  const history = useHistory();
  const { Acl } = useAcl();

  const [gamesGlobal] = useGlobal("games");
  const [games] = useState(
    gamesGlobal.concat([
      {
        id: "all-today",
        name: "Todos del día",
      },
    ])
  );
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [loadingTournamentsByGame, setLoadingTournamentsByGame] = useState(
    true
  );
  const [tournaments, setTournaments] = useState([]);
  const [limit, setlimit] = useState(20);
  const [setting] = useGlobal("settings");
  const { gameId } = useParams();
  const { Option } = AntSelect;

  useEffect(() => {
    setLoadingTournamentsByGame(true);
    const unsubscribeTournaments = fetchTournaments();
    return () => unsubscribeTournaments();
  }, [gameId, limit]);

  const fetchTournaments = () => {
    let refTournaments = firestore
      .collection("tournaments")
      .where("deleted", "==", false);

    if (gameId !== "all-today")
      refTournaments = refTournaments.where("game.id", "==", gameId);

    if (gameId === "all-today")
      refTournaments = refTournaments.where(
        "startDateFormat",
        "==",
        moment().format("YYYY-MM-DD")
      );

    return refTournaments
      .orderBy("createAt", "desc")
      .limit(limit)
      .onSnapshot((snapshot) => {
        setTournaments(snapshotToArray(snapshot));
        setLoadingTournaments(false);
        setLoadingTournamentsByGame(false);
      });
  };

  const confirmDeleteTournament = (tournament) =>
    Modal.confirm({
      title: "Estás seguro de eliminar?",
      content: "Todos los datos con conexión a este artículo borrados.",
      okText: "SI",
      okType: "danger",
      cancelText: "NO",
      onOk: () => deleteTournament(tournament),
    });

  const deleteTournament = async (tournament) => {
    await updateDeleteTournament(tournament);
    await deleteTournamentGroups(tournament);
    await deleteTournamentTeams(tournament);
  };

  const updateDeleteTournament = (tournament) =>
    firestore
      .collection("tournaments")
      .doc(tournament.id)
      .update({ deleted: true });

  const deleteTournamentGroups = async (tournament) => {
    const snapshotGroups = await firestore
      .collection("tournamentGroups")
      .where("tournamentId", "==", tournament.id)
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .get();

    const groups = snapshotToArray(snapshotGroups);

    groups.map((group) => updateDeleteGroup(group));
  };

  const updateDeleteGroup = (group) =>
    firestore
      .collection("tournamentGroups")
      .doc(group.id)
      .update({ deleted: true });

  const deleteTournamentTeams = async (tournament) => {
    const snapshotTeams = await firestore
      .collection("tournamentTeams")
      .where("tournamentId", "==", tournament.id)
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .get();

    const teams = snapshotToArray(snapshotTeams);

    teams.map((team) => updateDeleteTeam(team));
  };

  const updateDeleteTeam = (team) =>
    firestore
      .collection("tournamentTeams")
      .doc(team.id)
      .update({ deleted: true });

  const updateTournament = async (tournament_, tournamentId_) =>
    await firestore
      .doc(`tournaments/${tournamentId_}`)
      .set({ ...tournament_ }, { merge: true });

  const updateSettings = async (setting_) =>
    await firestore
      .doc("settings/default")
      .set({ ...setting_ }, { merge: true });

  return loadingTournaments ? (
    spinLoader()
  ) : (
    <div>
      <Acl name="/admin/games/:gameId/tournaments/new">
        <ButtonBombo
          margin="0"
          type="primary"
          icon={<Icon type="plus-circle" />}
          className="button-primary"
          onClick={() =>
            history.push(
              `/admin/games/${
                gameId === "all-today" ? gamesGlobal[0].id : gameId
              }/tournaments/new`
            )
          }
        >
          CREAR TORNEO
        </ButtonBombo>
      </Acl>
      <Divider />
      {Object.values(get(authUser, "acls", {}))
        .flatMap((acl) => acl)
        .includes("/admin/games/:gameId/tournaments#ads") && (
        <div>
          <h3>Publicidad para el inicio de torneos</h3>
          <Upload
            isImage={true}
            accept="image/*"
            bucket="tournaments"
            filePath={`tournaments/settings`}
            fileName="tournament-publicity"
            name="tournamentsPlublicityUrl"
            buttonText="Publicidad de Torneos"
            document={setting}
            afterUpload={(setting_) => updateSettings(setting_)}
            sizeResized="1315x150"
          />
        </div>
      )}

      <Divider />

      <StyledSelect
        defaultValue={gameId}
        onSelect={(currentGameId) =>
          history.push(`/admin/games/${currentGameId}/tournaments`)
        }
      >
        {games.map((game) => {
          return (
            <Option value={game.id} key={`key-${game.id}`}>
              {game.name}
            </Option>
          );
        })}
      </StyledSelect>

      {loadingTournamentsByGame ? (
        spinLoader()
      ) : (
        <>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={tournaments}
            renderItem={(tournament) => (
              <List.Item
                key={`key-tournament-id-${tournament.id}`}
                style={{ display: "flex" }}
                actions={[
                  <div
                    style={{
                      width: "300px",
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      alignItems: "flex-end",
                    }}
                  >
                    <div>
                      {moment(tournament.createAt.toDate()).isAfter(
                        moment("12-09-2020", "DD-MM-YYYY")
                      ) && (
                        <Acl name="/admin/games/:gameId/tournaments/:tournamentId">
                          <Tooltip title={"Editar torneo"}>
                            <Icon
                              onClick={() =>
                                history.push(
                                  `/admin/games/${tournament.game.id}/tournaments/${tournament.id}`
                                )
                              }
                              style={{
                                color: "gray",
                                fontSize: "24px",
                                marginLeft: "20px",
                              }}
                              type="edit"
                            />
                          </Tooltip>
                        </Acl>
                      )}
                      <Acl name="/admin/games/:gameId/tournaments#delete">
                        <Tooltip title={"Eliminar torneo"}>
                          <Icon
                            onClick={() => confirmDeleteTournament(tournament)}
                            style={{
                              color: "#fe008f",
                              fontSize: "24px",
                              marginLeft: "20px",
                            }}
                            type="delete"
                          />
                        </Tooltip>
                      </Acl>
                      <Acl name="/admin/games/:gameId/tournaments/new">
                        <Tooltip title={"Duplicar torneo"}>
                          <i
                            className="far fa-clone"
                            onClick={() =>
                              history.push(
                                `/admin/games/${tournament.game.id}/tournaments/new?cloneTournamentId=${tournament.id}`
                              )
                            }
                            style={{
                              color: "#00E679",
                              fontSize: "24px",
                              marginLeft: "20px",
                            }}
                            type="clone"
                          />
                        </Tooltip>
                      </Acl>
                    </div>
                    <div>
                      <Upload
                        isImage={true}
                        accept="image/*"
                        bucket="tournaments"
                        filePath={`tournaments/${tournament.id}`}
                        fileName="tournament-banner"
                        name="tournamentBannerUrl"
                        buttonText="Cartilla torneo"
                        document={tournament}
                        afterUpload={(tournament_) =>
                          updateTournament(tournament_, tournament.id)
                        }
                        sizeResized="1315x150"
                      />
                      <Upload
                        isImage={true}
                        accept="image/*"
                        bucket="tournaments"
                        filePath={`tournaments/${tournament.id}`}
                        fileName="tournament-publicity"
                        name="tournamentPlublicityUrl"
                        buttonText="Publicidad del Torneo"
                        document={tournament}
                        afterUpload={(tournament_) =>
                          updateTournament(tournament_, tournament.id)
                        }
                        sizeResized="1315x150"
                      />
                    </div>
                  </div>,
                ]}
              >
                <div>
                  <h3 style={{ margin: "0px" }} key={tournament.id}>
                    {tournament.name.toUpperCase()}
                  </h3>
                  <h5>
                    TIPO DE TORNEO:{" "}
                    {get(
                      tournamentTypes.find(
                        (type) => type.value === tournament.tournamentType
                      ),
                      "name",
                      ""
                    ).toUpperCase()}
                  </h5>
                  <h5>LIMITE EQUIPOS/PLAYERS: {tournament.playersLimit}</h5>
                  <h5>
                    TOTAL EQUIPOS/PLAYERS INSCRITOS:{" "}
                    {get(tournament, "countTournamentTeams", 0)}
                  </h5>
                  <h5>
                    PREMIO:{" "}
                    {get(tournament, "awards", []).reduce(
                      (sum, a) => sum + a,
                      0
                    )}
                  </h5>
                  <h5>JUEGO: {tournament.game.name.toUpperCase()}</h5>
                  <h5>CONSOLE: {tournament.console.name.toUpperCase()}</h5>
                  <h5>
                    REGLA: {tournament.rule.name.toUpperCase()}
                    &nbsp;[{tournament.rule.totalPlayers} vs{" "}
                    {tournament.rule.totalPlayers}]
                  </h5>
                  <h5>INSCRIPCION: {tournament.entryCost}</h5>
                  <h5>
                    F. INSCRIPCION:{" "}
                    {moment(tournament.inscriptionDate.toDate()).format(
                      "DD/MM/YYYY hh:mm:ss A"
                    )}
                  </h5>
                  <h5>
                    F. COMIENZO:{" "}
                    {moment(tournament.startDate.toDate()).format(
                      "DD/MM/YYYY hh:mm:ss A"
                    )}
                  </h5>
                  <h5>
                    F. FIN:{" "}
                    {moment(tournament.endDate.toDate()).format(
                      "DD/MM/YYYY hh:mm:ss A"
                    )}
                  </h5>
                  <h5>
                    LINK CORTO:{" "}
                    <a
                      href={`${window.location.origin}/brief/${tournament.id}`}
                      target="_blank"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {" "}
                      {`${window.location.origin}/brief/${tournament.id}`}
                    </a>
                  </h5>
                  <h5>
                    LINK :{" "}
                    <a
                      href={`${window.location.origin}/games/${tournament.game.id}/consoles/${tournament.console.id}/tournaments/${tournament.id}`}
                      target="_blank"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                    >
                      {`${window.location.origin}/games/${tournament.game.id}/consoles/${tournament.console.id}/tournaments/${tournament.id}`}
                    </a>
                  </h5>
                  <div style={{ display: "flex" }}>
                    <Acl name="/admin/tournaments/:tournamentId/tournament-teams">
                      <ButtonBombo
                        margin="0"
                        onClick={() =>
                          moment(tournament.createAt.toDate()).isAfter(
                            moment("12-09-2020", "DD-MM-YYYY")
                          )
                            ? history.push(
                                `/admin/tournaments/${tournament.id}/tournament-teams`
                              )
                            : history.push(
                                `/admin/tournaments/${tournament.id}/tournament-users`
                              )
                        }
                        type="primary"
                        style={{ margin: "5px" }}
                      >
                        VER EQUIPOS
                      </ButtonBombo>
                    </Acl>
                    {moment(tournament.createAt.toDate()).isAfter(
                      moment("12-09-2020", "DD-MM-YYYY")
                    ) && (
                      <>
                        <Acl name="/admin/tournaments/:tournamentId/tournament-groups">
                          <Tooltip title="Estara habilitado cuando tu fecha actual este por delante de la FECHA FIN DE INSCRIPCION">
                            <ButtonBombo
                              margin="0"
                              onClick={() =>
                                history.push(
                                  `/admin/tournaments/${tournament.id}/tournament-groups`
                                )
                              }
                              disabled={moment().isBefore(
                                tournament.inscriptionDate.toDate()
                              )}
                              type="primary"
                              style={{ margin: "5px" }}
                            >
                              VER GRUPOS
                            </ButtonBombo>
                          </Tooltip>
                        </Acl>
                        <Acl name="/admin/tournaments/:tournamentId/awards">
                          <ButtonBombo
                            margin="0"
                            onClick={() =>
                              history.push(
                                `/admin/tournaments/${tournament.id}/awards`
                              )
                            }
                            type="primary"
                            style={{ margin: "5px" }}
                          >
                            PREMIOS
                          </ButtonBombo>
                        </Acl>
                      </>
                    )}
                  </div>
                </div>
              </List.Item>
            )}
          />
          {limit <= tournaments.length && (
            <Anchor type="primary" onClick={() => setlimit(limit + 5)}>
              Ver más
            </Anchor>
          )}
        </>
      )}
    </div>
  );
};

const StyledSelect = styled(AntSelect)`
  margin-bottom: 1rem !important;
  width: 200px;
`;
