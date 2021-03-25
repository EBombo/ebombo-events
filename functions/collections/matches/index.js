const {finishTimeByRule} = require("../../business");
const {firestore} = require("../../config");
const get = require("lodash/get");

const fetchMatch = async (matchId) => {
    const matchRef = await firestore.doc(`matches/${matchId}`).get();
    return matchRef.data();
};

const updateMatch = async (matchId, newMatch) =>
    await firestore.doc(`matches/${matchId}`).update(newMatch);

const newMatch = async (matchId, newMatch) =>
    await firestore
        .collection("matches")
        .doc(matchId)
        .set(newMatch, {merge: true});

const deletedMatch = async (matchId) =>
    await firestore.collection("matches").doc(matchId).delete();

const mapMatchToTournament = (group, tournament, matchId) => ({
    id: matchId,
    challengerReady: true,
    challengerTeamName: get(group, "tournamentTeams[0].name", null),
    challengerTeamImageUrlThumb: get(
        group,
        "tournamentTeams[0].teamImageUrlThumb",
        null
    ),
    challenger: group.tournamentTeams[0].players,
    challengerTeamId: group.tournamentTeams[0].id,
    challengerIds: group.tournamentTeams[0].playerIds,
    challengerStreamUrl: get(group, "tournamentTeams[0].streamUrl", ""),
    challengedStreamUrl: get(group, "tournamentTeams[1].streamUrl", ""),
    challengedTeamName: get(group, "tournamentTeams[1].name", null),
    challengedTeamImageUrlThumb: get(
        group,
        "tournamentTeams[1].teamImageUrlThumb",
        null
    ),
    challenged: group.tournamentTeams[1].players,
    challengedTeamId: group.tournamentTeams[1].id,
    challengedIds: group.tournamentTeams[1].playerIds,
    playersIds: group.tournamentTeams[0].playerIds.concat(
        group.tournamentTeams[1].playerIds
    ),
    rule: tournament.rule,
    game: tournament.game,
    console: tournament.console,
    gameEntryCost: 0,
    createAt: group.startDate,
    updateAt: new Date(),
    isCanceled: false,
    isClosed: false,
    additionalRule: null,
    challengerAcceptInvitation: group.tournamentTeams[0].playerIds,
    challengedAcceptInvitation: group.tournamentTeams[1].playerIds,
    finishAt: finishTimeByRule(tournament.rule, group.startDate),
    tournamentId: tournament.id,
    tournament,
    tournamentGroupId: group.id,
    updatePoints: get(tournament, "updatePoints", true),
});

module.exports = {
    fetchMatch,
    updateMatch,
    newMatch,
    mapMatchToTournament,
    deletedMatch,
};
