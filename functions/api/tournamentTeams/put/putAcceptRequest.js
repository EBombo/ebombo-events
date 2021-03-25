const {
    updateTournamentTeam,
} = require("../../../collections/tournamentTeams");
const logger = require("../../../utils/logger");
const {config} = require("../../../config");
const {fetchTournamentTeam} = require("../../../collections/tournamentTeams");
const {fetchUser} = require("../../../collections/users");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const {fetchTournament} = require("../../../collections/tournaments");
const {transaction} = require("../../../transactions");
const get = require("lodash/get");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/acceptRequest.html")
    )
    .toString();

const currency = config.currency;

exports.putAcceptRequest = async (req, res, next) => {
    logger.log("putAcceptRequest->", req.params);
    try {
        const {tournamentTeamId, userId} = req.params;

        const tournamentTeam = await fetchTournamentTeam(tournamentTeamId);
        const tournament = await fetchTournament(tournamentTeam.tournamentId);
        const user = await fetchUser(userId);

        await updateTournamentTeam(tournamentTeamId, {isPayed: true});

        await sendEmail(user.email, `INSCRITO AL TORNEO`, template, {
            name: user.name,
            email: user.email,
            applicationRootUrl: config.applicationRootUrl,
            description: `Hemos aceptado tu inscripción al torneo: ${tournament.name}`,
        });

        await transaction(
            "charge",
            user,
            +tournament.entryCost,
            `usuario pago inscripcion al torneo: ${
                tournament.name
            } el monto de ${currency} ${get(tournament, "entryCost", "")}`,
            `pago la inscripción del torneo ${tournament.id}`,
            tournament
        );

        return res.send({success: 200});
    } catch (error) {
        next(error);
    }
};
