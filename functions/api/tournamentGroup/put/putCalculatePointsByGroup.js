const {firestore} = require("../../../config");
const {isEmpty} = require("lodash");
const logger = require("../../../utils/logger");
const {calculateScore} = require("../../../business");
const {fetchMatch} = require("../../../collections/matches");
const {fetchTournamentTeam} = require("../../../collections/tournamentTeams");
const {
    updateTournamentGroup,
    fetchTournamentGroups,
} = require("../../../collections/tournamentGroups");
const {fetchTournament} = require("../../../collections/tournaments");

const putCalculatePointsByGroup = async (req, res, next) => {
    try {
        logger.log("putCalculatePointsByGroup->", req);

        const tournamentId = req.params.tournamentId;
        const tournament = await fetchTournament(tournamentId);
        const tournamentGroups = await fetchTournamentGroups(tournamentId);

        if (
            isEmpty(tournamentGroups) ||
            tournamentGroups.some((group) => group.phase !== 0)
        )
            return res.send("success");

        const groupsPromises = tournamentGroups.map((tournamentGroup) =>
            calculateScoreByGroup(tournament, tournamentGroup)
        );

        await Promise.all(groupsPromises);

        return res.send("success");
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

const calculateScoreByGroup = async (tournament, tournamentGroup) => {
    await updateTournamentGroup(tournamentGroup.id, {score: {}});

    await cleanTournamentGroupScore(tournamentGroup);

    const teams = await fetchTournamentTeamsByGroup(tournamentGroup);

    let matches = await fetchMatchesByGroup(tournamentGroup);

    matches = matches.filter(
        (match) => match.challengerAcceptResult && match.challengedAcceptResult
    );

    let score = {};

    matches.forEach((match) => {
        const challengerTeam = findTeam(teams, match.challengerTeamId);

        const challengedTeam = findTeam(teams, match.challengedTeamId);

        const score_ = calculateScore(
            tournament,
            match,
            challengerTeam,
            challengedTeam,
            score
        );

        challengerTeam.score = {...score_[match.challengerTeamId]};
        challengedTeam.score = {...score_[match.challengedTeamId]};

        score = {
            ...score,
            [match.challengerTeamId]: +score_[match.challengerTeamId].points,
            [match.challengedTeamId]: +score_[match.challengedTeamId].points,
        };

        logger.log("score->", score);
    });

    await updateTeamsNewScore(teams);

    await updateTournamentGroup(tournamentGroup.id, {score});

    logger.log("finish->", score);
};

const cleanTournamentGroupScore = async (tournamentGroup) => {
    const batchRef = firestore.batch();
    tournamentGroup.tournamentTeamIds.forEach((teamId) =>
        batchRef.update(firestore.doc("tournamentTeams/" + teamId), {score: {}})
    );
    await batchRef.commit();
};

const fetchTournamentTeamsByGroup = async (tournamentGroup) => {
    const promiseTeams = tournamentGroup.tournamentTeamIds.map(async (teamId) =>
        fetchTournamentTeam(teamId)
    );
    return await Promise.all(promiseTeams);
};

const fetchMatchesByGroup = async (tournamentGroup) => {
    const promiseMatches = tournamentGroup.matchIds.map(async (matchId) =>
        fetchMatch(matchId)
    );
    return await Promise.all(promiseMatches);
};

const updateTeamsNewScore = async (teams) => {
    const batchTeamRef = firestore.batch();
    teams.forEach((team) => {
        logger.log("new score by team->", team.id, team.score);
        batchTeamRef.update(firestore.doc("tournamentTeams/" + team.id), {
            score: team.score,
        });
    });
    await batchTeamRef.commit();
};

const findTeam = (teams, teamId) => teams.find((team) => team.id === teamId);

module.exports = {putCalculatePointsByGroup, calculateScoreByGroup};
