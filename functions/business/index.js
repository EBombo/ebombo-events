const moment = require("moment");
const get = require("lodash/get");

const idealMatchesKnockOut = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

exports.searchIdeaMatches = (totalTeams) => {
    if (idealMatchesKnockOut.includes(totalTeams)) return totalTeams;

    let idealNumberOfTeams = [...idealMatchesKnockOut, totalTeams];

    idealNumberOfTeams.sort((a, b) => a - b);

    const index = idealNumberOfTeams.indexOf(totalTeams) + 1;

    return idealNumberOfTeams[index];
};

exports.getPhasesPerTournament = (teams) =>
    Array.from(Array(teams).keys())
        .map((index) => (teams / (index + 1)) % 2 === 0 && teams / (index + 1) / 2)
        .filter((phase_) => phase_);

exports.formatScore = (tournament, team) => {
    const points =
        +(
            +get(team, "score.victories", 0) * +get(tournament, "victoriesPoints", 1)
        ) +
        +(+get(team, "score.ties", 0) * +get(tournament, "tiesPoints", 1)) +
        +(+get(team, "score.goalsFor", 0) * +get(tournament, "pointsFor", 1));

    return {...team, score: {...team.score, points}};
};

exports.calculateScore = (
    tournament,
    match,
    challengerTeam,
    challengedTeam,
    score_
) => {
    let score = score_;

    score[match.challengerTeamId] = {};
    score[match.challengedTeamId] = {};

    const challengerPoints = +match.challengerPoints.reduce((a, b) => a + b, 0);
    const challengedPoints = +match.challengedPoints.reduce((a, b) => a + b, 0);

    if (challengerPoints > challengedPoints) {
        score[match.challengerTeamId].victories =
            +get(challengerTeam, "score.victories", 0) + 1;
        score[match.challengedTeamId].defeats =
            +get(challengedTeam, "score.defeats", 0) + 1;

        score[match.challengedTeamId].victories = +get(
            challengedTeam,
            "score.victories",
            0
        );
        score[match.challengerTeamId].defeats = +get(
            challengerTeam,
            "score.defeats",
            0
        );

        score[match.challengerTeamId].ties = +get(challengerTeam, "score.ties", 0);
        score[match.challengedTeamId].ties = +get(challengedTeam, "score.ties", 0);
    }

    if (challengedPoints > challengerPoints) {
        score[match.challengedTeamId].victories =
            +get(challengedTeam, "score.victories", 0) + 1;
        score[match.challengerTeamId].defeats =
            +get(challengerTeam, "score.defeats", 0) + 1;

        score[match.challengerTeamId].victories = +get(
            challengerTeam,
            "score.victories",
            0
        );
        score[match.challengedTeamId].defeats = +get(
            challengedTeam,
            "score.defeats",
            0
        );

        score[match.challengerTeamId].ties = +get(challengerTeam, "score.ties", 0);
        score[match.challengedTeamId].ties = +get(challengedTeam, "score.ties", 0);
    }

    if (challengerPoints === challengedPoints) {
        score[match.challengerTeamId].ties =
            +get(challengerTeam, "score.ties", 0) + 1;
        score[match.challengedTeamId].ties =
            +get(challengedTeam, "score.ties", 0) + 1;

        score[match.challengerTeamId].victories = +get(
            challengerTeam,
            "score.victories",
            0
        );
        score[match.challengedTeamId].victories = +get(
            challengedTeam,
            "score.victories",
            0
        );

        score[match.challengerTeamId].defeats = +get(
            challengerTeam,
            "score.defeats",
            0
        );
        score[match.challengedTeamId].defeats = +get(
            challengedTeam,
            "score.defeats",
            0
        );
    }

    score[match.challengerTeamId].matchesPlayed =
        +get(challengerTeam, "score.matchesPlayed", 0) + 1;
    score[match.challengedTeamId].matchesPlayed =
        +get(challengedTeam, "score.matchesPlayed", 0) + 1;

    score[match.challengerTeamId].goalsFor =
        +get(challengerTeam, "score.goalsFor", 0) + challengerPoints;
    score[match.challengedTeamId].goalsFor =
        +get(challengedTeam, "score.goalsFor", 0) + challengedPoints;

    score[match.challengerTeamId].goalsAgainst =
        +get(challengerTeam, "score.goalsAgainst", 0) + challengedPoints;
    score[match.challengedTeamId].goalsAgainst =
        +get(challengedTeam, "score.goalsAgainst", 0) + challengerPoints;

    score[match.challengerTeamId].average =
        +get(score[match.challengerTeamId], "goalsFor", 0) -
        +get(score[match.challengerTeamId], "goalsAgainst", 0);
    score[match.challengedTeamId].average =
        +get(score[match.challengedTeamId], "goalsFor", 0) -
        +get(score[match.challengedTeamId], "goalsAgainst", 0);

    score[match.challengerTeamId].points =
        +(
            +get(score[match.challengerTeamId], "victories", 0) *
            +get(tournament, "victoriesPoints", 1)
        ) +
        +(
            +get(score[match.challengerTeamId], "ties", 0) *
            +get(tournament, "tiesPoints", 1)
        ) +
        +get(score[match.challengerTeamId], "goalsFor") *
        +get(tournament, "pointsFor", 1);

    score[match.challengedTeamId].points =
        +(
            +get(score[match.challengedTeamId], "victories", 0) *
            +get(tournament, "victoriesPoints", 1)
        ) +
        +(
            +get(score[match.challengedTeamId], "ties", 0) *
            +get(tournament, "tiesPoints", 1)
        ) +
        +(
            +get(score[match.challengedTeamId], "goalsFor") *
            +get(tournament, "pointsFor", 1)
        );

    return score;
};

exports.finishTimeByRule = (rule, startDate = new Date()) =>
    moment(startDate)
        .add(
            moment(get(rule, "duration", "0:30:0"), "HH:mm:ss").get("hours"),
            "hours"
        )
        .add(
            moment(get(rule, "duration", "0:30:0"), "HH:mm:ss").get("minutes"),
            "minutes"
        )
        .add(
            moment(get(rule, "duration", "0:30:0"), "HH:mm:ss").get("seconds"),
            "seconds"
        )
        .toDate();
