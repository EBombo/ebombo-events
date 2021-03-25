import React, { useState } from "reactn";
import styled from "styled-components";
import get from "lodash/get";
import defaultTo from "lodash/defaultTo";
import isEmpty from "lodash/isEmpty";
import { useHistory } from "react-router";
import { ModalContainer } from "../../../../../../../components/common/ModalContainer";
import { Image } from "../../../../../../../components/common/Image";
import { Anchor } from "../../../../../../../components/common/Anchor";
import { TeamMembers } from "./TeamMembers";
import { Icon } from "../../../../../../../components/common/Icons";

const { config } = require("../../../../../../../firebase");

export const Teams = (props) => {
  const history = useHistory();
  const [isVisibleTeamMembers, setIsVisibleTeamMembers] = useState(false);
  const [currentTeamView, setCurrentTeamView] = useState(null);

  const modalTeamMembers = () => (
    <ModalContainer
      footer={null}
      visible={isVisibleTeamMembers}
      onCancel={() => setIsVisibleTeamMembers(false)}
    >
      <TeamMembers
        tournamentTeam={currentTeamView}
        setIsVisibleTeamMembers={setIsVisibleTeamMembers}
      />
    </ModalContainer>
  );

  return (
    <TournamentTeams>
      {isVisibleTeamMembers && modalTeamMembers()}
      <div className="team-members">
        {isEmpty(defaultTo(props.tournamentTeams, [])) ? (
          <div className="empty-teams">
            <div className="description">
              Por el momento no hay inscritos en este torneo.
            </div>
            <Image
              src={`${config.storageUrl}/resources/tournament/empty-teams.svg`}
              height="100px"
              width="204px"
              margin="1rem 0"
            />
          </div>
        ) : (
          defaultTo(props.tournamentTeams, []).map((team, index) => (
            <div className="team-container" key={index}>
              <div className="team">
                <Image
                  src={
                    props.tournament.rule.totalPlayers === 1
                      ? team.players[0].profileImageUrlThumb
                        ? team.players[0].profileImageUrlThumb
                        : `${config.storageUrl}/resources/perfil-icon.svg`
                      : team.teamImageUrlThumb
                      ? team.teamImageUrlThumb
                      : `${config.storageUrl}/resources/teams-default.svg`
                  }
                  size={
                    props.tournament.rule.totalPlayers === 1
                      ? team.players[0].profileImageUrlThumb
                        ? "cover"
                        : "contain"
                      : team.teamImageUrlThumb
                      ? "cover"
                      : "contain"
                  }
                  width="35px"
                  height="35px"
                  borderRadius="50%"
                />
                <div className="info">
                  <div className="team-name">
                    {props.tournament.rule.totalPlayers === 1
                      ? team.players[0].nickname
                      : get(team, "name", "")}
                  </div>
                  <div className="user-account">
                    {props.requiredUserAccount.description}:{" "}
                    <span>
                      {get(
                        props,
                        "requiredUserAccount.description",
                        ""
                      ).includes("SUPER CELL") ? (
                        <Anchor
                          underlined
                          url={get(
                            team,
                            `players[0].userAccounts.${get(
                              props,
                              "requiredUserAccount.id",
                              null
                            )}`,
                            "-"
                          )}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Link
                        </Anchor>
                      ) : (
                        get(
                          team,
                          `players[0].userAccounts.${get(
                            props,
                            "requiredUserAccount.id",
                            null
                          )}`,
                          "-"
                        )
                      )}
                    </span>
                  </div>
                </div>
                <Image
                  src={`${config.storageUrl}/resources/circle-check.svg`}
                  size="cover"
                  width="15px"
                  height="15px"
                  margin="0 1rem"
                />
              </div>
              <div className="members">
                <Anchor
                  onClick={() => {
                    if (props.tournament.rule.totalPlayers === 1)
                      return history.push(`/users/${team.players[0].id}`);
                    setCurrentTeamView(team);
                    setIsVisibleTeamMembers(true);
                  }}
                  type="primary"
                  fontSize="10px"
                >
                  {props.tournament.rule.totalPlayers === 1
                    ? "Ver Perfil"
                    : "Ver miembros"}
                </Anchor>
              </div>
            </div>
          ))
        )}
      </div>
    </TournamentTeams>
  );
};

const TournamentTeams = styled.section`
  width: 100%;
  margin: 1rem 0;

  .team-members {
    background: transparent;

    .empty-teams {
      padding: 0.5rem;

      .description {
        font-size: 12px;
        line-height: 13px;
        color: ${(props) => props.theme.basic.grayLighten};
      }
    }

    .team-container {
      margin: 0;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid ${(props) => props.theme.basic.grayDarken};

      .team {
        display: flex;
        align-items: center;
        justify-content: left;

        .info {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          .team-name {
            font-weight: 500;
            font-size: 11px;
            line-height: 14px;
          }
          .user-account {
            font-weight: 500;
            font-size: 10px;
            line-height: 12px;
            color: ${(props) => props.theme.basic.primary};
            span {
              color: ${(props) => props.theme.basic.white};
            }
          }
        }
      }
    }
  }
`;
