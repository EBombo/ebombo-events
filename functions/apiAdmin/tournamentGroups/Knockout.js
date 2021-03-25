const {config, firestore} = require("../../config");
const moment = require("moment");
const {defaultTo, isEmpty, chunk, orderBy, get, flatMap} = require("lodash");
const {
    fetchTournamentTeamsByTournament,
} = require("../../collections/tournamentTeams");
const {searchIdeaMatches, getPhasesPerTournament} = require("../../business");
const {
    fetchGroupsByTournament,
} = require("../../collections/tournamentGroups");
const {fetchTournament} = require("../../collections/tournaments");
const {mapMatchToTournament} = require("../../collections/matches");
const {formatScore} = require("../../business");
const logger = require("../../utils/logger");

const Knockout = async (req, res, next) => {
    try {
        logger.log("Knockout", req.params, req.body);

        const {tournamentId} = req.params;
        let {dateMatches} = req.body;

        dateMatches = new Date(dateMatches);

        const promiseTournament = fetchTournament(tournamentId);
        const promiseTournamentGroups = fetchGroupsByTournament(tournamentId);
        let promiseTournamentTeams = fetchTournamentTeamsByTournament(tournamentId);

        const responsePromise = await Promise.all([
            promiseTournament,
            promiseTournamentGroups,
            promiseTournamentTeams,
        ]);

        const tournament = responsePromise[0];
        const tournamentGroups = responsePromise[1];
        let tournamentTeams = responsePromise[2];

        const tournamentPhases = phasesByTournament(tournament, tournamentGroups);
        logger.log("tournamentPhases", tournamentPhases);

        const lastGroups = getLastGroups(tournamentGroups);
        logger.log("lastGroups", lastGroups.length, lastGroups);

        if (tournament.tournamentType === "groupko")
            tournamentTeams = getWinnersByGroup(
                lastGroups,
                tournamentTeams,
                tournament
            );

        logger.log("tournamentTeams", tournamentTeams.length, tournamentTeams);

        const phasesWithGroups = generateKo(
            tournament,
            tournamentPhases,
            tournamentTeams,
            dateMatches
        );

        logger.log("phasesWithGroups", phasesWithGroups);

        const promiseByPhase = phasesWithGroups.map(async (groups) => {
            const {teamsPlayingWithBoot, groupsToFirebase} = groups;
            let promiseAutoWin = null;

            if (!isEmpty(teamsPlayingWithBoot))
                promiseAutoWin = autoWinTeamsPlayingWithBoot(teamsPlayingWithBoot);

            const promiseGroups = createGroups(groupsToFirebase);

            const promiseMatches = createMatches(groupsToFirebase, tournament);

            await Promise.all([promiseAutoWin, promiseGroups, promiseMatches]);
        });

        await Promise.all(promiseByPhase);

        return res.send(200);
    } catch (error) {
        logger.log(error);
        next(error);
    }
};

const phasesByTournament = (tournament, tournamentGroups) => {
    let totalTeams = tournament.countTournamentTeams;

    if (tournament.tournamentType === "groupko" && !isEmpty(tournamentGroups))
        totalTeams = getTotalWinnerByGroup(tournamentGroups);
    logger.log("total teams->", totalTeams);

    totalTeams = searchIdeaMatches(totalTeams);
    logger.log("new totalTeams [ideal]->", totalTeams);

    const tournamentPhases = getPhasesPerTournament(totalTeams);
    logger.log("tournamentPhases->", tournamentPhases);

    return tournamentPhases;
};

const getTotalWinnerByGroup = (tournamentGroups) =>
    tournamentGroups
        .filter((group) => group.phase === 0)
        .reduce((sum, group) => sum + defaultTo(group.amountWinners, 1), 0);

const getLastGroups = (tournamentGroups_, phase = 0) =>
    tournamentGroups_.filter((group) => group.phase === phase);

const getWinnersByGroup = (
    lastGroups,
    tournamentTeams,
    tournament,
    phase = 0
) => {
    const tournamentTeamsWinners = lastGroups.map((group_) => {
        const teamWinners = teamsByGroup(tournament, group_, tournamentTeams);
        return teamWinners.slice(0, get(group_, "amountWinners", 1));
    });

    if (phase === 0 && tournament.tournamentType === "groupko")
        return generateMatchesToKo(tournamentTeamsWinners);

    return flatMap(tournamentTeamsWinners);
};

const teamsByGroup = (tournament, group_, tournamentTeams) => {
    const teams = group_.tournamentTeams.map((teamGroup) => {
        const team = tournamentTeams.find((team_) => team_.id === teamGroup.id);
        return formatScore(tournament, team);
    });
    return orderTeamsByScores(teams);
};

const generateMatchesToKo = (tournamentTeamsWinners) => {
    let tops = tournamentTeamsWinners.map((item) => item.shift());
    let remaining = flatMap(tournamentTeamsWinners).reverse();

    let groups = flatMap(tops.map((team) => [team, remaining.shift()]));

    return [...flatMap(groups), ...remaining];
};

const orderTeamsByScores = (teams_) =>
    orderBy(
        teams_,
        [
            (team_) => get(team_, "score.points", 0),
            (team_) => get(team_, "score.average", 0),
            (team_) => get(team_, "score.goalsFor", 0),
            (team_) => get(team_, "score.goalsAgainst", 0),
            (team_) => get(team_, "createAt", moment()).toDate(),
        ],
        ["desc", "desc", "desc", "asc", "asc"]
    );

