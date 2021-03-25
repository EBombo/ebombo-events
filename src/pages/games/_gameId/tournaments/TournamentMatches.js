import React from "reactn";
import styled from "styled-components";
import { ItemTournamentMatch } from "./ItemTournamentMatch";
import { EmptyTournaments } from "../consoles/_consoleId/challenges/emptyTournament";
import isEmpty from "lodash/isEmpty";

export const TournamentMatchesContainer = (props) => {
  const { tournamentMatches } = props;

  return (
    <TournamentMatchesContainerCss>
      {isEmpty(tournamentMatches) ? (
        <EmptyTournaments type="matches" />
      ) : (
        tournamentMatches.map((match) => (
          <ItemTournamentMatch {...match} key={`key-match-${match.id}`} />
        ))
      )}
    </TournamentMatchesContainerCss>
  );
};

const TournamentMatchesContainerCss = styled.div`
  width: 100%;
`;
