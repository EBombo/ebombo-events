const {firestore, config} = require("../../../config");
const {sendEmail} = require("../../../email/sendEmail");
const fs = require("file-system");
const path = require("path");
const {get, assign} = require("lodash");
const logger = require("../../../utils/logger");
const {fetchMatch} = require("../../../collections/matches");

const template = fs
    .readFileSync(
        path.join(__dirname, "../../../email/templates/matchClaim.html")
    )
    .toString();

const putEvidence = async (req, res, next) => {
    try {
        logger.log("adding evidence");

        const matchId = req.params.matchId;
        const claim = req.body;
        claim.createAt = new Date();

        const match = await fetchMatch(matchId);

        const userRol = isChallenger(match, claim.userId)
            ? "challenger"
            : "challenged";
        const user = get(match, userRol, null);
        user.rol = userRol;

        const opponentRol = !isChallenger(match, claim.userId)
            ? "challenger"
            : "challenged";
        const opponent = get(match, opponentRol, null);
        opponent.rol = opponentRol;

        const promiseAddClaim = addClaim(match, claim, user);
        const promiseSendEmail = sendEmail_(match, claim, user[0], opponent[0]);

        await Promise.all([promiseAddClaim, promiseSendEmail]);

        return res.send(200);
    } catch (error) {
        logger.error("Put Evidence", error);
        next(error);
    }
};

const isChallenger = (match, userId) =>
    get(match, "challengerIds", []).includes(userId);

const addClaim = async (match, claim, user) => {
    await firestore
        .collection("matches")
        .doc(match.id)
        .update({
            [`${user.rol}Claim`]: mapClaim(claim, user),
        });
};

const mapClaim = (claim, user) =>
    assign({}, claim, {
        userId: user[0].id,
    });

const sendEmail_ = async (match, claim, user, opponent) =>
    await sendEmail(config.mails, "Queja de partido", template, {
        matchId: match.id,
        userFullName: `${user.name} ${user.lastName}`,
        userNickname: user.nickname,
        opponentFullName: `${opponent.name} ${opponent.lastName}`,
        opponentNickname: opponent.nickname,
        applicationRootUrl: config.applicationRootUrl,
        claimMessage: claim.message,
        claimImageUrl: claim.imageUrl,
    });

module.exports = {putEvidence};
