import get from "lodash/get";
import {idealMatchesKnockOut} from "../components/common/DataList";

export const calculateScore = (tournament, team) => {
  const points =
    +(
      +get(team, "score.victories", 0) * +get(tournament, "victoriesPoints", 1)
    ) +
    +(+get(team, "score.ties", 0) * +get(tournament, "tiesPoints", 1)) +
    +(+get(team, "score.goalsFor", 0) * +get(tournament, "pointsFor", 1));

  return { ...team, score: { ...team.score, points } };
};

export const searchIdeaMatches = (totalTeams) => {
  let idealNumberOfTeams = [...idealMatchesKnockOut, totalTeams];

  idealNumberOfTeams.sort((a, b) => a - b);

  const index = idealNumberOfTeams.indexOf(totalTeams) + 1;

  return idealNumberOfTeams[index];
};

export const getPhasesPerTournament = (teams) =>
  Array.from(Array(teams).keys())
    .map((index) => (teams / (index + 1)) % 2 === 0 && teams / (index + 1) / 2)
    .filter((phase_) => phase_);
