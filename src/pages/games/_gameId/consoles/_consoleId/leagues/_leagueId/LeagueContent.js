import React from "react";
import styled from "styled-components";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { LeaguesTabs } from "../../../../../../../components/common/DataList";
import {
  ContentPositionTree,
  ContentTableStatistics,
} from "../../../../../../../components";
import { LeagueTeams } from "./teams/LeagueTeams";
import { Team } from "./teams/_teamId";
import { useHistory, useLocation, useParams } from "react-router";
import { TeamDetails } from "./teams/_teamId/details";
import { LeagueDescription } from "./LeagueDescription";
import { CardDates } from "../../tournaments/_tournamentId/CardDates";
import { mediaQuery } from "../../../../../../../styles/constants";

export const LeagueContent = (props) => {
  const history = useHistory();
  const location = useLocation();
  const { teamId } = useParams();

  const getTeamByTeamId = (teamId) =>
    props.leagueTeams.find((team) => team.id === teamId);

  const containerTab = () => {
    if (
      location.pathname.includes("teams") &&
      location.pathname.includes("details")
    )
      return (
        <TeamDetails
          teams={props.leagueTeams}
          key={get(props, "leagueTeams", []).length}
        />
      );

    if (
      location.pathname.includes("teams") &&
      location.pathname.includes("members")
    )
      return (
        <LeagueDescription
          isMembers
          requirements={get(
            get(props, "leagueTeams").find((team) => team.id === teamId),
            "members",
            []
          )}
          team={get(props, "leagueTeams").find((team) => team.id === teamId)}
        />
      );

    if (location.pathname.includes("dates"))
      return (
        <DatesContainer>
          <CardDates tournament={props.league} tournamentMatches={null} />
        </DatesContainer>
      );

    if (location.pathname.includes("teams"))
      return (
        <div>
          <LeagueTeams teams={props.leagueTeams} {...props} />
          <Team team={getTeamByTeamId(teamId)} />
        </div>
      );

    return (
      <div>
        {!isEmpty(props.leagueGroups) ? (
          <>
            {["knock-out"].includes(props.league.tournamentType) ? (
              <ContentPositionTree
                {...props}
                tournament={props.league}
                tournamentGroups={get(props, "leagueGroups", []).filter(
                  (groups) => get(groups, "phase") !== 0
                )}
              />
            ) : (
              <ContentTableStatistics
                tournament={props.league}
                tournamentTeams={props.leagueTeams}
                tournamentGroups={get(props, "leagueGroups", []).filter(
                  (groups) => get(groups, "phase") === 0
                )}
              />
            )}
          </>
        ) : (
          <div className="title-primary">
            Una vez se cierren las fechas de inscripcción las llaves serán
            creadas
          </div>
        )}
      </div>
    );
  };

  return (
    <Container>
      <ContainerTabs>
        {LeaguesTabs.map((option) => (
          <ContentOption
            key={option.name}
            selected={location.pathname.includes(option.key)}
            onClick={() =>
              option.key.includes("teams")
                ? history.push(
                    `/games/${props.league.game.id}/consoles/${
                      props.league.console.id
                    }/leagues/${props.league.id}/${option.key}${
                      props.leagueTeams[0] ? `/${props.leagueTeams[0].id}` : ""
                    }`
                  )
                : history.push(
                    `/games/${props.league.game.id}/consoles/${props.league.console.id}/leagues/${props.league.id}/${option.key}`
                  )
            }
          >
            <div className="item">
              <span className="item-name"> {get(option, "name", "name")} </span>
            </div>
          </ContentOption>
        ))}
      </ContainerTabs>
      {containerTab()}
    </Container>
  );
};

const DatesContainer = styled.div`
  max-width: 100%;
  overflow-x: auto;
`;

const Container = styled.div``;

const ContainerTabs = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  background: ${(props) => props.theme.basic.blackDarken};
  padding: 0 20px;
`;

const ContentOption = styled.div`
  .item {
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    min-width: 4.5rem;
    animation: ease-in 0.5s;
    height: 100%;
    border-bottom: ${(props) =>
      props.selected ? `3px solid ${props.theme.basic.primary}` : `0px`};

    span {
      color: ${(props) => props.theme.basic.primary};
      text-align: center;
      margin: 8px 0;
      font-size: 1rem;
    }
  }
`;