const generateKo = (
    tournament,
    tournamentPhases,
    tournamentTeams,
    dateMatches
) => {
    let teamsWithBoot = tournamentTeams;

    return tournamentPhases.map((totalGroups, phase) => {
        logger.log("phase", phase, "totalGroups", totalGroups);
        let groupsByPhase = [];

        if (phase < 1)
            teamsWithBoot = mergeTeamsWithBoot(totalGroups, teamsWithBoot);

        if (!isEmpty(tournamentTeams)) groupsByPhase = chunk(teamsWithBoot, 2);

        logger.log("groupsByPhase", groupsByPhase.length, teamsWithBoot.length);

        const {groupsToFirebase, teamsPlayingWithBoot} = generateToGroups(
            tournament,
            groupsByPhase,
            totalGroups,
            phase,
            dateMatches
        );

        teamsWithBoot = teamsPlayingWithBoot;

        return {groupsToFirebase, teamsPlayingWithBoot};
    });
};

const generateToGroups = (
    tournament,
    groupsByPhase,
    totalGroups,
    phase,
    dateMatches
) => {
    let teamsPlayingWithBoot = [];

    const currentTotalGroups =
        totalGroups === 1 && tournament.additionalMatch
            ? totalGroups + 1
            : totalGroups;

    const groupsToFirebase = Array.from(Array(currentTotalGroups).keys()).map(
        (index) => {
            const teamsByGroup = groupsByPhase[index];

            console.log(
                "phase",
                phase,
                "index",
                index,
                "teamsByGroup",
                get(teamsByGroup, "length", "vacio")
            );

            let newGroup = mapGroup(
                tournament.id,
                phase,
                teamsByGroup,
                tournament.additionalMatch && totalGroups === 1 && index === 1,
                index,
                dateMatches
            );

            if (
                defaultTo(teamsByGroup, []).some((team) =>
                    defaultTo(team.teamImageUrlThumb, "").includes("bot")
                )
            ) {
                const winnerTeam = teamsByGroup.find((team) => team.id);
                newGroup.winnerId = winnerTeam.id;
                newGroup.score = {[winnerTeam.id]: 1, null: 0};
                teamsPlayingWithBoot.push({
                    ...winnerTeam,
                    id: winnerTeam.id,
                    score: {...winnerTeam.score, points: 1},
                });

                logger.log("group with bot", newGroup.winnerId, newGroup.score);
                return newGroup;
            }

            if (newGroup.totalPlayers === 2) {
                const matchId = firestore.collection("matches").doc().id;
                newGroup.matchIds = [matchId];
            }

            logger.log("group without bot", newGroup.matchIds);
            return newGroup;
        }
    );

    logger.log("groupsToFirebase->", groupsToFirebase);
    logger.log("teamsPlayingWithBoot->", teamsPlayingWithBoot);

    return {groupsToFirebase, teamsPlayingWithBoot};
};

const mergeTeamsWithBoot = (totalGroups, teams) => {
    let newTeams = [...teams];
    let index = 1;
    while (totalGroups * 2 > newTeams.length) {
        newTeams.splice(index, 0, computerTeam);
        index += 2;
    }
    return newTeams;
};

const computerTeam = {
    id: null,
    teamImageUrlThumb: `${config.storageUrl}/resources/bot.svg`,
    players: [
        {
            nickname: "bot",
            profileImageUrlThumb: `${config.storageUrl}/resources/bot.svg`,
        },
    ],
};

const mapGroup = (
    tournamentId,
    phase,
    teams = [],
    additionalMatch,
    index,
    dateMatches
) => ({
    id: firestore.collection("tournamentGroups").doc().id,
    name: `FASE ${phase + 1} GRUPO ${index + 1}`,
    totalPlayers: teams.length,
    startDate: dateMatches,
    createAt: new Date(),
    updateAt: new Date(),
    deleted: false,
    tournamentId: tournamentId,
    score: {},
    additionalMatch: additionalMatch,
    tournamentTeams: teams,
    tournamentTeamIds: teams.map((team) => team.id),
    matchIds: null,
    phase: phase + 1,
    index: index,
});

const createMatches = async (groups, tournament) => {
    logger.log("createMatches->", groups.length);
    const batchRef = firestore.batch();

    groups.forEach((group) =>
        defaultTo(group.matchIds, []).forEach((matchId) => {
            const match = mapMatchToTournament(group, tournament, matchId);
            batchRef.set(firestore.doc("matches/" + matchId), match);
        })
    );

    await batchRef.commit();
};

const autoWinTeamsPlayingWithBoot = async (teams) => {
    logger.log("saveTeamsPlayingWithBoot->", teams.length);
    const batchRef = firestore.batch();

    teams.forEach((team) =>
        batchRef.update(firestore.doc(`tournamentTeams/${team.id}`), {
            score: team.score,
        })
    );

    await batchRef.commit();
};

const createGroups = async (groups) => {
    logger.log("createGroups->", groups.length);
    const batchRef = firestore.batch();

    groups.forEach((group) =>
        batchRef.set(firestore.doc("tournamentGroups/" + group.id), group)
    );

    await batchRef.commit();
};

module.exports = {Knockout};
