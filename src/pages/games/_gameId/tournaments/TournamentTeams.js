import React from "reactn";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { ItemCardTournament } from "../../../../components/tournaments/ItemCardTournament";
import isEmpty from "lodash/isEmpty";
import { EmptyTournaments } from "../consoles/_consoleId/challenges/emptyTournament";
import { mediaQuery } from "../../../../styles/constants";

export const TournamentTeamsContainer = (props) => {
  const { localTournamentTeams } = props;

  if (isEmpty(localTournamentTeams)) return <EmptyTournaments type={"teams"} />;

  return (
    <TournamentTeamsContainerCss>
      <div className="container-tournaments">
        {localTournamentTeams.map((team) => (
          <ItemCardTournament
            tournament={team.tournament}
            team={team}
            key={`key-tournament-${team.tournament.id}`}
            update
          />
        ))}
      </div>
    </TournamentTeamsContainerCss>
  );
};

const TournamentTeamsContainerCss = styled.div`
  ${mediaQuery.afterTablet} {
    .container-tournaments {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      justify-content: center;
      padding: 1rem;
    }
  }
`;
