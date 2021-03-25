import React, { useEffect, useGlobal, useState } from "reactn";
import { snapshotToArray, spinLoader } from "../../../../../utils";
import { Button, List } from "antd";
import { config, firestore } from "../../../../../firebase";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import moment from "moment";
import { useParams } from "react-router";
import { useErrorHandler } from "react-error-boundary";
import { useOwnFetch } from "../../../../../utils/useFetch/useFetch";
import { ButtonBombo } from "../../../../../components";

export const AdminTournamentTeams = () => {
  const { tournamentId } = useParams();

  const [authUser] = useGlobal("user");
  const [loadingTournamentTeams, setLoadingTournamentTeams] = useState(true);
  const [tournamentTeams, setTournamentTeams] = useState([]);
  const [loadingRemoveTeam, setLoadingRemoveTeam] = useState(false);

  const handleError = useErrorHandler();
  const { ownFetch } = useOwnFetch();

  useEffect(() => {
    const unsubscribeTournaments = fetchTournamentTeams();
    return () => unsubscribeTournaments();
  }, []);

  const tournamentTeamsOrder = (tournamentTeams_) =>
    orderBy(
      tournamentTeams_,
      [(tournamentTeam_) => tournamentTeam_.updateAt.toDate()],
      ["desc"]
    );

  const fetchTournamentTeams = () =>
    firestore
      .collection("tournamentTeams")
      .where("tournamentId", "==", tournamentId)
      .where("deleted", "==", false)
      .orderBy("createAt", "desc")
      .onSnapshot((snapshot) => {
        setTournamentTeams(tournamentTeamsOrder(snapshotToArray(snapshot)));
        setLoadingTournamentTeams(false);
      });

  const rejectTeam = async (tournamentTeamId) => {
    try {
      setLoadingRemoveTeam(true);
      await ownFetch(
        `${config.serverUrl}/tournament-teams/${tournamentTeamId}/users/${authUser.id}/reject-team`,
        "PUT"
      );
    } catch (error) {
      handleError({ ...error, action: "rejectTeam" });
    }
    setLoadingRemoveTeam(false);
  };

  const acceptRequest = async (tournamentTeamId) => {
    try {
      setLoadingRemoveTeam(true);
      await ownFetch(
        `${config.serverUrl}/tournament-teams/${tournamentTeamId}/users/${authUser.id}/accept-request`,
        "PUT"
      );
    } catch (error) {
      handleError({ ...error, action: "acceptRequest" });
    }
    setLoadingRemoveTeam(false);
  };

  const buttonAcceptRequest = (tournamentTeam) => (
    <ButtonBombo
      margin="0"
      onClick={() => acceptRequest(tournamentTeam.id)}
      loading={loadingRemoveTeam}
      disabled={loadingRemoveTeam}
      type="primary"
    >
      ACEPTAR SOLICITUD
    </ButtonBombo>
  );

  const linkAcceptRequest = (tournamentTeam) => (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => window.open(tournamentTeam.inscriptionUrl, "_blank")}
    >
      [VER IMAGEN DE PAGO]
    </div>
  );

  return loadingTournamentTeams ? (
    spinLoader()
  ) : (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={tournamentTeamsOrder(tournamentTeams)}
        renderItem={(tournamentTeam) => (
          <List.Item style={{ display: "flex" }} key={tournamentTeam.id}>
            <div onClick={() => console.log(tournamentTeam)}>
              <h3 style={{ margin: "0px" }}>
                {tournamentTeam.tournament.rule.totalPlayers > 1 ? (
                  <>
                    <b>
                      EQUIPO: {get(tournamentTeam, "name", "-").toUpperCase()}
                    </b>
                    {tournamentTeam.members && (
                      <p className="pre-wrap">{tournamentTeam.members}</p>
                    )}
                    <ul>
                      {get(tournamentTeam, "players", []).map(
                        (player, index) => (
                          <li>
                            <div
                              onClick={() =>
                                window.open(
                                  `http://${window.location.host}/admin/users/${player.id}`,
                                  "_blank"
                                )
                              }
                              style={{ cursor: "pointer", color: "blue" }}
                            >
                              Nickname: {player.nickname}
                              {index === 0 &&
                                tournamentTeam.tournament.rule.totalPlayers >
                                  1 &&
                                "[CAPITAN]"}
                            </div>
                            <div>Email: {player.email}</div>
                            {get(tournamentTeam, "tournament.name", "")
                              .toLowerCase()
                              .includes("ulima") && (
                              <div>
                                Codigo de Alumno:{" "}
                                {get(
                                  tournamentTeam,
                                  "players[0].studentId",
                                  "-"
                                )}
                              </div>
                            )}
                            <div>
                              <span
                                onClick={() =>
                                  window.open(
                                    `https://wa.me/${get(
                                      player,
                                      "dialCode",
                                      ""
                                    )}${get(player, "phoneNumber", "")}`,
                                    "_blank"
                                  )
                                }
                                style={{ cursor: "pointer", color: "green" }}
                              >
                                tlf: {get(player, "dialCode", "")}+
                                {get(player, "phoneNumber", "")}
                              </span>
                            </div>
                          </li>
                        )
                      )}
                    </ul>
                    {tournamentTeam.inscriptionUrl &&
                      linkAcceptRequest(tournamentTeam)}
                    <br />
                    <ButtonBombo
                      danger
                      margin="0"
                      onClick={() => rejectTeam(tournamentTeam.id)}
                      loading={loadingRemoveTeam}
                      disabled={
                        loadingRemoveTeam ||
                        moment().isAfter(
                          tournamentTeam.tournament.inscriptionDate.toDate()
                        )
                      }
                      type="primary"
                    >
                      REMOVER EQUIPO
                    </ButtonBombo>
                    <br />
                    {tournamentTeam.inscriptionUrl &&
                      !tournamentTeam.isPayed &&
                      buttonAcceptRequest(tournamentTeam)}
                  </>
                ) : (
                  <>
                    <div
                      onClick={() =>
                        window.open(
                          `http://${window.location.host}/admin/users/${tournamentTeam.players[0].id}`,
                          "_blank"
                        )
                      }
                      style={{ cursor: "pointer", color: "blue" }}
                    >
                      Nickname:{" "}
                      {get(
                        tournamentTeam,
                        "players[0].nickname",
                        "-"
                      ).toUpperCase()}
                    </div>
                    <div>
                      Email: {get(tournamentTeam, "players[0].email", "-")}
                    </div>
                    <div>
                      <span
                        onClick={() =>
                          window.open(
                            `https://wa.me/${get(
                              tournamentTeam,
                              "players[0].dialCode",
                              ""
                            )}${get(
                              tournamentTeam,
                              "players[0].phoneNumber",
                              ""
                            )}`,
                            "_blank"
                          )
                        }
                        style={{ cursor: "pointer", color: "green" }}
                      >
                        tlf: {get(tournamentTeam, "players[0].dialCode", "")}+
                        {get(tournamentTeam, "players[0].phoneNumber", "")}
                      </span>
                    </div>
                    {tournamentTeam.inscriptionUrl &&
                      linkAcceptRequest(tournamentTeam)}
                    <br />
                    <ButtonBombo
                      margin="0"
                      danger
                      onClick={() => rejectTeam(tournamentTeam.id)}
                      loading={loadingRemoveTeam}
                      disabled={
                        loadingRemoveTeam ||
                        moment().isAfter(
                          tournamentTeam.tournament.inscriptionDate.toDate()
                        )
                      }
                      type="primary"
                    >
                      REMOVER USUARIO
                    </ButtonBombo>
                    <br />
                    {tournamentTeam.inscriptionUrl &&
                      !tournamentTeam.isPayed &&
                      buttonAcceptRequest(tournamentTeam)}
                  </>
                )}
              </h3>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};
