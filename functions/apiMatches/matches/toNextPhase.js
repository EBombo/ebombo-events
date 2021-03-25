const {deletedMatch} = require("../../collections/matches");
const {mapMatchToTournament} = require("../../collections/matches");
const {newMatch} = require("../../collections/matches");
const {updateTournamentGroup} = require("../../collections/tournamentGroups");
const {
    fetchTournamentGroupsByPhase,
} = require("../../collections/tournamentGroups");
const {orderBy, defaultTo, isEmpty} = require("lodash");
const {firestore} = require("../../config");
const logger = require("../../utils/logger");

const toNextPhase = async (
    tournament,
    tournamentGroup,
    challengerTeam,
    challengedTeam,
    challengerPoints,
    challengedPoints
) => {
    //get groups the next phase
    let nextGroups = await fetchTournamentGroupsByPhase(
        tournament.id,
        tournamentGroup.phase + 1
    );
    if (isEmpty(nextGroups)) return logger.log("this is the last phase");

    //order by index
    nextGroups = orderGroupByIndex(nextGroups);

    //calculate index the next group
    const indexNextGroup = Math.floor(tournamentGroup.index / 2);
    logger.log("indexNextGroup", indexNextGroup);

    //get the next group
    let nextGroup = nextGroups[indexNextGroup];
    let additionalGroup = nextGroups.find((group) => group.additionalMatch);

    logger.log("nextGroup", nextGroup.id);
    additionalGroup && logger.log("additionalGroup", additionalGroup.id);

    //if change score => and exist match => delete to create again => with new winner
    if (nextGroup.matchIds) await deletedMatch(nextGroup.matchIds[0]);
    if (additionalGroup && additionalGroup.matchIds)
        await deletedMatch(additionalGroup.matchIds[0]);

    //get winners and loser
    const winnerTeam =
        challengerPoints > challengedPoints ? challengerTeam : challengedTeam;
    const loserTeam =
        challengerPoints > challengedPoints ? challengedTeam : challengerTeam;

    //current teams to filter
    const currentTeamIds = [challengedTeam.id, challengerTeam.id];
    logger.log("currentTeamIds", currentTeamIds);

    //map to nextGroup
    nextGroup = mapNextGroup(currentTeamIds, nextGroup, winnerTeam);

    //map additional group
    additionalGroup = additionalGroup
        ? mapNextGroup(currentTeamIds, additionalGroup, loserTeam)
        : null;

    //create array to update groups + additional
    nextGroup = [nextGroup, additionalGroup];

    const promises = nextGroup.map(async (group) => {
        if (!group) return; //no exist additional return

        let promiseMatch = null;
        if (group.tournamentTeams.length === 2) {
            group.matchIds = [firestore.collection("matches").doc().id];
            const match = mapMatchToTournament(group, tournament, group.matchIds[0]);
            promiseMatch = await newMatch(group.matchIds[0], match);
        }

        const promiseGroup = await updateTournamentGroup(group.id, {
            ...group,
        });
        await Promise.all([promiseMatch, promiseGroup]);
    });

    await Promise.all(promises);
};

const mapNextGroup = (currentTeamIds, nextGroup, teamToAdd) => {
    //filter current teams => add winner
    nextGroup.tournamentTeams = [
        ...defaultTo(nextGroup.tournamentTeams, []).filter(
            (team) => !currentTeamIds.includes(team.id)
        ),
        teamToAdd,
    ];

    //filter current teams ids => add winner ids
    nextGroup.tournamentTeamIds = [
        ...defaultTo(nextGroup.tournamentTeamIds, []).filter(
            (teamId) => !currentTeamIds.includes(teamId)
        ),
        teamToAdd.id,
    ];

    nextGroup.startDate = new Date();
    nextGroup.totalPlayers = defaultTo(nextGroup.tournamentTeamIds, []).length;

    logger.log("nextGroup", nextGroup);
    return nextGroup;
};

const orderGroupByIndex = (tournamentGroups_) =>
    orderBy(tournamentGroups_, ["index"], ["asc"]);

module.exports = {toNextPhase};
